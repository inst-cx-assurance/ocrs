import {
  type EvaluationStatus,
  type EvidenceRecord,
  type OcrsPackage,
  type ReadinessConditionRecord,
} from './ocrs-types.js';
import { validateOcrsPackage } from './package-validator.js';

export interface ExplanationNode {
  id: string;
  recordType: string;
  result: EvaluationStatus;
  rule: string;
  message: string;
  supportingRecordIds: string[];
  children: ExplanationNode[];
}

export interface DeterministicEvaluation {
  evaluator: 'ocrs-reference-rfdc';
  evaluatorVersion: '0.1.0';
  packageId: string;
  gateId: string;
  subjectIds: string[];
  boundaryIds: string[];
  result: EvaluationStatus;
  recommendationSupport: 'proceed_supported' | 'not_supported';
  explanationTree: ExplanationNode;
  createdRecordIds: [];
}

export function evaluateRfdc(pkg: OcrsPackage): DeterministicEvaluation {
  const diagnostics = validateOcrsPackage(pkg);
  if (diagnostics.length)
    throw new Error(`OCRS package validation failed: ${JSON.stringify(diagnostics)}`);
  const gate = pkg.commissioningStageGates.find(
    (item) => item.gateType === 'ready_for_dynamic_commissioning',
  );
  if (!gate) throw new Error('No Ready for Dynamic Commissioning gate exists in the package.');
  const evaluationTime = String(
    pkg.deterministicEvaluations.find((item) => item.gateId === gate.id)?.evaluatedAt ??
      pkg.manifest.createdAt,
  );

  const conditionNodes = (gate.conditionIds as string[]).map((id) => {
    const condition = pkg.readinessConditions.find((item) => item.id === id);
    if (!condition) throw new Error(`Validated package lost readiness condition ${id}.`);
    return evaluateCondition(pkg, condition, evaluationTime);
  });
  const result = combine(conditionNodes.map((node) => node.result));
  return {
    evaluator: 'ocrs-reference-rfdc',
    evaluatorVersion: '0.1.0',
    packageId: pkg.manifest.packageId,
    gateId: gate.id,
    subjectIds: gate.subjectIds as string[],
    boundaryIds: gate.boundaryIds as string[],
    result,
    recommendationSupport: result === 'satisfied' ? 'proceed_supported' : 'not_supported',
    explanationTree: {
      id: `${gate.id}:evaluation`,
      recordType: 'commissioning-stage-gate',
      result,
      rule: 'all_rfdc_conditions_satisfied',
      message:
        result === 'satisfied'
          ? 'Every RFDC condition is satisfied.'
          : 'RFDC progression is not supported; inspect every child condition.',
      supportingRecordIds: [gate.id],
      children: conditionNodes,
    },
    createdRecordIds: [],
  };
}

function evaluateCondition(
  pkg: OcrsPackage,
  condition: ReadinessConditionRecord,
  evaluationTime: string,
): ExplanationNode {
  const kind = condition.rule.kind;
  if (kind === 'accepted_evidence') return evidenceCondition(pkg, condition, evaluationTime);
  if (kind === 'prerequisite_gate') {
    const prerequisite = pkg.commissioningStageGates.find(
      (item) => item.id === condition.rule.prerequisiteGateId,
    );
    const result: EvaluationStatus =
      prerequisite?.deterministicStatus === 'satisfied'
        ? 'satisfied'
        : prerequisite
          ? 'not_satisfied'
          : 'indeterminate';
    return node(
      condition,
      result,
      prerequisite ? [prerequisite.id] : [],
      `Prerequisite gate is ${result}.`,
    );
  }
  if (kind === 'boundary_mapping') {
    const boundaries = condition.boundaryIds.map((id) =>
      pkg.boundaries.find((item) => item.id === id),
    );
    const testBoundaries = boundaries.filter((item) => item?.boundaryType === 'test');
    const mapped =
      testBoundaries.length > 0 &&
      testBoundaries.every((item) =>
        (item?.mappedBoundaryIds as string[]).some(
          (id) =>
            pkg.boundaries.find((candidate) => candidate.id === id)?.boundaryType === 'system',
        ),
      );
    return node(
      condition,
      mapped ? 'satisfied' : 'indeterminate',
      boundaries.flatMap((item) => (item ? [item.id] : [])),
      mapped
        ? 'Every test boundary maps to an applicable system boundary.'
        : 'A test-to-system boundary mapping is missing.',
    );
  }
  if (kind === 'dependencies_satisfied') {
    const relevant = pkg.dependencies.filter((item) => item.gateId === condition.gateId);
    const result = relevant.length ? combine(relevant.map((item) => item.status)) : 'indeterminate';
    return node(
      condition,
      result,
      relevant.map((item) => item.id),
      `Dependencies evaluate as ${result}.`,
    );
  }
  if (kind === 'no_blocking_constraints') {
    const relevant = pkg.constraints.filter((item) => item.gateId === condition.gateId);
    const blocker = relevant.find(
      (item) => item.status === 'active' && item.blocksCurrentGate === true,
    );
    return node(
      condition,
      blocker ? 'not_satisfied' : 'satisfied',
      relevant.map((item) => item.id),
      blocker ? `Constraint ${blocker.id} blocks RFDC.` : 'No active constraint blocks RFDC.',
    );
  }
  const relevant = pkg.deficiencies.filter((item) =>
    item.affectedGateIds.includes(condition.gateId),
  );
  const categoryA = relevant.find((item) => item.category === 'A' && item.status === 'open');
  const categoryD = relevant.find((item) => item.category === 'D' && item.status === 'open');
  const result: EvaluationStatus = categoryA
    ? 'not_satisfied'
    : categoryD
      ? 'indeterminate'
      : 'satisfied';
  return node(
    condition,
    result,
    relevant.map((item) => item.id),
    categoryA
      ? `Open Category A deficiency ${categoryA.id} prevents RFDC.`
      : categoryD
        ? `Category D item ${categoryD.id} requires disposition.`
        : 'Deficiencies are controlled for the current gate.',
  );
}

function evidenceCondition(
  pkg: OcrsPackage,
  condition: ReadinessConditionRecord,
  evaluationTime: string,
): ExplanationNode {
  const requiredTypes = condition.rule.requiredEvidenceTypes ?? [];
  const matching = pkg.evidence.filter(
    (item) =>
      item.applicableConditionIds.includes(condition.id) &&
      requiredTypes.includes(item.evidenceType),
  );
  const children = requiredTypes.map((type) =>
    evidenceTypeNode(
      condition,
      type,
      matching.filter((item) => item.evidenceType === type),
      evaluationTime,
    ),
  );
  const result = combine(children.map((item) => item.result));
  return {
    ...node(
      condition,
      result,
      matching.map((item) => item.id),
      `Required evidence evaluates as ${result}.`,
    ),
    children,
  };
}

function evidenceTypeNode(
  condition: ReadinessConditionRecord,
  type: string,
  evidence: EvidenceRecord[],
  evaluationTime: string,
): ExplanationNode {
  const applicable = evidence.filter((item) => evidenceScopeMatches(item, condition));
  const failed = applicable.find(
    (item) => item.status === 'failed' || item.failureStatus === 'failed',
  );
  const accepted = applicable.find((item) => evidenceIsUsable(item, condition, evaluationTime));
  const result: EvaluationStatus = failed
    ? 'not_satisfied'
    : accepted
      ? 'satisfied'
      : 'indeterminate';
  const states = evidence.length
    ? evidence.map((item) => `${item.id}:${describeEvidenceState(item, evaluationTime)}`).join(', ')
    : 'none';
  return {
    id: `${condition.id}:${type}`,
    recordType: 'evidence-requirement',
    result,
    rule: 'accepted_current_evidence_required',
    message: failed
      ? `Failed evidence exists (${states}).`
      : accepted
        ? `Accepted, reviewed, current, in-scope evidence ${accepted.id} satisfies ${type}.`
        : `No accepted, reviewed, current, in-scope ${type} evidence exists (${states}).`,
    supportingRecordIds: evidence.map((item) => item.id),
    children: [],
  };
}

function evidenceScopeMatches(
  evidence: EvidenceRecord,
  condition: ReadinessConditionRecord,
): boolean {
  return (
    condition.subjectIds.every((id) => evidence.applicableSubjectIds.includes(id)) &&
    condition.boundaryIds.every((id) => evidence.applicableBoundaryIds.includes(id)) &&
    condition.requirementIds.every((id) => evidence.applicableRequirementIds.includes(id))
  );
}

function evidenceIsUsable(
  evidence: EvidenceRecord,
  condition: ReadinessConditionRecord,
  evaluationTime: string,
): boolean {
  if (!evidenceScopeMatches(evidence, condition)) return false;
  if (evidence.status !== 'accepted_current') return false;
  if (evidence.reviewStatus !== 'accepted' || evidence.failureStatus === 'failed') return false;
  if (condition.rule.currencyRequired && evidence.decisionPointCurrency !== 'current') return false;
  const at = Date.parse(evaluationTime);
  if (evidence.validFrom && at < Date.parse(evidence.validFrom)) return false;
  if (evidence.validTo && at > Date.parse(evidence.validTo)) return false;
  return true;
}

function describeEvidenceState(evidence: EvidenceRecord, evaluationTime: string): string {
  if (evidence.failureStatus === 'failed' || evidence.status === 'failed') return 'failed';
  if (evidence.status !== 'accepted_current') return evidence.status;
  if (evidence.reviewStatus !== 'accepted') return `review_${evidence.reviewStatus}`;
  if (evidence.decisionPointCurrency === 'stale') return 'stale';
  if (evidence.decisionPointCurrency === 'unknown') return 'currency_unknown';
  const at = Date.parse(evaluationTime);
  if (evidence.validFrom && at < Date.parse(evidence.validFrom)) return 'not_yet_valid';
  if (evidence.validTo && at > Date.parse(evidence.validTo)) return 'expired';
  return 'accepted_current';
}

function node(
  condition: ReadinessConditionRecord,
  result: EvaluationStatus,
  supportingRecordIds: string[],
  message: string,
): ExplanationNode {
  return {
    id: condition.id,
    recordType: condition.entityType,
    result,
    rule: condition.rule.kind,
    message,
    supportingRecordIds,
    children: [],
  };
}

function combine(results: EvaluationStatus[]): EvaluationStatus {
  if (results.includes('not_satisfied')) return 'not_satisfied';
  if (results.includes('indeterminate')) return 'indeterminate';
  return 'satisfied';
}
