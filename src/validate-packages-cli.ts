import path from 'node:path';
import { listJsonFiles, loadJsonFile } from './schema-loader.js';
import { createSchemaContext } from './schema-validation.js';
import { validateOcrsPackage } from './package-validator.js';
import { applyFixtureMutation, type InvalidFixture } from './fixture-mutations.js';
import { loadOcrsInput } from './ocrs-input.js';

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
} else if (mode === 'invalid') {
  const base = loadJsonFile(validFiles[0]);
  const fixtures = listJsonFiles(path.join(root, 'conformance', 'invalid')).filter((file) =>
    file.endsWith('.fixture.json'),
  );
  for (const file of fixtures) {
    const fixture = loadJsonFile<InvalidFixture>(file);
    const diagnostics = validateOcrsPackage(applyFixtureMutation(base, fixture), context);
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
