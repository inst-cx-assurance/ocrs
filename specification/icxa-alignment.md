# ICxA Alignment Baseline

This document establishes the v0.1 alignment baseline for OCRS. It declares the controlled ICxA editions and revisions to which the OCRS profile applies, and it records the mapping between the ICxA standards and the OCRS v0.1 model.

## 1. Governing rule

OCRS shall represent the governing ICxA standards; it shall not weaken, reinterpret, or replace their governance requirements. Where the generic OCRS core and an official ICxA profile differ, the official ICxA profile controls any claim of ICxA profile conformance.

## 2. Controlled ICxA standards in scope

For v0.1, the alignment baseline applies to the following ICxA editions and revisions:

- ICXA-10000, Outcome Assurance — Fundamentals
- ICXA-10001, Outcome Assurance — Requirements
- ICXA-10002, Outcome Assurance — Evidence Requirements
- ICXA-20100, Commissioning & Outcome Execution — Concepts, Principles, and Model
- ICXA-20101, Commissioning & Outcome Execution — Requirements
- ICXA-20102, Commissioning & Outcome Execution — Vocabulary
- ICXA-20200, Operational Readiness — Concepts and Principles
- ICXA-20201, Operational Readiness — Requirements
- ICXA-20202, Operational Readiness — Vocabulary

The following are used only as informative guidance:

- ICXA-10003
- ICXA-20103
- ICXA-20203

Informative guidance shall not be converted into mandatory OCRS conformance requirements unless the governing ICxA requirements standard makes such content mandatory.

## 3. Baseline profile for v0.1

The baseline profile is the OCRS v0.1 core model with the initial RFDC stage-gate profile. The profile supports representation of:

- project / system / subsystem / equipment-tag structure;
- requirement and readiness condition records;
- Outcome Obligation and Outcome Requirement representation;
- Outcome Evidence Need representation;
- evidence generation and evaluation records;
- deficiencies, constraints, and dependencies;
- Level 2 Commissioning Stage-Gate and readiness review records;
- Level 1 outcome authorization linkage when expressly governed by the applicable process; and
- role assignment for accountable and responsible parties.

## 4. Traceability matrix

| ICxA requirement or controlled term | OCRS representation | Mapping status | Meaning loss / judgment not encoded deterministically | Evidence required to verify the mapping |
| --- | --- | --- | --- | --- |
| Outcome Obligation | OutcomeObligation | Full | None in the structural representation; professional interpretation remains external to OCRS | Applicable governing outcome document and obligation register |
| Outcome Requirement | OutcomeRequirement | Full | None in the record structure; obligation and acceptability remain governed by the ICxA process | Approved requirement record and evidence register |
| Outcome Evidence Need | OutcomeEvidenceNeed | Full | Evidence sufficiency and independent evaluation remain professional judgments | Evidence plan, review record, and audit evaluation |
| Evidence | Evidence | Full | Deterministic validation cannot replace professional sufficiency judgment | Test or activity record, artifact metadata, and disposition log |
| Deficiency | Deficiency | Full | Risk severity and business consequence remain judgment-based | Deficiency register and reconciliation status |
| Dependency | Dependency | Full | Sequencing or dependency priority may require professional judgment beyond the record | Dependency log and interface schedule |
| Boundary | Boundary | Full | Physical or operational interpretation remains broader than the model itself | System/asset or test boundary definition |
| Readiness Condition | ReadinessCondition | Full | Satisfaction or disposition still requires a formal readiness review | Review record, evidence package, and decision basis |
| Stage-Gate | StageGate | Full for representation; partial for authority | A stage-gate does not equal Outcome Authorization unless expressly governed | Stage-gate definition, evaluation, and recommendation |
| Readiness Review | ReadinessReview | Full | Review outcome remains a judgment-based decision | Review findings and evidence evidence package |
| Readiness Recommendation | ReadinessRecommendation | Full | Recommendation is not authorization | Recommendation record and recommendation basis |
| Readiness Decision | ReadinessDecision | Full | Formal decision authority remains external to OCRS | Decision record and stakeholder approval |
| Outcome Auditor Evaluation | OutcomeAuditorEvaluation | Full | Independent judgment and acceptability remain professional | Auditor report and conclusion |
| Residual Risk Declaration / Acceptance | ResidualRisk | Full | Acceptance of residual risk is not a schema outcome | Risk register and acceptance record |
| Outcome Authorization | OutcomeAuthorization | Full for representation; partial for governance authority | OCRS does not create authorization authority | Formal authorization record, conditions, and approvals |
| System Handover | Handover | Partial | Distinct from transfer of operational control and must be defined under the applicable readiness profile | Handover plan and acceptance record |
| Transfer of Operational Control | TransferOfOperationalControl | Partial | Requires operational readiness profile and formal decision gate | AOCR or equivalent decision record |
| ORC / AOCR / IOC / FOC gates | Future profile element | Not applicable to v0.1 | Not yet implemented as a profile | Future profile specification |

## 5. Mapping rules

The following rules apply:

- Full mapping means the OCRS core representation can express the structure in a generally faithful manner.
- Partial mapping means the concept can be represented but the full governing meaning is context-sensitive or profile-specific.
- Informative mapping means the standard is referenced for background only and is not a binding OCRS requirement in v0.1.
- Not applicable means the concept is outside the initial v0.1 scope.

## 6. Compatibility and versioning rule

When ICxA controlled source content changes, OCRS must not silently change the meaning of an existing profile. A new OCRS profile version shall be issued, with the compatibility impact and mapping changes documented as part of the profile release.

## 7. Draft status

This alignment baseline is a draft for OCRS v0.1 only. It must be reviewed and approved by ICxA where changes to official profile meaning, conformance claims, or normative interpretation are proposed.
