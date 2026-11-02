import Ajv2020Import from 'ajv/dist/2020.js';
import { describe, expect, it } from 'vitest';
import { readyPackage, rehash, addRecord } from './helpers.js';
import { evaluateRfdc } from '../src/rfdc-evaluator.js';
import { validateOcrsPackage } from '../src/package-validator.js';
import { createSchemaContext } from '../src/schema-validation.js';
import { RECORD_COLLECTIONS, type OcrsPackage } from '../src/ocrs-types.js';
function seal(p: OcrsPackage) {
  p.manifest.inventory = [p.project, ...RECORD_COLLECTIONS.flatMap((k) => p[k])].map((r) => ({
    recordId: r.id,
    entityType: r.entityType,
    recordVersion: r.recordVersion,
  }));
  return rehash(p);
}
describe('Validation regression coverage', () => {
  it('R17: reject multiple RFDC gates instead of silently selecting the first', () => {
    const p = readyPackage(),
      g = p.commissioningStageGates.find((g) => g.gateType === 'ready_for_dynamic_commissioning')!;
    addRecord(p, 'commissioningStageGates', { ...structuredClone(g), id: 'ocrs:gate:SECOND' });
    rehash(p);
    expect(validateOcrsPackage(p)).toEqual([]);
    expect(() => evaluateRfdc(p)).toThrow(/Multiple Ready for Dynamic Commissioning/);
  });
  it('R18: a valid dependency-free package remains indeterminate', () => {
    const p = readyPackage();
    p.dependencies = [];
    for (const r of p.readinessReviews) r.dependencyIds = [];
    seal(p);
    expect(validateOcrsPackage(p)).toEqual([]);
    const e = evaluateRfdc(p);
    expect(
      e.explanationTree.children.find((n) => n.rule === 'dependencies_satisfied')?.result,
    ).toBe('indeterminate');
  });
  it('R21: operational gate evaluation and review should be representable', () => {
    const p = readyPackage();
    addRecord(p, 'operationalReadinessGates', {
      id: 'ocrs:gate:ORC',
      entityType: 'operational-readiness-gate',
      recordVersion: '1.0.0',
      createdAt: '2026-08-30T18:00:00Z',
      name: 'Operational readiness',
      gateType: 'organizational_readiness_complete',
      subjectIds: ['ocrs:system:CW-101'],
      boundaryIds: ['ocrs:boundary:CW-101-SYSTEM'],
      lifecyclePhase: 'readiness',
      capabilityPillars: ['people', 'organization', 'asset', 'systems_and_processes'],
      status: 'ready',
    });
    const e = {
      ...structuredClone(p.deterministicEvaluations[0]),
      id: 'ocrs:evaluation:ORC',
      gateId: 'ocrs:gate:ORC',
    };
    addRecord(p, 'deterministicEvaluations', e);
    addRecord(p, 'readinessReviews', {
      ...structuredClone(p.readinessReviews[0]),
      id: 'ocrs:review:ORC',
      gateId: 'ocrs:gate:ORC',
      evaluationId: e.id,
    });
    expect(validateOcrsPackage(seal(p))).toEqual([]);
  });
  it('R22: current schema requires acceptance fields for proposed handover', () => {
    const p = readyPackage();
    addRecord(p, 'systemHandovers', {
      id: 'ocrs:handover:PROPOSED',
      entityType: 'system-handover',
      recordVersion: '1.0.0',
      createdAt: '2026-09-01T18:00:00Z',
      systemIds: ['ocrs:system:CW-101'],
      boundaryIds: ['ocrs:boundary:CW-101-HANDOVER'],
      handoverStatus: 'proposed',
      basisRecordIds: [],
    });
    expect(
      validateOcrsPackage(seal(p))
        .map((d) => d.message)
        .join(' '),
    ).toMatch(/acceptedByPartyId/);
    expect(
      validateOcrsPackage(p)
        .map((d) => d.message)
        .join(' '),
    ).toMatch(/effectiveAt/);
  });
  it('R23: signed evidence awaiting review cannot satisfy RFDC', () => {
    const p = readyPackage();
    const e = p.evidence.find((e) => e.id === 'ocrs:evidence:CW-STATIC')!;
    e.reviewStatus = 'pending';
    expect(
      evaluateRfdc(rehash(p)).explanationTree.children.find(
        (n) => n.id === 'ocrs:condition:CW-STATIC',
      )?.result,
    ).not.toBe('satisfied');
  });
  it('R23: accepted review does not require reviewer identity', () => {
    const p = readyPackage();
    p.readinessReviews = [];
    p.readinessRecommendations = [];
    seal(p);
    expect(validateOcrsPackage(p)).toEqual([]);
    expect(p.evidence.every((e) => !('reviewerRoleAssignmentId' in e))).toBe(true);
    expect(evaluateRfdc(p).result).toBe('satisfied');
  });
  it('R24: deep inventory uniqueness ignores object property order', () => {
    const p = readyPackage(),
      m = structuredClone(p.manifest),
      entry = m.inventory[0];
    m.inventory.push({
      recordVersion: entry.recordVersion,
      entityType: entry.entityType,
      recordId: entry.recordId,
    });
    const validate = createSchemaContext().ajv.getSchema(
      'https://spec.ocrs.dev/v0.1/schemas/package-manifest.schema.json',
    )!;
    expect(validate(m)).toBe(false);
    expect(validate.errors?.some((e) => e.keyword === 'uniqueItems')).toBe(true);
  });
  it('R24: duplicate inventory IDs with distinct metadata are rejected', () => {
    const p = readyPackage();
    p.manifest.inventory.push({ ...p.manifest.inventory[0], supersessionStatus: 'current' });
    expect(validateOcrsPackage(rehash(p)).map((d) => d.code)).toContain(
      'MANIFEST_INVENTORY_MISMATCH',
    );
  });
  it('R21: review cannot cite an evaluation of a different gate', () => {
    const p = readyPackage();
    p.readinessReviews[0].gateId = 'ocrs:gate:CW-CC';
    expect(validateOcrsPackage(rehash(p)).map((d) => d.code)).toContain(
      'REVIEW_EVALUATION_GATE_MISMATCH',
    );
  });
  it('R24: optimized uniqueItems agrees with the standard validator', () => {
    const Ajv = Ajv2020Import as unknown as new (options: Record<string, unknown>) => {
      compile(schema: unknown): (value: unknown) => boolean;
    };
    const schema = { type: 'array', uniqueItems: true };
    const standard = new Ajv({ strict: false }).compile(schema);
    const optimized = createSchemaContext().ajv.compile(schema);
    for (const items of [
      [],
      [1, 1],
      [{}, {}],
      [
        { a: 1, b: 2 },
        { b: 2, a: 1 },
      ],
      [1, '1'],
      [{ x: [1, 2] }, { x: [2, 1] }],
      [null, null],
      [true, false],
      ['é', 'é'],
      [0, -0],
    ])
      expect(optimized(items)).toBe(standard(items));
  });
});
