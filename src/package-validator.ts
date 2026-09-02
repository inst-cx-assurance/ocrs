import { type ErrorObject } from 'ajv';
import { type OcrsPackage, RECORD_COLLECTIONS, type VersionedRecord } from './ocrs-types.js';
import { packageContentHash } from './package-integrity.js';
import { createSchemaContext, type SchemaContext } from './schema-validation.js';

export interface Diagnostic {
  code: string;
  path: string;
  message: string;
}

let cachedContext: SchemaContext | undefined;

const SUPPORTED_SCHEMA_VERSION = '0.1.0';
const SUPPORTED_PROFILES = new Map([
  ['ocrs:profile:core', '0.1.0'],
  ['ocrs:profile:rfdc', '0.1.0'],
]);

export function validateOcrsPackage(input: unknown, context?: SchemaContext): Diagnostic[] {
  context ??= cachedContext ?? (cachedContext = createSchemaContext());
  const diagnostics: Diagnostic[] = [];
  if (!context.packageValidator(input)) {
    for (const error of context.packageValidator.errors ?? [])
      diagnostics.push(schemaDiagnostic(error));
    return diagnostics;
  }

  const pkg = input as OcrsPackage;
  if (pkg.schemaVersion !== SUPPORTED_SCHEMA_VERSION) {
    diagnostics.push(
      diag(
        'UNSUPPORTED_SCHEMA_VERSION',
        '/schemaVersion',
        `Unsupported schema version ${pkg.schemaVersion}.`,
      ),
    );
  }

  for (const [index, profile] of pkg.manifest.profiles.entries()) {
    const supported = SUPPORTED_PROFILES.get(profile.profileId);
    if (!supported || supported !== profile.profileVersion) {
      diagnostics.push(
        diag(
          'UNSUPPORTED_PROFILE_VERSION',
          `/manifest/profiles/${index}`,
          `Unsupported profile ${profile.profileId}@${profile.profileVersion}.`,
        ),
      );
    }
  }

  const records = allRecords(pkg);
  const byId = new Map<string, VersionedRecord>();
  for (const [index, record] of records.entries()) {
    if (byId.has(record.id))
      diagnostics.push(
        diag('DUPLICATE_IDENTIFIER', `/records/${index}/id`, `Duplicate identifier ${record.id}.`),
      );
    else byId.set(record.id, record);
  }

  const reference = (
    source: VersionedRecord | { id: string },
    field: string,
    id: unknown,
    expected: string[],
  ) => {
    if (typeof id !== 'string') return;
    const target = byId.get(id);
    if (!target)
      diagnostics.push(
        diag(
          'BROKEN_REFERENCE',
          `/${source.id}/${field}`,
          `${source.id}.${field} references missing ${id}.`,
        ),
      );
    else if (!expected.includes(target.entityType))
      diagnostics.push(
        diag(
          'WRONG_ENTITY_TYPE_REFERENCE',
          `/${source.id}/${field}`,
          `${source.id}.${field} expected ${expected.join('|')} but ${id} is ${target.entityType}.`,
        ),
      );
  };
  const references = (source: VersionedRecord, field: string, expected: string[]) => {
    const value = source[field];
    for (const id of Array.isArray(value) ? value : value === undefined ? [] : [value])
      reference(source, field, id, expected);
  };

  reference({ id: 'manifest' }, 'producedByPartyId', pkg.manifest.producedByPartyId, ['party']);
  reference({ id: 'manifest' }, 'projectId', pkg.manifest.projectId, ['project']);
  for (const id of pkg.manifest.boundaryIds)
    reference({ id: 'manifest' }, 'boundaryIds', id, ['boundary']);
  for (const item of pkg.manifest.externalEvidenceReferences ?? [])
    reference({ id: 'manifest' }, 'externalEvidenceReferences.evidenceId', item.evidenceId, [
      'evidence',
    ]);
  for (const profile of pkg.manifest.profiles)
    reference({ id: 'manifest' }, 'profiles.profileId', profile.profileId, ['profile-declaration']);

  references(pkg.project, 'sbsId', ['system-breakdown-structure']);
  for (const record of pkg.sbs) references(record, 'rootSystemIds', ['system']);
  for (const record of pkg.systems) {
    references(record, 'parentSystemId', ['system']);
    references(record, 'boundaryIds', ['boundary']);
    references(record, 'assetIds', ['asset']);
  }
  for (const record of pkg.systemRelationships) {
    references(record, 'parentSystemId', ['system']);
    references(record, 'childSystemId', ['system']);
  }
  for (const record of pkg.assets) references(record, 'systemId', ['system']);
  for (const record of pkg.interfaces) {
    references(record, 'endpointSystemIds', ['system']);
    references(record, 'boundaryIds', ['boundary']);
  }
  for (const record of pkg.boundaries) {
    references(record, 'subjectIds', ['system', 'asset', 'interface']);
    references(record, 'mappedBoundaryIds', ['boundary']);
  }
  for (const record of pkg.parties) references(record, 'organizationId', ['party']);
  for (const record of pkg.roleAssignments) {
    references(record, 'partyId', ['party']);
    references(record, 'authorityScopeId', ['authority-scope']);
  }
  for (const record of pkg.authorityScopes) {
    references(record, 'subjectIds', ['system', 'asset', 'interface']);
    references(record, 'boundaryIds', ['boundary']);
  }
  for (const record of pkg.executionRequirements)
    references(record, 'subjectIds', ['system', 'asset', 'interface', 'boundary']);
  for (const record of pkg.readinessConditions) {
    references(record, 'gateId', ['commissioning-stage-gate']);
    references(record, 'requirementIds', ['execution-requirement']);
    references(record, 'subjectIds', ['system', 'asset', 'interface']);
    references(record, 'boundaryIds', ['boundary']);
    if (record.rule.prerequisiteGateId)
      reference(record, 'rule.prerequisiteGateId', record.rule.prerequisiteGateId, [
        'commissioning-stage-gate',
      ]);
  }
  for (const record of pkg.activities) {
    references(record, 'requirementIds', ['execution-requirement']);
    references(record, 'conditionIds', ['readiness-condition']);
    references(record, 'subjectIds', ['system', 'asset', 'interface']);
    references(record, 'performedByPartyId', ['party']);
  }
  for (const record of pkg.evidence) {
    references(record, 'creatorPartyId', ['party']);
    references(record, 'responsiblePartyId', ['party']);
    references(record, 'applicableRequirementIds', ['execution-requirement']);
    references(record, 'applicableConditionIds', ['readiness-condition']);
    references(record, 'applicableSubjectIds', ['system', 'asset', 'interface']);
    references(record, 'applicableBoundaryIds', ['boundary']);
    references(record, 'provenanceId', ['evidence-provenance']);
  }
  for (const record of pkg.evidenceProvenance) {
    references(record, 'evidenceIds', ['evidence']);
    references(record, 'sourcePartyId', ['party']);
  }
  for (const record of pkg.evidenceRevisions) {
    references(record, 'evidenceId', ['evidence']);
    references(record, 'supersedesEvidenceId', ['evidence']);
  }
  for (const record of pkg.deficiencies) {
    references(record, 'affectedGateIds', ['commissioning-stage-gate']);
    references(record, 'affectedRequirementIds', ['execution-requirement']);
    references(record, 'affectedSubjectIds', ['system', 'asset', 'interface', 'boundary']);
    references(record, 'ownerPartyId', ['party']);
    references(record, 'closureEvidenceIds', ['evidence']);
    references(record, 'residualRiskInputId', ['residual-risk-input']);
    references(record, 'reclassificationHistoryIds', ['deficiency-reclassification']);
    references(record, 'requiredFutureClosurePointId', [
      'boundary',
      'commissioning-stage-gate',
      'operational-readiness-gate',
    ]);
    const acceptance = record.acceptance as { acceptedByPartyId?: string } | undefined;
    if (acceptance?.acceptedByPartyId)
      reference(record, 'acceptance.acceptedByPartyId', acceptance.acceptedByPartyId, ['party']);
    const closurePlan = record.closurePlan as { approvedByPartyId?: string } | undefined;
    if (closurePlan?.approvedByPartyId)
      reference(record, 'closurePlan.approvedByPartyId', closurePlan.approvedByPartyId, ['party']);
  }
  for (const record of pkg.deficiencyReclassifications) {
    references(record, 'deficiencyId', ['deficiency']);
    references(record, 'changedByPartyId', ['party']);
  }
  for (const record of pkg.constraints) {
    references(record, 'gateId', ['commissioning-stage-gate']);
    references(record, 'subjectIds', ['system', 'asset', 'interface', 'boundary']);
    references(record, 'ownerPartyId', ['party']);
  }
  for (const record of pkg.dependencies) {
    references(record, 'sourceId', [
      'system',
      'asset',
      'interface',
      'boundary',
      'readiness-condition',
    ]);
    references(record, 'targetId', [
      'system',
      'asset',
      'interface',
      'boundary',
      'readiness-condition',
    ]);
    references(record, 'gateId', ['commissioning-stage-gate']);
  }
  for (const record of pkg.residualRiskInputs)
    references(record, 'sourceIds', ['deficiency', 'constraint', 'dependency', 'evidence']);
  for (const record of pkg.deterministicEvaluations) {
    references(record, 'gateId', ['commissioning-stage-gate']);
    references(record, 'subjectIds', ['system', 'asset', 'interface']);
    references(record, 'boundaryIds', ['boundary']);
    references(record, 'explanationId', ['evaluation-explanation']);
    references(
      record,
      'inputRecordIds',
      records.map((item) => item.entityType),
    );
  }
  for (const record of pkg.evaluationExplanations)
    validateExplanationReferences(record.root, record, reference);
  for (const record of pkg.commissioningStageGates) {
    references(record, 'profileId', ['profile-declaration']);
    references(record, 'subjectIds', ['system']);
    references(record, 'boundaryIds', ['boundary']);
    references(record, 'conditionIds', ['readiness-condition']);
  }
  for (const record of pkg.operationalReadinessGates) {
    references(record, 'profileId', ['profile-declaration']);
    references(record, 'subjectIds', ['system']);
    references(record, 'boundaryIds', ['boundary']);
  }
  for (const record of pkg.readinessReviews) {
    references(record, 'gateId', ['commissioning-stage-gate', 'operational-readiness-gate']);
    references(record, 'reviewerRoleAssignmentIds', ['role-assignment']);
    references(record, 'evidenceIds', ['evidence']);
    references(record, 'evaluationId', ['deterministic-evaluation']);
    references(record, 'subjectIds', ['system', 'asset', 'interface']);
    references(record, 'boundaryIds', ['boundary']);
    references(record, 'openDeficiencyIds', ['deficiency']);
    references(record, 'constraintIds', ['constraint']);
    references(record, 'dependencyIds', ['dependency']);
  }
  for (const record of pkg.readinessRecommendations) {
    references(record, 'reviewId', ['readiness-review']);
    references(record, 'gateId', ['commissioning-stage-gate']);
    references(record, 'issuedByRoleAssignmentId', ['role-assignment']);
    references(record, 'conditionIds', ['condition']);
  }
  for (const record of pkg.readinessDecisions) {
    references(record, 'gateId', ['operational-readiness-gate']);
    references(record, 'decisionMakerRoleAssignmentId', ['role-assignment']);
    references(
      record,
      'decisionBasisRecordIds',
      records.map((item) => item.entityType),
    );
    references(record, 'subjectIds', ['system', 'asset', 'interface']);
    references(record, 'boundaryIds', ['boundary']);
    references(record, 'residualRiskInputIds', ['residual-risk-input']);
    references(record, 'conditionIds', ['condition']);
    references(record, 'historyRecordIds', ['change-record', 'readiness-decision']);
  }
  for (const record of pkg.systemHandovers) {
    references(record, 'systemIds', ['system']);
    references(record, 'boundaryIds', ['boundary']);
    references(record, 'acceptedByPartyId', ['party']);
    references(record, 'deliveringPartyId', ['party']);
    references(record, 'receivingPartyId', ['party']);
    references(record, 'acceptedByRoleAssignmentId', ['role-assignment']);
    references(
      record,
      'basisRecordIds',
      records.map((item) => item.entityType),
    );
  }
  for (const record of pkg.transfersOfOperationalControl) {
    references(record, 'systemIds', ['system']);
    references(record, 'boundaryIds', ['boundary']);
    references(record, 'readinessDecisionId', ['readiness-decision']);
    references(record, 'handoverId', ['system-handover']);
    references(record, 'approvedEquivalentProfileId', ['profile-declaration']);
    references(record, 'fromPartyId', ['party']);
    references(record, 'toPartyId', ['party']);
    references(record, 'transferredByRoleAssignmentId', ['role-assignment']);
    references(record, 'acceptedByRoleAssignmentId', ['role-assignment']);
  }
  for (const record of pkg.conditions) {
    references(record, 'ownerPartyId', ['party']);
    references(
      record,
      'sourceRecordIds',
      records.map((item) => item.entityType),
    );
    references(record, 'decisionIds', ['readiness-decision']);
    references(record, 'closureEvidenceIds', ['evidence']);
    references(record, 'changeRecordIds', ['change-record']);
  }
  for (const record of pkg.changeRecords) {
    references(
      record,
      'targetRecordId',
      records.map((item) => item.entityType),
    );
    references(record, 'changedByPartyId', ['party']);
  }
  for (const record of pkg.profileDeclarations) references(record, 'authorityPartyId', ['party']);

  validateInventory(pkg, records, diagnostics);
  validateSupersession(records, byId, diagnostics);
  validateDependencyCycles(pkg, diagnostics);
  validateDeficiencies(pkg, diagnostics);
  validateExtensions(pkg, diagnostics);
  validateProjectAggregation(pkg, diagnostics);
  validateExternalReferences(pkg, diagnostics);
  validateEvidenceSemantics(pkg, byId, diagnostics);
  validateGateAndEvaluationContexts(pkg, byId, diagnostics);
  validateReviewsAndRecommendations(pkg, byId, diagnostics);
  validateDecisionsConditionsHandoverAndControl(pkg, byId, diagnostics);

  const declaredHash = pkg.manifest.contentHash;
  if (
    declaredHash &&
    declaredHash.value !== packageContentHash(pkg as unknown as Record<string, unknown>)
  ) {
    diagnostics.push(
      diag(
        'INVALID_CONTENT_HASH',
        '/manifest/contentHash/value',
        'Declared package content hash does not match canonical package content.',
      ),
    );
  }
  return diagnostics;
}

export function allRecords(pkg: OcrsPackage): VersionedRecord[] {
  return [pkg.project, ...RECORD_COLLECTIONS.flatMap((key) => pkg[key] as VersionedRecord[])];
}

function validateInventory(
  pkg: OcrsPackage,
  records: VersionedRecord[],
  diagnostics: Diagnostic[],
): void {
  const actual = new Set(
    records.map((record) => `${record.id}|${record.entityType}|${record.recordVersion}`),
  );
  const declared = new Set(
    pkg.manifest.inventory.map(
      (item) => `${item.recordId}|${item.entityType}|${item.recordVersion}`,
    ),
  );
  for (const key of actual)
    if (!declared.has(key))
      diagnostics.push(
        diag(
          'MANIFEST_INVENTORY_MISMATCH',
          '/manifest/inventory',
          `Record ${key} is absent from the manifest inventory.`,
        ),
      );
  for (const key of declared)
    if (!actual.has(key))
      diagnostics.push(
        diag(
          'MANIFEST_INVENTORY_MISMATCH',
          '/manifest/inventory',
          `Inventory entry ${key} has no exact record.`,
        ),
      );
}

function validateSupersession(
  records: VersionedRecord[],
  byId: Map<string, VersionedRecord>,
  diagnostics: Diagnostic[],
): void {
  for (const record of records) {
    if (!record.supersedes) continue;
    const target = byId.get(record.supersedes);
    if (!target || target.entityType !== record.entityType)
      diagnostics.push(
        diag(
          'INVALID_SUPERSESSION_CHAIN',
          `/${record.id}/supersedes`,
          `${record.id} must supersede an existing ${record.entityType} record.`,
        ),
      );
    const seen = new Set([record.id]);
    let current: VersionedRecord | undefined = target;
    while (current) {
      if (seen.has(current.id)) {
        diagnostics.push(
          diag(
            'INVALID_SUPERSESSION_CHAIN',
            `/${record.id}/supersedes`,
            `Supersession cycle includes ${current.id}.`,
          ),
        );
        break;
      }
      seen.add(current.id);
      current = current.supersedes ? byId.get(current.supersedes) : undefined;
    }
  }
}

function validateDependencyCycles(pkg: OcrsPackage, diagnostics: Diagnostic[]): void {
  const edges = pkg.dependencies.filter((item) => !item.circularityAllowed);
  const adjacency = new Map<string, string[]>();
  for (const edge of edges)
    adjacency.set(edge.sourceId, [...(adjacency.get(edge.sourceId) ?? []), edge.targetId]);
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const visit = (node: string): boolean => {
    if (visiting.has(node)) return true;
    if (visited.has(node)) return false;
    visiting.add(node);
    for (const next of adjacency.get(node) ?? []) if (visit(next)) return true;
    visiting.delete(node);
    visited.add(node);
    return false;
  };
  for (const node of adjacency.keys())
    if (visit(node)) {
      diagnostics.push(
        diag(
          'PROHIBITED_CIRCULAR_DEPENDENCY',
          '/dependencies',
          `A prohibited dependency cycle includes ${node}.`,
        ),
      );
      break;
    }
}

function validateDeficiencies(pkg: OcrsPackage, diagnostics: Diagnostic[]): void {
  for (const item of pkg.deficiencies) {
    if (item.category === 'B' && item.status === 'open' && !item.requiredFutureClosurePointId)
      diagnostics.push(
        diag(
          'CATEGORY_B_CLOSURE_POINT_REQUIRED',
          `/${item.id}`,
          'Open Category B deficiency requires a future closure point.',
        ),
      );
    if (item.category === 'C' && item.status !== 'closed') {
      if (!item.acceptance)
        diagnostics.push(
          diag(
            'CATEGORY_C_ACCEPTANCE_REQUIRED',
            `/${item.id}`,
            'Open Category C deficiency requires formal acceptance.',
          ),
        );
      if (!item.ownerPartyId)
        diagnostics.push(
          diag(
            'CATEGORY_C_OWNER_REQUIRED',
            `/${item.id}`,
            'Open Category C deficiency requires an owner.',
          ),
        );
      if (!item.riskAssessment)
        diagnostics.push(
          diag(
            'CATEGORY_C_RISK_ASSESSMENT_REQUIRED',
            `/${item.id}`,
            'Open Category C deficiency requires a risk assessment.',
          ),
        );
      if (!item.closurePlan)
        diagnostics.push(
          diag(
            'CATEGORY_C_CLOSURE_PLAN_REQUIRED',
            `/${item.id}`,
            'Open Category C deficiency requires an approved closure plan.',
          ),
        );
    }
    if (item.category === 'D' && item.status !== 'reclassified')
      diagnostics.push(
        diag(
          'CATEGORY_D_DISPOSITION_REQUIRED',
          `/${item.id}`,
          'Category D requires disposition or reclassification before it can be treated as closed or accepted.',
        ),
      );
  }
}

function validateExtensions(pkg: OcrsPackage, diagnostics: Diagnostic[]): void {
  for (const item of pkg.extensionDeclarations) {
    const namespace = String(item.namespace);
    if (
      namespace === 'ocrs' ||
      namespace.startsWith('ocrs:') ||
      namespace === 'icxa' ||
      namespace.startsWith('icxa:')
    )
      diagnostics.push(
        diag(
          'RESERVED_EXTENSION_NAMESPACE',
          `/${item.id}/namespace`,
          'Project and vendor extensions cannot use reserved OCRS or ICxA namespaces.',
        ),
      );
    if (Array.isArray(item.controlledTermOverrides) && item.controlledTermOverrides.length > 0)
      diagnostics.push(
        diag(
          'CONTROLLED_TERM_REDEFINITION',
          `/${item.id}/controlledTermOverrides`,
          'Extensions cannot redefine official controlled terms.',
        ),
      );
  }
}

function validateProjectAggregation(pkg: OcrsPackage, diagnostics: Diagnostic[]): void {
  if (
    pkg.project.aggregateReadiness === 'ready' &&
    pkg.systems.some((system) => system.readinessStatus === 'not_ready')
  )
    diagnostics.push(
      diag(
        'PROJECT_STATUS_OVERRIDE',
        `/${pkg.project.id}/aggregateReadiness`,
        'Project-level ready status cannot override a not-ready system.',
      ),
    );
}

function validateExternalReferences(pkg: OcrsPackage, diagnostics: Diagnostic[]): void {
  const references = [
    ...pkg.evidence.flatMap((evidence) =>
      typeof evidence.externalReference === 'string'
        ? [{ id: evidence.id, value: evidence.externalReference }]
        : [],
    ),
    ...(pkg.manifest.externalEvidenceReferences ?? []).map((item) => ({
      id: 'manifest',
      value: item.reference,
    })),
  ];
  for (const item of references) {
    const value = item.value;
    if (
      !(value.startsWith('https://') || value.startsWith('urn:')) ||
      value.includes('..') ||
      value.startsWith('file:')
    )
      diagnostics.push(
        diag(
          'UNSAFE_EXTERNAL_REFERENCE',
          `/${item.id}/externalReference`,
          `Unsafe external reference ${value}.`,
        ),
      );
  }
}

function validateEvidenceSemantics(
  pkg: OcrsPackage,
  byId: Map<string, VersionedRecord>,
  diagnostics: Diagnostic[],
): void {
  const rfdcDeclared = pkg.manifest.profiles.some(
    (profile) => profile.profileId === 'ocrs:profile:rfdc' && profile.profileVersion === '0.1.0',
  );
  if (rfdcDeclared && !pkg.manifest.contentHash)
    diagnostics.push(
      diag(
        'RFDC_CONTENT_HASH_REQUIRED',
        '/manifest/contentHash',
        'The RFDC conformance profile requires a verified SHA-256 package content hash.',
      ),
    );

  const evaluationTimes = new Map<string, number>();
  for (const evaluation of pkg.deterministicEvaluations)
    evaluationTimes.set(String(evaluation.gateId), Date.parse(String(evaluation.evaluatedAt)));

  for (const evidence of pkg.evidence) {
    if (evidence.hash) {
      const requiredLength = evidence.hash.algorithm === 'sha256' ? 64 : 128;
      if (!new RegExp(`^[a-fA-F0-9]{${requiredLength}}$`).test(evidence.hash.value))
        diagnostics.push(
          diag(
            'INVALID_EVIDENCE_HASH_LENGTH',
            `/${evidence.id}/hash/value`,
            `${evidence.hash.algorithm} evidence hashes require exactly ${requiredLength} hexadecimal characters.`,
          ),
        );
    }

    const provenance = byId.get(evidence.provenanceId);
    if (
      provenance?.entityType === 'evidence-provenance' &&
      !asStrings(provenance.evidenceIds).includes(evidence.id)
    )
      diagnostics.push(
        diag(
          'EVIDENCE_PROVENANCE_MISMATCH',
          `/${evidence.id}/provenanceId`,
          `Provenance ${evidence.provenanceId} does not include ${evidence.id}.`,
        ),
      );

    if (evidence.status === 'accepted_current') {
      if (evidence.reviewStatus !== 'accepted' || evidence.failureStatus === 'failed')
        diagnostics.push(
          diag(
            'EVIDENCE_STATUS_CONTRADICTION',
            `/${evidence.id}/status`,
            'accepted_current evidence must be accepted by review and must not be failed.',
          ),
        );
      if (evidence.currencyApplicable && evidence.decisionPointCurrency !== 'current')
        diagnostics.push(
          diag(
            'EVIDENCE_CURRENCY_CONTRADICTION',
            `/${evidence.id}/decisionPointCurrency`,
            'accepted_current evidence with applicable currency must be current.',
          ),
        );
    }

    for (const conditionId of evidence.applicableConditionIds) {
      const condition = byId.get(conditionId) as ReadinessConditionLike | undefined;
      if (!condition || condition.entityType !== 'readiness-condition') continue;
      if (condition.rule?.kind !== 'accepted_evidence') continue;
      if (!isSubset(asStrings(condition.subjectIds), evidence.applicableSubjectIds))
        diagnostics.push(
          diag(
            'EVIDENCE_SUBJECT_SCOPE_MISMATCH',
            `/${evidence.id}/applicableSubjectIds`,
            `${evidence.id} does not cover every subject required by ${condition.id}.`,
          ),
        );
      if (!isSubset(asStrings(condition.boundaryIds), evidence.applicableBoundaryIds))
        diagnostics.push(
          diag(
            'EVIDENCE_BOUNDARY_SCOPE_MISMATCH',
            `/${evidence.id}/applicableBoundaryIds`,
            `${evidence.id} does not cover every boundary required by ${condition.id}.`,
          ),
        );
      if (!isSubset(asStrings(condition.requirementIds), evidence.applicableRequirementIds))
        diagnostics.push(
          diag(
            'EVIDENCE_REQUIREMENT_SCOPE_MISMATCH',
            `/${evidence.id}/applicableRequirementIds`,
            `${evidence.id} does not cover every requirement required by ${condition.id}.`,
          ),
        );
      if (
        evidence.status === 'accepted_current' &&
        !asStrings(condition.rule.requiredEvidenceTypes).includes(evidence.evidenceType)
      )
        diagnostics.push(
          diag(
            'EVIDENCE_TYPE_MISMATCH',
            `/${evidence.id}/evidenceType`,
            `${evidence.evidenceType} is not a required evidence type for ${condition.id}.`,
          ),
        );
      const at =
        evaluationTimes.get(String(condition.gateId)) ?? Date.parse(pkg.manifest.createdAt);
      if (
        evidence.status === 'accepted_current' &&
        ((evidence.validFrom && at < Date.parse(evidence.validFrom)) ||
          (evidence.validTo && at > Date.parse(evidence.validTo)))
      )
        diagnostics.push(
          diag(
            'EVIDENCE_VALIDITY_CONTRADICTION',
            `/${evidence.id}`,
            `accepted_current evidence is outside its validity interval at the applicable evaluation time.`,
          ),
        );
    }
  }

  for (const external of pkg.manifest.externalEvidenceReferences ?? []) {
    const evidence = byId.get(external.evidenceId) as unknown as
      | {
          externalReference?: string;
          externalVersionId?: string;
          hash?: { algorithm?: string; value?: string };
        }
      | undefined;
    if (!evidence || evidence.externalReference !== external.reference)
      diagnostics.push(
        diag(
          'EXTERNAL_EVIDENCE_REFERENCE_MISMATCH',
          '/manifest/externalEvidenceReferences',
          `Manifest external reference for ${external.evidenceId} does not match the evidence record.`,
        ),
      );
    const bindingMatches =
      external.binding?.kind === 'version' || external.binding?.kind === 'immutable_identifier'
        ? external.binding.value === evidence?.externalVersionId
        : external.binding?.kind === evidence?.hash?.algorithm &&
          external.binding.value.toLowerCase() === evidence?.hash?.value?.toLowerCase();
    if (!external.binding?.value || !bindingMatches)
      diagnostics.push(
        diag(
          'EXTERNAL_EVIDENCE_BINDING_REQUIRED',
          '/manifest/externalEvidenceReferences',
          `External evidence ${external.evidenceId} requires a matching digest, version, or immutable identifier binding.`,
        ),
      );
  }

  const manifestBindings = new Set(
    (pkg.manifest.externalEvidenceReferences ?? []).map((item) => item.evidenceId),
  );
  const reliedUponEvidence = new Set([
    ...pkg.readinessConditions.flatMap((condition) => asStrings(condition.evidenceIds)),
    ...pkg.readinessReviews.flatMap((review) => asStrings(review.evidenceIds)),
    ...pkg.deterministicEvaluations.flatMap((evaluation) => asStrings(evaluation.inputRecordIds)),
  ]);
  for (const evidence of pkg.evidence) {
    if (
      evidence.externalReference &&
      reliedUponEvidence.has(evidence.id) &&
      !manifestBindings.has(evidence.id)
    )
      diagnostics.push(
        diag(
          'EXTERNAL_EVIDENCE_BINDING_REQUIRED',
          `/${evidence.id}/externalReference`,
          `Relied-upon external evidence ${evidence.id} requires a matching manifest binding.`,
        ),
      );
  }
}

interface ReadinessConditionLike extends VersionedRecord {
  gateId?: string;
  subjectIds?: unknown;
  boundaryIds?: unknown;
  requirementIds?: unknown;
  rule?: { kind?: string; prerequisiteGateId?: string; requiredEvidenceTypes?: unknown };
}

function validateGateAndEvaluationContexts(
  pkg: OcrsPackage,
  byId: Map<string, VersionedRecord>,
  diagnostics: Diagnostic[],
): void {
  const gateOrder = new Map([
    ['construction_completion', 0],
    ['ready_for_dynamic_commissioning', 1],
    ['ready_for_energization', 2],
    ['ready_for_start_up', 3],
    ['performance_verification', 4],
    ['trial_operation', 5],
  ]);
  const gates = [...pkg.commissioningStageGates, ...pkg.operationalReadinessGates];
  for (const gate of gates) {
    for (const conditionId of asStrings(gate.conditionIds)) {
      const condition = byId.get(conditionId) as ReadinessConditionLike | undefined;
      if (condition && condition.gateId !== gate.id)
        diagnostics.push(
          diag(
            'GATE_CONDITION_MISMATCH',
            `/${gate.id}/conditionIds`,
            `${gate.id} references ${conditionId}, which belongs to ${condition.gateId}.`,
          ),
        );
    }
  }

  for (const condition of pkg.readinessConditions) {
    const gate = byId.get(condition.gateId);
    if (!gate) continue;
    if (
      !isSubset(condition.subjectIds, asStrings(gate.subjectIds)) ||
      !isSubset(condition.boundaryIds, asStrings(gate.boundaryIds))
    )
      diagnostics.push(
        diag(
          'CONDITION_GATE_SCOPE_MISMATCH',
          `/${condition.id}`,
          `${condition.id} subjects and boundaries must be within its gate context.`,
        ),
      );
    if (condition.rule.prerequisiteGateId) {
      const prerequisite = byId.get(condition.rule.prerequisiteGateId);
      const preceding = gateOrder.get(String(prerequisite?.gateType));
      const current = gateOrder.get(String(gate.gateType));
      if (
        prerequisite?.entityType !== 'commissioning-stage-gate' ||
        preceding === undefined ||
        current === undefined ||
        preceding >= current ||
        !sameSet(asStrings(prerequisite.subjectIds), asStrings(gate.subjectIds))
      )
        diagnostics.push(
          diag(
            'INVALID_PREREQUISITE_GATE',
            `/${condition.id}/rule/prerequisiteGateId`,
            `${condition.rule.prerequisiteGateId} is not a compatible preceding gate.`,
          ),
        );
    }
  }

  for (const evaluation of pkg.deterministicEvaluations) {
    const gate = byId.get(String(evaluation.gateId));
    if (!gate) continue;
    if (
      !sameSet(asStrings(evaluation.subjectIds), asStrings(gate.subjectIds)) ||
      !sameSet(asStrings(evaluation.boundaryIds), asStrings(gate.boundaryIds))
    )
      diagnostics.push(
        diag(
          'EVALUATION_CONTEXT_MISMATCH',
          `/${evaluation.id}`,
          'A deterministic evaluation must use the exact gate subjects and boundaries.',
        ),
      );
    const requiredInputs = [gate.id, ...asStrings(gate.conditionIds)];
    if (!isSubset(requiredInputs, asStrings(evaluation.inputRecordIds)))
      diagnostics.push(
        diag(
          'EVALUATION_INPUT_MISMATCH',
          `/${evaluation.id}/inputRecordIds`,
          'The evaluation input inventory omits its gate or one or more evaluated conditions.',
        ),
      );
    const storedStatus = String(
      gate.entityType === 'commissioning-stage-gate' ? gate.deterministicStatus : gate.status,
    );
    const result = String(evaluation.result);
    const normalized = storedStatus === 'ready' ? 'satisfied' : storedStatus;
    if (normalized !== 'not_evaluated' && normalized !== result)
      diagnostics.push(
        diag(
          'GATE_EVALUATION_CONTRADICTION',
          `/${gate.id}`,
          `Stored gate status ${storedStatus} contradicts evaluation result ${result}.`,
        ),
      );
  }
}

function validateReviewsAndRecommendations(
  pkg: OcrsPackage,
  byId: Map<string, VersionedRecord>,
  diagnostics: Diagnostic[],
): void {
  for (const review of pkg.readinessReviews) {
    const gate = byId.get(String(review.gateId));
    const evaluation = byId.get(String(review.evaluationId));
    if (!gate || !evaluation) continue;
    const contextMismatch =
      evaluation.gateId !== gate.id ||
      !sameSet(asStrings(review.subjectIds), asStrings(gate.subjectIds)) ||
      !sameSet(asStrings(review.boundaryIds), asStrings(gate.boundaryIds));
    const related = [
      ...asStrings(review.openDeficiencyIds).map((id) => byId.get(id)),
      ...asStrings(review.constraintIds).map((id) => byId.get(id)),
      ...asStrings(review.dependencyIds).map((id) => byId.get(id)),
    ].filter(Boolean) as VersionedRecord[];
    const wrongRelated = related.some((item) => {
      if (item.entityType === 'deficiency')
        return !asStrings(item.affectedGateIds).includes(gate.id);
      return item.gateId !== gate.id;
    });
    const wrongEvidence = asStrings(review.evidenceIds)
      .map((id) => byId.get(id))
      .filter(Boolean)
      .some(
        (item) =>
          !intersects(asStrings(item?.applicableSubjectIds), asStrings(gate.subjectIds)) ||
          !intersects(asStrings(item?.applicableBoundaryIds), asStrings(gate.boundaryIds)),
      );
    if (contextMismatch || wrongRelated || wrongEvidence)
      diagnostics.push(
        diag(
          'REVIEW_CONTEXT_MISMATCH',
          `/${review.id}`,
          'Review gate, evaluation, scope, evidence, deficiencies, constraints, and dependencies must share one context.',
        ),
      );
    const result = String(evaluation.result);
    const conclusion = String(review.conclusion);
    if (
      (result === 'satisfied' && conclusion === 'does_not_support') ||
      (result !== 'satisfied' && conclusion !== 'does_not_support')
    )
      diagnostics.push(
        diag(
          'REVIEW_CONCLUSION_CONTRADICTION',
          `/${review.id}/conclusion`,
          `Review conclusion ${conclusion} contradicts deterministic evaluation ${result}.`,
        ),
      );
    for (const roleId of asStrings(review.reviewerRoleAssignmentIds))
      validateRoleAuthority(
        roleId,
        ['readiness_reviewer'],
        'review_readiness',
        String(review.reviewedAt),
        asStrings(review.subjectIds),
        asStrings(review.boundaryIds),
        byId,
        diagnostics,
        review.id,
      );
  }

  for (const recommendation of pkg.readinessRecommendations) {
    const review = byId.get(String(recommendation.reviewId));
    if (!review || review.gateId !== recommendation.gateId)
      diagnostics.push(
        diag(
          'RECOMMENDATION_CONTEXT_MISMATCH',
          `/${recommendation.id}`,
          'Recommendation review and gate must match.',
        ),
      );
    const value = String(recommendation.recommendation);
    if (
      (value === 'proceed' && review?.conclusion !== 'supports_proceed') ||
      (value === 'proceed_with_documented_conditions' &&
        review?.conclusion !== 'supports_proceed_with_conditions')
    )
      diagnostics.push(
        diag(
          'RECOMMENDATION_NOT_SUPPORTED',
          `/${recommendation.id}/recommendation`,
          'The referenced Review does not support this progression recommendation.',
        ),
      );
    if (
      value === 'proceed_with_documented_conditions' &&
      !asStrings(recommendation.conditionIds).length
    )
      diagnostics.push(
        diag(
          'RECOMMENDATION_CONDITIONS_REQUIRED',
          `/${recommendation.id}/conditionIds`,
          'Proceed-with-conditions requires controlled Condition records.',
        ),
      );
    const gate = byId.get(String(recommendation.gateId));
    validateRoleAuthority(
      String(recommendation.issuedByRoleAssignmentId),
      ['readiness_reviewer'],
      'recommend_progression',
      String(recommendation.issuedAt),
      asStrings(gate?.subjectIds),
      asStrings(gate?.boundaryIds),
      byId,
      diagnostics,
      recommendation.id,
    );
  }
}

function validateDecisionsConditionsHandoverAndControl(
  pkg: OcrsPackage,
  byId: Map<string, VersionedRecord>,
  diagnostics: Diagnostic[],
): void {
  for (const decision of pkg.readinessDecisions) {
    const gate = byId.get(String(decision.gateId));
    if (
      gate &&
      (!sameSet(asStrings(decision.subjectIds), asStrings(gate.subjectIds)) ||
        !sameSet(asStrings(decision.boundaryIds), asStrings(gate.boundaryIds)))
    )
      diagnostics.push(
        diag(
          'DECISION_CONTEXT_MISMATCH',
          `/${decision.id}`,
          'Readiness decision gate, subjects, and boundaries must match.',
        ),
      );
    if (gate?.status && gate.status !== decision.decision)
      diagnostics.push(
        diag(
          'GATE_DECISION_CONTRADICTION',
          `/${decision.id}`,
          'The stored Operational Readiness gate status contradicts its applicable decision.',
        ),
      );
    validateRoleAuthority(
      String(decision.decisionMakerRoleAssignmentId),
      ['readiness_decision_authority'],
      'make_readiness_decision',
      String(decision.decidedAt),
      asStrings(decision.subjectIds),
      asStrings(decision.boundaryIds),
      byId,
      diagnostics,
      decision.id,
    );
    const conditionIds = asStrings(decision.conditionIds);
    const openConditions = conditionIds
      .map((id) => byId.get(id))
      .filter((item) => item?.entityType === 'condition' && item.status === 'open');
    if (decision.decision === 'conditionally_ready' && openConditions.length === 0)
      diagnostics.push(
        diag(
          'CONDITIONAL_DECISION_REQUIRES_CONDITIONS',
          `/${decision.id}/conditionIds`,
          'A conditionally_ready decision requires at least one valid open controlled Condition.',
        ),
      );
    if (decision.decision !== 'conditionally_ready' && conditionIds.length > 0)
      diagnostics.push(
        diag(
          'DECISION_CONDITION_CONTRADICTION',
          `/${decision.id}/conditionIds`,
          'A ready or hold decision must not carry conditional-ready Condition IDs.',
        ),
      );
    const residualInputIds = asStrings(decision.residualRiskInputIds);
    const residualStatus = (decision.residualRiskDeclaration as { status?: string } | undefined)
      ?.status;
    if (
      (residualStatus === 'none_identified' && residualInputIds.length > 0) ||
      (residualStatus === 'declared_and_controlled' && residualInputIds.length === 0) ||
      (residualStatus === 'unresolved' && decision.decision !== 'hold')
    )
      diagnostics.push(
        diag(
          'DECISION_RESIDUAL_RISK_CONTRADICTION',
          `/${decision.id}/residualRiskDeclaration`,
          'Residual-risk declaration, referenced inputs, and Level 2 decision must be mutually consistent.',
        ),
      );
  }

  for (const condition of pkg.conditions) {
    if (!asStrings(condition.sourceRecordIds).length)
      diagnostics.push(
        diag(
          'CONDITION_SOURCE_REQUIRED',
          `/${condition.id}/sourceRecordIds`,
          'A controlled Condition requires at least one source record.',
        ),
      );
    if (condition.status === 'verified_closed' && !asStrings(condition.closureEvidenceIds).length)
      diagnostics.push(
        diag(
          'CONDITION_CLOSURE_EVIDENCE_REQUIRED',
          `/${condition.id}/closureEvidenceIds`,
          'A verified-closed Condition requires closure evidence.',
        ),
      );
    for (const decisionId of asStrings(condition.decisionIds)) {
      const decision = byId.get(decisionId);
      if (decision && !asStrings(decision.conditionIds).includes(condition.id))
        diagnostics.push(
          diag(
            'CONDITION_DECISION_MISMATCH',
            `/${condition.id}/decisionIds`,
            `${decisionId} does not reciprocally reference ${condition.id}.`,
          ),
        );
    }
  }

  for (const handover of pkg.systemHandovers) {
    if (handover.handoverStatus !== 'accepted') continue;
    const role = byId.get(String(handover.acceptedByRoleAssignmentId));
    if (
      handover.acceptedByPartyId !== handover.receivingPartyId ||
      role?.partyId !== handover.acceptedByPartyId
    )
      diagnostics.push(
        diag(
          'HANDOVER_RECEIVER_AUTHORITY_INVALID',
          `/${handover.id}`,
          'Accepted handover must be accepted by the receiving party through its applicable role assignment.',
        ),
      );
    validateRoleAuthority(
      String(handover.acceptedByRoleAssignmentId),
      ['receiving_organization'],
      'accept_handover',
      String(handover.effectiveAt),
      asStrings(handover.systemIds),
      asStrings(handover.boundaryIds),
      byId,
      diagnostics,
      handover.id,
    );
  }

  for (const transfer of pkg.transfersOfOperationalControl) {
    if (transfer.status !== 'effective') continue;
    const decision = byId.get(String(transfer.readinessDecisionId));
    const gate = decision ? byId.get(String(decision.gateId)) : undefined;
    const handover = byId.get(String(transfer.handoverId));
    validateRoleAuthority(
      String(transfer.transferredByRoleAssignmentId),
      ['delivery_party', 'readiness_decision_authority'],
      'transfer_operational_control',
      String(transfer.effectiveAt),
      asStrings(transfer.systemIds),
      asStrings(transfer.boundaryIds),
      byId,
      diagnostics,
      transfer.id,
    );
    validateRoleAuthority(
      String(transfer.acceptedByRoleAssignmentId),
      ['receiving_organization'],
      'transfer_operational_control',
      String(transfer.effectiveAt),
      asStrings(transfer.systemIds),
      asStrings(transfer.boundaryIds),
      byId,
      diagnostics,
      transfer.id,
    );
    if (
      !decision ||
      decision.entityType !== 'readiness-decision' ||
      !['ready', 'conditionally_ready'].includes(String(decision.decision)) ||
      decision.decisionRecordStatus !== 'effective'
    )
      diagnostics.push(
        diag(
          'TOC_SUPPORTING_DECISION_INVALID',
          `/${transfer.id}/readinessDecisionId`,
          'An effective TOC requires an effective supportive readiness decision, not hold/rejected/revoked/superseded.',
        ),
      );
    if (
      transfer.supportBasisType === 'aocr_decision' &&
      gate?.gateType !== 'asset_operational_control_ready'
    )
      diagnostics.push(
        diag(
          'TOC_REQUIRES_AOCR_DECISION',
          `/${transfer.id}/readinessDecisionId`,
          'An aocr_decision TOC basis must cite the applicable Asset Operational Control Ready decision.',
        ),
      );
    const equivalentProfile = byId.get(String(transfer.approvedEquivalentProfileId));
    if (
      transfer.supportBasisType === 'profile_approved_equivalent' &&
      (!transfer.approvedEquivalentProfileId ||
        !asStrings(equivalentProfile?.tocEquivalentGateTypes).includes(String(gate?.gateType)))
    )
      diagnostics.push(
        diag(
          'TOC_EQUIVALENT_NOT_APPROVED',
          `/${transfer.id}/approvedEquivalentProfileId`,
          'A profile-approved equivalent requires an explicitly declared approving profile.',
        ),
      );
    const scopeMismatch =
      !sameSet(asStrings(transfer.systemIds), asStrings(decision?.subjectIds)) ||
      !sameSet(asStrings(transfer.boundaryIds), asStrings(decision?.boundaryIds)) ||
      handover?.deliveringPartyId !== transfer.fromPartyId ||
      handover?.receivingPartyId !== transfer.toPartyId ||
      byId.get(String(transfer.transferredByRoleAssignmentId))?.partyId !== transfer.fromPartyId ||
      byId.get(String(transfer.acceptedByRoleAssignmentId))?.partyId !== transfer.toPartyId ||
      !sameSet(asStrings(handover?.systemIds), asStrings(transfer.systemIds)) ||
      !boundarySetsCompatible(
        pkg,
        asStrings(handover?.boundaryIds),
        asStrings(transfer.boundaryIds),
      );
    if (scopeMismatch || transfer.fromPartyId === transfer.toPartyId)
      diagnostics.push(
        diag(
          'TOC_CONTEXT_MISMATCH',
          `/${transfer.id}`,
          'TOC systems, boundaries, parties, decision scope, and handover context must be mutually consistent.',
        ),
      );
    if (
      decision &&
      handover &&
      (Date.parse(String(decision.decidedAt)) > Date.parse(String(transfer.effectiveAt)) ||
        Date.parse(String(handover.effectiveAt)) > Date.parse(String(transfer.effectiveAt)))
    )
      diagnostics.push(
        diag(
          'TOC_EFFECTIVE_DATE_INVALID',
          `/${transfer.id}/effectiveAt`,
          'TOC cannot become effective before its supporting decision and handover.',
        ),
      );
  }
}

function validateRoleAuthority(
  roleId: string,
  allowedRoles: string[],
  action: string,
  atValue: string,
  subjectIds: string[],
  boundaryIds: string[],
  byId: Map<string, VersionedRecord>,
  diagnostics: Diagnostic[],
  sourceId: string,
): void {
  const role = byId.get(roleId);
  const scope = role ? byId.get(String(role.authorityScopeId)) : undefined;
  const at = Date.parse(atValue);
  const invalid =
    !role ||
    role.entityType !== 'role-assignment' ||
    !allowedRoles.includes(String(role.role)) ||
    at < Date.parse(String(role.validFrom)) ||
    (role.validTo !== undefined && at > Date.parse(String(role.validTo))) ||
    !scope ||
    scope.entityType !== 'authority-scope' ||
    !asStrings(scope.permittedActions).includes(action) ||
    !isSubset(subjectIds, asStrings(scope.subjectIds)) ||
    !isSubset(boundaryIds, asStrings(scope.boundaryIds));
  if (invalid)
    diagnostics.push(
      diag(
        'ROLE_AUTHORITY_INVALID',
        `/${sourceId}`,
        `${roleId} lacks the required role, validity period, subject/boundary scope, or ${action} permission.`,
      ),
    );
}

function asStrings(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : [];
}

function isSubset(required: string[], available: string[]): boolean {
  return required.every((item) => available.includes(item));
}

function sameSet(left: string[], right: string[]): boolean {
  return left.length === right.length && isSubset(left, right);
}

function intersects(left: string[], right: string[]): boolean {
  return left.some((item) => right.includes(item));
}

function mappedBoundaries(pkg: OcrsPackage, boundaryIds: string[]): string[] {
  return boundaryIds.flatMap((id) => {
    const boundary = pkg.boundaries.find((item) => item.id === id);
    return [id, ...asStrings(boundary?.mappedBoundaryIds)];
  });
}

function boundarySetsCompatible(pkg: OcrsPackage, left: string[], right: string[]): boolean {
  return intersects(mappedBoundaries(pkg, left), mappedBoundaries(pkg, right));
}

function validateExplanationReferences(
  value: unknown,
  source: VersionedRecord,
  reference: (source: VersionedRecord, field: string, id: unknown, expected: string[]) => void,
): void {
  if (!value || typeof value !== 'object') return;
  const node = value as { supportingRecordIds?: unknown[]; children?: unknown[] };
  const allTypes = [
    'project',
    'system-breakdown-structure',
    'system',
    'hierarchical-system-relationship',
    'asset',
    'interface',
    'boundary',
    'party',
    'role-assignment',
    'authority-scope',
    'execution-requirement',
    'readiness-condition',
    'activity',
    'evidence',
    'evidence-provenance',
    'evidence-revision',
    'deficiency',
    'deficiency-reclassification',
    'constraint',
    'dependency',
    'residual-risk-input',
    'deterministic-evaluation',
    'evaluation-explanation',
    'commissioning-stage-gate',
    'operational-readiness-gate',
    'readiness-review',
    'readiness-recommendation',
    'readiness-decision',
    'system-handover',
    'transfer-of-operational-control',
    'condition',
    'change-record',
    'profile-declaration',
    'extension-declaration',
  ];
  for (const id of node.supportingRecordIds ?? [])
    reference(source, 'root.supportingRecordIds', id, allTypes);
  for (const child of node.children ?? []) validateExplanationReferences(child, source, reference);
}

function schemaDiagnostic(error: ErrorObject): Diagnostic {
  if (
    error.keyword === 'required' &&
    (error.params as { missingProperty?: string }).missingProperty === 'recordVersion'
  ) {
    return diag(
      'MISSING_RECORD_VERSION',
      error.instancePath || '/',
      `${error.instancePath || '/'} is missing recordVersion.`,
    );
  }
  return diag(
    'SCHEMA_INVALID',
    error.instancePath || '/',
    `${error.instancePath || '/'} ${error.message ?? error.keyword}`,
  );
}

function diag(code: string, path: string, message: string): Diagnostic {
  return { code, path, message };
}
