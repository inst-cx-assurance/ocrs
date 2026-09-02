import { describe, expect, it } from 'vitest';
import { packageContentHash } from '../src/package-integrity.js';
import { validateOcrsPackage } from '../src/package-validator.js';
import { type VersionedRecord } from '../src/ocrs-types.js';
import { addRecord, readyPackage, rehash } from './helpers.js';

describe('history, handover, control, and integrity', () => {
  it('preserves a prior evidence record when a correction supersedes it', () => {
    const pkg = readyPackage();
    const prior = pkg.evidence[4];
    const correction = structuredClone(prior);
    correction.id = 'ocrs:evidence:CW-STATIC-CORRECTED';
    correction.recordVersion = '1.1.0';
    correction.revision = 'C';
    correction.supersedes = prior.id;
    addRecord(pkg, 'evidence', correction);
    expect(pkg.evidence.some((item) => item.id === prior.id)).toBe(true);
    expect(validateOcrsPackage(rehash(pkg))).toEqual([]);
  });

  it('detects a silently overwritten decision identifier', () => {
    const pkg = readyPackage();
    const decision: VersionedRecord = {
      id: 'ocrs:decision:CW-ORC',
      entityType: 'readiness-decision',
      recordVersion: '1.0.0',
      createdAt: '2026-09-01T18:00:00Z',
      gateId: 'ocrs:gate:CW-ORC',
      decision: 'hold',
      decisionMakerRoleAssignmentId: 'ocrs:role:readiness-reviewer',
      decidedAt: '2026-09-01T18:00:00Z',
      basisRecordIds: [],
    };
    addRecord(pkg, 'readinessDecisions', decision);
    pkg.readinessDecisions.push(structuredClone(decision));
    rehash(pkg);
    expect(validateOcrsPackage(pkg).map((item) => item.code)).toContain('DUPLICATE_IDENTIFIER');
  });

  it('keeps System Handover distinct from Transfer of Operational Control', () => {
    const context = readyPackage();
    expect(context.systemHandovers).toEqual([]);
    expect(context.transfersOfOperationalControl).toEqual([]);
    expect(context.boundaries.some((item) => item.boundaryType === 'handover')).toBe(true);
    expect(
      context.boundaries.some((item) => item.boundaryType === 'transfer_of_operational_control'),
    ).toBe(true);
  });

  it('requires an explicit controlled Transfer of Operational Control record', () => {
    const pkg = readyPackage();
    const before = pkg.transfersOfOperationalControl.length;
    pkg.systemHandovers.push({
      id: 'ocrs:handover:CW-101',
      entityType: 'system-handover',
      recordVersion: '1.0.0',
      createdAt: '2026-09-01T18:00:00Z',
      systemIds: ['ocrs:system:CW-101'],
      boundaryIds: ['ocrs:boundary:CW-101-HANDOVER'],
      handoverStatus: 'accepted',
      acceptedByPartyId: 'ocrs:party:operations',
      effectiveAt: '2026-09-01T18:00:00Z',
      basisRecordIds: [],
    });
    expect(pkg.transfersOfOperationalControl).toHaveLength(before);
  });

  it('manifest inventory identifies exact record versions', () => {
    const pkg = readyPackage();
    pkg.manifest.inventory[0].recordVersion = '9.9.9';
    expect(validateOcrsPackage(pkg).map((item) => item.code)).toContain(
      'MANIFEST_INVENTORY_MISMATCH',
    );
  });

  it('content changes alter the deterministic integrity value', () => {
    const pkg = readyPackage();
    const first = packageContentHash(pkg as unknown as Record<string, unknown>);
    pkg.project.name = 'Changed project name';
    expect(packageContentHash(pkg as unknown as Record<string, unknown>)).not.toBe(first);
  });

  it('uses content integrity without claiming non-repudiation', () => {
    expect(packageContentHash(readyPackage() as unknown as Record<string, unknown>)).toMatch(
      /^[a-f0-9]{64}$/,
    );
  });
});
