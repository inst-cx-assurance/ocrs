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
  for (const record of pkg.roleAssignments) {
    references(record, 'partyId', ['party']);
    references(record, 'authorityScopeId', ['authority-scope']);
  }
  for (const record of pkg.authorityScopes) references(record, 'boundaryIds', ['boundary']);
  for (const record of pkg.executionRequirements)
    references(record, 'subjectIds', ['system', 'asset', 'interface', 'boundary']);
  for (const record of pkg.readinessConditions) {
    references(record, 'gateId', ['commissioning-stage-gate']);
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
    references(record, 'evidenceId', ['evidence']);
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
    references(record, 'subjectIds', ['system']);
    references(record, 'boundaryIds', ['boundary']);
    references(record, 'conditionIds', ['readiness-condition']);
  }
  for (const record of pkg.operationalReadinessGates) {
    references(record, 'subjectIds', ['system']);
    references(record, 'boundaryIds', ['boundary']);
  }
  for (const record of pkg.readinessReviews) {
    references(record, 'gateId', ['commissioning-stage-gate', 'operational-readiness-gate']);
    references(record, 'reviewerRoleAssignmentIds', ['role-assignment']);
    references(record, 'evidenceIds', ['evidence']);
    references(record, 'evaluationId', ['deterministic-evaluation']);
    references(record, 'openDeficiencyIds', ['deficiency']);
    references(record, 'constraintIds', ['constraint']);
    references(record, 'dependencyIds', ['dependency']);
  }
  for (const record of pkg.readinessRecommendations) {
    references(record, 'reviewId', ['readiness-review']);
    references(record, 'gateId', ['commissioning-stage-gate']);
    references(record, 'conditionIds', ['condition']);
  }
  for (const record of pkg.readinessDecisions) {
    references(record, 'gateId', ['operational-readiness-gate']);
    references(record, 'decisionMakerRoleAssignmentId', ['role-assignment']);
    references(
      record,
      'basisRecordIds',
      records.map((item) => item.entityType),
    );
  }
  for (const record of pkg.systemHandovers) {
    references(record, 'systemIds', ['system']);
    references(record, 'boundaryIds', ['boundary']);
    references(record, 'acceptedByPartyId', ['party']);
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
    references(record, 'fromPartyId', ['party']);
    references(record, 'toPartyId', ['party']);
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
