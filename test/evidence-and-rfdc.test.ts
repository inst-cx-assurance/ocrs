import { describe, expect, it } from 'vitest';
import { evaluateRfdc } from '../src/rfdc-evaluator.js';
import { validateOcrsPackage } from '../src/package-validator.js';
import { notReadyPackage, readyPackage, rehash } from './helpers.js';

function setStatic(
  status:
    | 'accepted_current'
    | 'missing'
    | 'unavailable'
    | 'rejected'
    | 'failed'
    | 'expired'
    | 'superseded',
) {
  const pkg = readyPackage();
  const evidence = pkg.evidence.find((item) => item.id === 'ocrs:evidence:CW-STATIC')!;
  evidence.status = status;
  evidence.reviewStatus =
    status === 'accepted_current' ? 'accepted' : status === 'rejected' ? 'rejected' : 'pending';
  evidence.failureStatus = status === 'failed' ? 'failed' : 'passed';
  return { pkg: rehash(pkg), evidence };
}

describe('evidence semantics and RFDC evaluation', () => {
  it('uses accepted current evidence', () => {
    expect(evaluateRfdc(setStatic('accepted_current').pkg).result).toBe('satisfied');
  });

  it.each(['missing', 'unavailable', 'rejected', 'expired', 'superseded'] as const)(
    '%s evidence cannot satisfy a criterion and remains indeterminate',
    (status) => {
      const result = evaluateRfdc(setStatic(status).pkg);
      const node = result.explanationTree.children.find(
        (item) => item.id === 'ocrs:condition:CW-STATIC',
      );
      expect(node?.result).toBe('indeterminate');
      expect(result.result).toBe('indeterminate');
    },
  );

  it('treats failed evidence as not_satisfied', () => {
    const result = evaluateRfdc(setStatic('failed').pkg);
    expect(
      result.explanationTree.children.find((item) => item.id === 'ocrs:condition:CW-STATIC')
        ?.result,
    ).toBe('not_satisfied');
    expect(result.result).toBe('not_satisfied');
  });

  it('retains external evidence provenance', () => {
    const pkg = readyPackage();
    const external = pkg.evidence.find((item) => item.externalReference)!;
    expect(external.provenanceId).toBe('ocrs:provenance:CW-CONTROLLED');
    expect(validateOcrsPackage(pkg)).toEqual([]);
  });

  it('evaluates Scenario A with distinct blocker and missing-evidence causes', () => {
    const result = evaluateRfdc(notReadyPackage());
    expect(result.result).toBe('not_satisfied');
    expect(result.recommendationSupport).toBe('not_supported');
    expect(
      result.explanationTree.children.find((item) => item.id === 'ocrs:condition:CW-STATIC')
        ?.result,
    ).toBe('indeterminate');
    expect(
      result.explanationTree.children.find((item) => item.id === 'ocrs:condition:CW-DEFICIENCIES')
        ?.result,
    ).toBe('not_satisfied');
  });

  it('evaluates Scenario B and cites support for every criterion', () => {
    const pkg = readyPackage();
    const result = evaluateRfdc(pkg);
    expect(result.result).toBe('satisfied');
    expect(result.explanationTree.children).toHaveLength(pkg.readinessConditions.length);
    expect(result.explanationTree.children.every((item) => item.result === 'satisfied')).toBe(true);
    expect(
      result.explanationTree.children.flatMap((item) => item.supportingRecordIds).length,
    ).toBeGreaterThan(0);
  });

  it('is reproducible and creates no human decision records', () => {
    const pkg = readyPackage();
    const before = JSON.stringify(pkg);
    const first = evaluateRfdc(pkg);
    const second = evaluateRfdc(pkg);
    expect(first).toEqual(second);
    expect(first.createdRecordIds).toEqual([]);
    expect(JSON.stringify(pkg)).toBe(before);
  });
});
