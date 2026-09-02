export type EvaluationStatus = 'satisfied' | 'not_satisfied' | 'indeterminate';
export type DeficiencyCategory = 'A' | 'B' | 'C' | 'D';
export type EvidenceStatus =
  'accepted_current' | 'missing' | 'unavailable' | 'rejected' | 'failed' | 'expired' | 'superseded';

export interface VersionedRecord {
  id: string;
  entityType: string;
  recordVersion: string;
  createdAt: string;
  supersedes?: string;
  [key: string]: unknown;
}

export interface EvidenceRecord extends VersionedRecord {
  entityType: 'evidence';
  evidenceType: string;
  status: EvidenceStatus;
  applicableRequirementIds: string[];
  applicableConditionIds: string[];
  applicableSubjectIds: string[];
  applicableBoundaryIds: string[];
  provenanceId: string;
  reviewStatus: 'pending' | 'accepted' | 'rejected';
  failureStatus: 'not_applicable' | 'passed' | 'failed';
  authoritativeSource: string;
  creatorPartyId: string;
  responsiblePartyId: string;
  currencyApplicable: boolean;
  decisionPointCurrency?: 'current' | 'stale' | 'unknown';
  validFrom?: string;
  validTo?: string;
  externalReference?: string;
  externalVersionId?: string;
  hash?: { algorithm: 'sha256' | 'sha512'; value: string };
}

export interface ReadinessConditionRecord extends VersionedRecord {
  entityType: 'readiness-condition';
  gateId: string;
  requirementIds: string[];
  subjectIds: string[];
  boundaryIds: string[];
  rule: {
    kind:
      | 'accepted_evidence'
      | 'prerequisite_gate'
      | 'boundary_mapping'
      | 'dependencies_satisfied'
      | 'no_blocking_constraints'
      | 'deficiency_controls';
    requiredEvidenceTypes?: string[];
    prerequisiteGateId?: string;
    currencyRequired?: boolean;
  };
}

export interface DeficiencyRecord extends VersionedRecord {
  entityType: 'deficiency';
  category: DeficiencyCategory;
  status: 'open' | 'closed' | 'reclassified' | 'accepted';
  affectedGateIds: string[];
  effectOnCurrentGate: 'prevents' | 'does_not_prevent' | 'requires_disposition';
  requiredFutureClosurePointId?: string;
  ownerPartyId?: string;
  riskAssessment?: string;
  acceptance?: { acceptedByPartyId: string; acceptedAt: string };
  closurePlan?: { approvedByPartyId: string; approvedAt: string; actions: string[] };
  closureEvidenceIds?: string[];
  reclassificationHistoryIds: string[];
}

export interface DependencyRecord extends VersionedRecord {
  entityType: 'dependency';
  sourceId: string;
  targetId: string;
  status: EvaluationStatus;
  gateId: string;
  circularityAllowed: boolean;
}

export interface OcrsPackage {
  $schema: string;
  schemaVersion: '0.1.0';
  manifest: {
    packageId: string;
    manifestVersion: '0.1.0';
    ocrsVersion: '0.1.0';
    createdAt: string;
    producedByPartyId: string;
    projectId: string;
    boundaryIds: string[];
    profiles: Array<{ profileId: string; profileVersion: string }>;
    inventory: Array<{
      recordId: string;
      entityType: string;
      recordVersion: string;
      supersessionStatus?: 'current' | 'superseded';
      supersedesRecordId?: string;
    }>;
    qualifications: string[];
    exclusions: string[];
    externalEvidenceReferences?: Array<{
      evidenceId: string;
      reference: string;
      binding: { kind: 'sha256' | 'sha512' | 'version' | 'immutable_identifier'; value: string };
    }>;
    contentHash?: { algorithm: 'sha256'; value: string };
  };
  project: VersionedRecord;
  sbs: VersionedRecord[];
  systems: VersionedRecord[];
  systemRelationships: VersionedRecord[];
  assets: VersionedRecord[];
  interfaces: VersionedRecord[];
  boundaries: VersionedRecord[];
  parties: VersionedRecord[];
  roleAssignments: VersionedRecord[];
  authorityScopes: VersionedRecord[];
  executionRequirements: VersionedRecord[];
  readinessConditions: ReadinessConditionRecord[];
  activities: VersionedRecord[];
  evidence: EvidenceRecord[];
  evidenceProvenance: VersionedRecord[];
  evidenceRevisions: VersionedRecord[];
  deficiencies: DeficiencyRecord[];
  deficiencyReclassifications: VersionedRecord[];
  constraints: VersionedRecord[];
  dependencies: DependencyRecord[];
  residualRiskInputs: VersionedRecord[];
  deterministicEvaluations: VersionedRecord[];
  evaluationExplanations: VersionedRecord[];
  commissioningStageGates: VersionedRecord[];
  operationalReadinessGates: VersionedRecord[];
  readinessReviews: VersionedRecord[];
  readinessRecommendations: VersionedRecord[];
  readinessDecisions: VersionedRecord[];
  systemHandovers: VersionedRecord[];
  transfersOfOperationalControl: VersionedRecord[];
  conditions: VersionedRecord[];
  changeRecords: VersionedRecord[];
  profileDeclarations: VersionedRecord[];
  extensionDeclarations: VersionedRecord[];
}

export const RECORD_COLLECTIONS = [
  'sbs',
  'systems',
  'systemRelationships',
  'assets',
  'interfaces',
  'boundaries',
  'parties',
  'roleAssignments',
  'authorityScopes',
  'executionRequirements',
  'readinessConditions',
  'activities',
  'evidence',
  'evidenceProvenance',
  'evidenceRevisions',
  'deficiencies',
  'deficiencyReclassifications',
  'constraints',
  'dependencies',
  'residualRiskInputs',
  'deterministicEvaluations',
  'evaluationExplanations',
  'commissioningStageGates',
  'operationalReadinessGates',
  'readinessReviews',
  'readinessRecommendations',
  'readinessDecisions',
  'systemHandovers',
  'transfersOfOperationalControl',
  'conditions',
  'changeRecords',
  'profileDeclarations',
  'extensionDeclarations',
] as const;
