import path from 'node:path';
import { loadOcrsInput } from '../src/ocrs-input.js';
import { type OcrsPackage, type VersionedRecord } from '../src/ocrs-types.js';
import { packageContentHash } from '../src/package-integrity.js';
import { allRecords } from '../src/package-validator.js';
import { applyMutations, type ValidFixture } from '../src/fixture-mutations.js';
import { loadJsonFile } from '../src/schema-loader.js';

export function readyPackage(): OcrsPackage {
  return loadOcrsInput(
    path.join(process.cwd(), 'examples', 'cw-101-reference', 'rfdc-ready.package.json'),
  );
}

export function notReadyPackage(): OcrsPackage {
  return loadOcrsInput(
    path.join(process.cwd(), 'examples', 'cw-101-reference', 'rfdc-not-ready.scenario.json'),
  );
}

export function addRecord(
  pkg: OcrsPackage,
  collection: keyof OcrsPackage,
  record: VersionedRecord,
): void {
  (pkg[collection] as VersionedRecord[]).push(record);
  pkg.manifest.inventory.push({
    recordId: record.id,
    entityType: record.entityType,
    recordVersion: record.recordVersion,
  });
}

export function rehash(pkg: OcrsPackage): OcrsPackage {
  pkg.manifest.contentHash = {
    algorithm: 'sha256',
    value: packageContentHash(pkg as unknown as Record<string, unknown>),
  };
  return pkg;
}

export function validFixturePackage(fileName: string): OcrsPackage {
  const fixture = loadJsonFile<ValidFixture>(
    path.join(process.cwd(), 'conformance', 'valid', fileName),
  );
  const pkg = applyMutations(readyPackage(), fixture.mutations);
  pkg.manifest.inventory = allRecords(pkg).map((record) => ({
    recordId: record.id,
    entityType: record.entityType,
    recordVersion: record.recordVersion,
  }));
  return rehash(pkg);
}
