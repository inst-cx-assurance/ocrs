import path from 'node:path';
import { loadOcrsInput } from '../src/ocrs-input.js';
import { type OcrsPackage, type VersionedRecord } from '../src/ocrs-types.js';

export function readyPackage(): OcrsPackage {
  return loadOcrsInput(path.join(process.cwd(), 'examples', 'cw-101-reference', 'rfdc-ready.package.json'));
}

export function notReadyPackage(): OcrsPackage {
  return loadOcrsInput(path.join(process.cwd(), 'examples', 'cw-101-reference', 'rfdc-not-ready.scenario.json'));
}

export function addRecord(pkg: OcrsPackage, collection: keyof OcrsPackage, record: VersionedRecord): void {
  (pkg[collection] as VersionedRecord[]).push(record);
  pkg.manifest.inventory.push({ recordId: record.id, entityType: record.entityType, recordVersion: record.recordVersion });
}
