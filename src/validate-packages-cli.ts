import path from 'node:path';
import { listJsonFiles, loadJsonFile } from './schema-loader.js';
import { createSchemaContext } from './schema-validation.js';
import { allRecords, validateOcrsPackage } from './package-validator.js';
import {
  applyFixtureMutation,
  applyMutations,
  type InvalidFixture,
  type ValidFixture,
} from './fixture-mutations.js';
import { loadOcrsInput } from './ocrs-input.js';
import { type OcrsPackage } from './ocrs-types.js';
import { packageContentHash } from './package-integrity.js';

const root = process.cwd();
const mode = process.argv[2] ?? 'valid';
const context = createSchemaContext(root);
const validFiles = [
  path.join(root, 'examples', 'cw-101-reference', 'rfdc-ready.package.json'),
  path.join(root, 'examples', 'cw-101-reference', 'rfdc-not-ready.scenario.json'),
];

if (mode === 'valid' || mode === 'references') {
  if (mode === 'valid') {
    for (const [schemaId, file] of [
      [
        'https://spec.ocrs.dev/v0.1/schemas/rfdc-profile.schema.json',
        path.join(root, 'profiles', 'rfdc', 'profile.json'),
      ],
      [
        'https://spec.ocrs.dev/v0.1/schemas/icxa-profile-manifest.schema.json',
        path.join(root, 'profiles', 'icxa', 'profile-manifest.json'),
      ],
    ] as const) {
      const validator = context.ajv.getSchema(schemaId);
      if (!validator || !validator(loadJsonFile(file)))
        throw new Error(`Profile validation failed: ${file} ${JSON.stringify(validator?.errors)}`);
      console.log(`Valid profile: ${path.relative(root, file)}`);
    }
  }
  for (const file of validFiles) {
    const diagnostics = validateOcrsPackage(loadOcrsInput(file), context);
    if (diagnostics.length)
      throw new Error(`${file} failed:\n${JSON.stringify(diagnostics, null, 2)}`);
    console.log(
      `${mode === 'references' ? 'Reference integrity verified' : 'Valid OCRS package'}: ${path.relative(root, file)}`,
    );
  }
  if (mode === 'valid') {
    const base = loadOcrsInput(validFiles[0]);
    const fixtures = listJsonFiles(path.join(root, 'conformance', 'valid')).filter((file) =>
      file.endsWith('.fixture.json'),
    );
    for (const file of fixtures) {
      const fixture = loadJsonFile<ValidFixture>(file);
      const pkg = synchronizeFixturePackage(applyMutations(base, fixture.mutations));
      const diagnostics = validateOcrsPackage(pkg, context);
      if (diagnostics.length)
        throw new Error(`${file} failed:\n${JSON.stringify(diagnostics, null, 2)}`);
      const ids = new Set(allRecords(pkg).map((record) => record.id));
      if (!fixture.expectedRecordIds.every((id) => ids.has(id)))
        throw new Error(`${file} did not produce every expected record.`);
      console.log(`Valid Level 2 fixture: ${path.relative(root, file)}`);
    }
  }
} else if (mode === 'invalid') {
  const base = loadJsonFile<OcrsPackage>(validFiles[0]);
  const fixtures = listJsonFiles(path.join(root, 'conformance', 'invalid')).filter((file) =>
    file.endsWith('.fixture.json'),
  );
  for (const file of fixtures) {
    const fixture = loadJsonFile<InvalidFixture>(file);
    const fixtureBase = fixture.baseValidFixture
      ? synchronizeFixturePackage(
          applyMutations(
            base,
            loadJsonFile<ValidFixture>(
              path.join(root, 'conformance', 'valid', fixture.baseValidFixture),
            ).mutations,
          ),
        )
      : base;
    const diagnostics = validateOcrsPackage(applyFixtureMutation(fixtureBase, fixture), context);
    if (!diagnostics.some((item) => item.code === fixture.expectedCode)) {
      throw new Error(
        `${file} expected ${fixture.expectedCode}, received ${JSON.stringify(diagnostics, null, 2)}`,
      );
    }
    console.log(`Expected failure ${fixture.expectedCode}: ${path.relative(root, file)}`);
  }
} else {
  throw new Error(`Unknown validation mode ${mode}.`);
}

function synchronizeFixturePackage(pkg: OcrsPackage): OcrsPackage {
  pkg.manifest.inventory = allRecords(pkg).map((record) => ({
    recordId: record.id,
    entityType: record.entityType,
    recordVersion: record.recordVersion,
  }));
  pkg.manifest.contentHash = {
    algorithm: 'sha256',
    value: packageContentHash(pkg as unknown as Record<string, unknown>),
  };
  return pkg;
}
