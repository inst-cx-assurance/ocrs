import { describe, expect, it } from 'vitest';
import { evaluateRfdc } from '../src/rfdc-evaluator.js';
import { validateOcrsPackage } from '../src/package-validator.js';
import { addRecord, readyPackage, rehash } from './helpers.js';

describe('controlled Category A/B/C/D rules', () => {
  it('open Category A prevents RFDC', () => {
    const pkg = readyPackage();
    pkg.deficiencies[0].status = 'open';
    pkg.deficiencies[0].closureEvidenceIds = [];
    expect(evaluateRfdc(rehash(pkg)).result).toBe('not_satisfied');
  });

  it('valid Category B may remain open at the current gate', () => {
    const pkg = readyPackage();
    expect(pkg.deficiencies[1].status).toBe('open');
    expect(validateOcrsPackage(pkg)).toEqual([]);
    expect(evaluateRfdc(pkg).result).toBe('satisfied');
  });

  it('Category B without a future closure point fails', () => {
    const pkg = readyPackage();
    delete pkg.deficiencies[1].requiredFutureClosurePointId;
    expect(validateOcrsPackage(pkg).map((item) => item.code)).toContain(
      'CATEGORY_B_CLOSURE_POINT_REQUIRED',
    );
  });

  it.each([
    ['acceptance', 'CATEGORY_C_ACCEPTANCE_REQUIRED'],
    ['ownerPartyId', 'CATEGORY_C_OWNER_REQUIRED'],
    ['riskAssessment', 'CATEGORY_C_RISK_ASSESSMENT_REQUIRED'],
    ['closurePlan', 'CATEGORY_C_CLOSURE_PLAN_REQUIRED'],
  ] as const)('Category C without %s fails', (field, code) => {
    const pkg = readyPackage();
    delete pkg.deficiencies[2][field];
    expect(validateOcrsPackage(pkg).map((item) => item.code)).toContain(code);
  });

  it('unresolved Category D cannot be treated as accepted', () => {
    const pkg = readyPackage();
    pkg.deficiencies[2].category = 'D';
    expect(validateOcrsPackage(pkg).map((item) => item.code)).toContain(
      'CATEGORY_D_DISPOSITION_REQUIRED',
    );
  });

  it('preserves separate category and risk labels', () => {
    const deficiency = readyPackage().deficiencies[0];
    expect(deficiency.category).toBe('A');
    expect(deficiency.severityOrRiskDescriptor).toBe('high');
  });

  it('preserves Deficiency reclassification history', () => {
    const pkg = readyPackage();
    const deficiency = pkg.deficiencies[2];
    deficiency.category = 'B';
    deficiency.status = 'reclassified';
    deficiency.reclassificationHistoryIds = ['ocrs:reclassification:CW-C1'];
    addRecord(pkg, 'deficiencyReclassifications', {
      id: 'ocrs:reclassification:CW-C1',
      entityType: 'deficiency-reclassification',
      recordVersion: '1.0.0',
      createdAt: '2026-09-01T17:00:00Z',
      deficiencyId: deficiency.id,
      fromCategory: 'C',
      toCategory: 'B',
      reason: 'Controlled reassessment',
      changedByPartyId: 'ocrs:party:project-owner',
      changedAt: '2026-09-01T17:00:00Z',
    });
    expect(validateOcrsPackage(rehash(pkg))).toEqual([]);
    expect(pkg.deficiencyReclassifications).toHaveLength(1);
  });
});
