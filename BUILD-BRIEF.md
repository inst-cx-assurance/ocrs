> Historical design brief. Current status is described in README.md and docs/verification-status.md; the current root LICENSE and specification/LICENSE govern the respective materials.

# Build the Open Completion & Readiness Standard (OCRS) v0.1

## Project Objective

Create the initial public repository and machine-readable specification for the **Open Completion & Readiness Standard (OCRS)**.

OCRS is an open interoperability specification for representing Outcome Assurance governance, Operational Readiness, Commissioning & Outcome Execution, evidence, deficiencies, dependencies, readiness decisions, stage-gates, and authorization in a structured and machine-readable form.

OCRS is governed and maintained by **ICxA**.

ICxA controls the OCRS specification, versioning, conformance requirements, and official releases.

However:

**ICxA must not control or restrict who may implement OCRS.**

Any organization, software developer, owner, contractor, lender, insurer, consultant, open-source project, or commercial software vendor must be able to create an OCRS-compatible implementation.

The architecture must therefore clearly separate:

1. the OCRS specification;
2. the OCRS reference schemas;
3. OCRS conformance tests;
4. optional reference implementations; and
5. proprietary or third-party implementations.

Do not create a proprietary ICxA software application.

The goal of OCRS v0.1 is to establish the **open semantic and interoperability layer** upon which software, APIs, databases, AI systems, and autonomous agents can later operate.

OCRS shall preserve the governance hierarchy established by the ICxA Standards:

1. **Level 1 — Outcome Assurance** defines Outcome Obligations, Outcome Requirements, Outcome Evidence Need, independent evidence evaluation, residual-risk acceptance, and Outcome Authorization.
2. **Level 2 — Commissioning & Outcome Execution and Operational Readiness** plans and performs delivery and readiness activities, produces controlled evidence, conducts Readiness Reviews, and issues Readiness Recommendations or readiness decision records.
3. A Level 2 stage-gate, certificate, Readiness Recommendation, or readiness decision shall not be represented as Level 1 Outcome Authorization unless it is expressly governed, evaluated, and recorded under the applicable Level 1 Outcome Assurance process.

OCRS v0.1 shall declare the exact ICxA standard editions and revisions to which its ICxA alignment profile applies. It shall not copy protected normative text into OCRS beyond what ICxA has authorized for publication.

---

# Core Architectural Principle

Implement this separation throughout the repository:

**ICxA Level 1 Outcome Assurance Standards**
define what outcomes require authorization, what evidence is needed, who independently evaluates evidence, and who accepts residual risk and authorizes the outcome.

↓

**ICxA Level 2 Commissioning & Outcome Execution and Operational Readiness Standards**
define how readiness is planned, executed, verified, evidenced, reviewed, and recommended.

↓

**OCRS**
defines how Level 1 governance records and Level 2 execution and readiness records are represented digitally, linked, and exchanged between systems without changing their authority.

↓

**Implementations**
create, consume, modify, analyze, and exchange OCRS-compatible information.

↓

**AI and Agents**
may reason over OCRS information but are not part of the OCRS core architecture.

OCRS must remain independent of:

- AI model;
- agent framework;
- orchestration framework;
- database;
- graph database;
- cloud platform;
- programming language;
- user interface;
- workflow engine;
- project management platform;
- completions software vendor.

Do not make assumptions about current agent architectures.

---

# Design Philosophy

OCRS should model **readiness and authorization based upon controlled, traceable evidence and professional judgment**, not simply completion percentages or manually assigned statuses.

The fundamental logic is:

`Outcome Obligation → Outcome Requirements → Outcome Evidence Need → Outcome Evidence → Outcome Auditor Evaluation → Outcome Authorization`

Level 2 evidence generation shall be represented separately:

`System / Boundary → Requirement or Readiness Condition → Activity / Verification / Test → Evidence → Readiness Review → Readiness Recommendation or Readiness Decision`

Where a Level 2 decision supports Level 1 governance, OCRS shall link the resulting evidence and recommendation to the applicable Outcome Evidence Need and Outcome Assurance Case. It shall not collapse the two chains into a single automated status.

A system should be capable of determining:

- what state an asset or system is in;
- what requirements apply;
- what evidence exists;
- what evidence is missing;
- what deficiencies or constraints remain;
- whether those items block a transition;
- whether the documented readiness conditions for a Level 2 stage-gate have been satisfied or dispositioned;
- what Readiness Recommendation or readiness decision is supported;
- whether the applicable Outcome Evidence Need has been satisfied;
- what the Outcome Auditor concluded about evidence sufficiency;
- whether the Outcome Director authorized, did not authorize, deferred, restricted, suspended, or reversed the applicable outcome; and
- what residual risk, conditions, limitations, constraints, or exceptions form part of the decision basis.

The standard must support explainability.

A compliant implementation should ultimately be capable of answering questions such as:

- Why is this system not ready?
- What is preventing energization?
- What evidence supports this completion assertion?
- Which deficiencies prevent progression?
- What is required to achieve the next state?
- Which systems are dependent upon this system?
- What evidence supports the Readiness Recommendation?
- If this stage-gate supports Level 1 governance, what Outcome Evidence Need applies, what did the Outcome Auditor conclude, and what did the Outcome Director decide?
- What changed since the previous readiness assessment?

---

# v0.1 Scope

Keep OCRS v0.1 deliberately small.

The first milestone is:

> **Represent and evaluate one Level 2 commissioning stage-gate from structured evidence and preserve its optional interface to Level 1 Outcome Assurance.**

Use **Ready for Dynamic Commissioning (RFDC)** as the initial canonical Commissioning Stage-Gate profile. Do not relabel RFDC as an Operational Readiness gate or as Outcome Authorization.

The v0.1 reference case should demonstrate:

- project;
- system;
- subsystem;
- equipment/tag;
- requirement;
- readiness condition;
- Outcome Obligation;
- Outcome Requirement;
- Outcome Evidence Need;
- activity/test;
- evidence;
- deficiency;
- constraint;
- dependency;
- system and test boundary;
- Commissioning Stage-Gate;
- Readiness Review;
- Readiness Recommendation;
- Outcome Auditor evaluation;
- residual risk declaration and acceptance;
- outcome stage-gate and Outcome Authorization, where the reference profile expressly maps RFDC to Level 1 governance;
- responsible party.

The core ontology shall also be capable of representing the ICxA Operational Readiness APR lifecycle, the People, Organization, Asset, and Systems & Processes capability pillars, and the ORC, AOCR, IOC, and FOC readiness decision gates through future profiles. Do not implement those profiles in v0.1. Transfer of Operational Control shall be representable as distinct from System Handover and, under the Operational Readiness profile, shall occur only following the documented AOCR or equivalent readiness decision.

Do not attempt to model every possible commissioning or operational-readiness scenario in v0.1.

---

# Repository Structure

Create the repository approximately as follows:

```text
ocrs/
├── README.md
├── GOVERNANCE.md
├── CONTRIBUTING.md
├── LICENSE
├── CHANGELOG.md
├── CODE_OF_CONDUCT.md
│
├── specification/
│   ├── 00-introduction.md
│   ├── 01-scope.md
│   ├── 02-design-principles.md
│   ├── 03-terminology.md
│   ├── 04-ontology.md
│   ├── 05-state-model.md
│   ├── 06-outcome-governance-model.md
│   ├── 07-requirements-and-readiness-conditions.md
│   ├── 08-evidence-model.md
│   ├── 09-deficiency-constraint-and-risk-model.md
│   ├── 10-dependency-and-boundary-model.md
│   ├── 11-level-2-stage-gate-model.md
│   ├── 12-level-1-authorization-model.md
│   ├── 13-conformance.md
│   └── 14-extension-and-profile-model.md
│
├── schemas/
│   ├── project.schema.json
│   ├── system.schema.json
│   ├── asset.schema.json
│   ├── system-boundary.schema.json
│   ├── outcome-obligation.schema.json
│   ├── outcome-requirement.schema.json
│   ├── outcome-evidence-need.schema.json
│   ├── execution-requirement.schema.json
│   ├── readiness-condition.schema.json
│   ├── activity.schema.json
│   ├── evidence.schema.json
│   ├── deficiency.schema.json
│   ├── constraint.schema.json
│   ├── dependency.schema.json
│   ├── residual-risk.schema.json
│   ├── stage-gate.schema.json
│   ├── readiness-review.schema.json
│   ├── readiness-recommendation.schema.json
│   ├── evidence-evaluation.schema.json
│   ├── outcome-authorization.schema.json
│   ├── party.schema.json
│   ├── role-assignment.schema.json
│   ├── profile.schema.json
│   └── ocrs-package.schema.json
│
├── examples/
│   └── rfdc-reference-project/
│       ├── project.json
│       ├── systems.json
│       ├── boundaries.json
│       ├── execution-requirements.json
│       ├── readiness-conditions.json
│       ├── outcome-governance.json
│       ├── activities.json
│       ├── evidence.json
│       ├── deficiencies.json
│       ├── constraints.json
│       ├── dependencies.json
│       ├── readiness-review.json
│       ├── readiness-recommendation.json
│       ├── outcome-auditor-evaluation.json
│       ├── outcome-authorization.json
│       └── README.md
│
├── conformance/
│   ├── README.md
│   ├── valid/
│   ├── invalid/
│   └── expected-results/
│
└── docs/
    ├── architecture.md
    ├── implementation-guide.md
    └── extension-guide.md

```

Modify this structure where technically justified, but preserve the conceptual separation.

---

# Governance Model

Create `GOVERNANCE.md`.

It must establish:

## Stewardship

ICxA is the steward of OCRS.

ICxA controls:

- the official OCRS specification;
- official OCRS namespaces;
- official version numbering;
- publication of normative releases;
- definition of mandatory conformance requirements;
- approval of changes to the core specification;
- use of official OCRS certification marks, if introduced later.

OCRS stewardship shall not alter the authority model defined by the ICxA Standards. In particular, technical schema validation or deterministic evaluation shall not be represented as independent Outcome Auditor evaluation, professional judgment by an Outcome Director, acceptance of residual risk, or Outcome Authorization.

## Open Implementation

ICxA does not control:

- who may implement OCRS;
- which software may support OCRS;
- whether an implementation is open-source or commercial;
- which programming language is used;
- which database is used;
- which AI system is used;
- which workflow architecture is used.

A vendor must not require permission from ICxA simply to implement the published specification.

## Conformance

Separate:

**OCRS-compatible implementation**

from

**ICxA-certified OCRS implementation**

The first should be technically possible without commercial permission.

The second may later require independent verification against ICxA conformance requirements.

Do not build the certification commercial model in v0.1, but preserve the distinction.

Do not permit an implementation to claim conformity with an ICxA standard merely because it conforms to an OCRS schema. Claims of ICxA standards conformity require demonstrated implementation of all applicable requirements within the declared boundary. OCRS may preserve and exchange conformity evidence; it does not itself certify the underlying organization, project, system, or decision.

---

# Licensing

Research and recommend an appropriate licensing structure before selecting final licenses.

The intended model is:

### Specification

The specification should be publicly readable, reusable, and implementable while preserving ICxA stewardship and attribution.

### Code and Reference Material

Reference code, schemas, test utilities, and examples should use a recognized permissive open-source license where appropriate.

Do not select a license merely because it is popular.

Document the reasoning and flag any legal questions requiring review by ICxA counsel.

Do not make legal claims that have not been verified.

---

# ICxA Alignment Baseline

Create `specification/icxa-alignment.md` and a machine-readable `profiles/icxa/profile-manifest.json`.

For v0.1, review and declare alignment against the current controlled editions of:

- ICXA-10000, *Outcome Assurance — Fundamentals*;
- ICXA-10001, *Outcome Assurance — Requirements*;
- ICXA-10002, *Outcome Assurance — Evidence Requirements*;
- ICXA-20100, *Commissioning & Outcome Execution — Concepts, Principles, and Model*;
- ICXA-20101, *Commissioning & Outcome Execution — Requirements*;
- ICXA-20102, *Commissioning & Outcome Execution — Vocabulary*;
- ICXA-20200, *Operational Readiness — Concepts and Principles*;
- ICXA-20201, *Operational Readiness — Requirements*; and
- ICXA-20202, *Operational Readiness — Vocabulary*.

Use ICXA-10003, ICXA-20103, and ICXA-20203 as informative guidance only. Do not convert guidance examples into mandatory OCRS conformance requirements unless the governing ICxA requirements standard makes them mandatory.

The profile manifest shall record document number, title, edition or year, revision, publication date, normative or informative status, and the OCRS profile version. If the controlled ICxA source changes, do not silently change the meaning of an existing OCRS profile. Issue a new profile version and document the mapping and compatibility impact.

Create a clause-to-model traceability matrix showing, at minimum:

- the ICxA requirement or controlled term;
- the OCRS entity, property, validation rule, or conformance test that represents it;
- whether the mapping is full, partial, informative, or not applicable to v0.1;
- any loss of meaning or professional judgment that cannot be encoded deterministically; and
- the evidence required to verify the mapping.

OCRS shall represent the standards; it shall not weaken, reinterpret, or replace their governance requirements. Where the generic OCRS core and an official ICxA profile differ, the official ICxA profile controls claims of ICxA profile conformance.

---

# Namespace and Versioning

Establish a stable OCRS namespace strategy.

Design for:

- semantic versioning;
- backward compatibility where practical;
- explicit schema versions;
- future namespaces;
- extension namespaces;
- project-specific extensions.

Example conceptual identifier:

`ocrs:requirement:REQ-001`

Do not hard-code a specific URI architecture unless justified.

Version v0.1 should clearly be marked as:

**Draft / Experimental / Not Yet Stable**

Do not imply production maturity.

---

# Core Ontology

Begin with these concepts:

## Outcome Assurance Case

The controlled record, or controlled set of linked records, that preserves the traceable basis for outcome audit, authorization, acceptance, and handover across the lifecycle.

OCRS shall be capable of linking the Outcome Obligation, Outcome Requirements, System Breakdown Structure, outcome stage-gates, Outcome Evidence Need, Outcome Evidence, Outcome Auditor evaluations, authorization and non-authorization decisions, residual risks, conditions, acceptance basis, handover basis, and changes affecting the outcome basis.

## Outcome Obligation

The documented business, operational, regulatory, stakeholder, and other conditions that define why authorization is required and what the outcome is intended to achieve.

## Outcome Requirement

A requirement derived from the Outcome Obligation and used to define the conditions the governed outcome must satisfy.

Keep Outcome Requirements separate from Level 2 execution requirements and readiness conditions. A Level 2 record may provide evidence against an Outcome Requirement, but the terms are not interchangeable.

## Outcome Evidence Need

The evidence need determined for a specific outcome stage-gate under the ICxA Outcome Assurance process. OCRS shall represent the applicable OEN, its version, scope, consequence basis, evidence categories, sufficiency criteria, and linkage to the relevant outcome, systems, interfaces, and stage-gate.

## Project

Container representing the overall project context.

Project status shall not override or roll up system-specific readiness or authorization conclusions where evidence, audit, readiness, or residual-risk status differs.

## System Breakdown Structure

A controlled hierarchical structure defining systems, subsystems, interfaces, boundaries, and system groupings used for readiness, evidence traceability, stage-gates, handover, and authorization.

The SBS shall be established early, version controlled, and capable of using ISO/IEC 81346-aligned reference designations. OCRS shall distinguish the SBS from a work breakdown structure, equipment list, document register, and organizational hierarchy.

## System

A functional grouping that performs a defined project or operational function and is traceable to the applicable SBS element and reference designation.

## System Boundary

The defined physical, functional, organizational, or control limit of a system, subsystem, package, area, or asset. OCRS shall distinguish system boundaries, test boundaries, readiness boundaries, handover boundaries, and outcome-authorization boundaries while preserving mappings between them.

## Asset

A physical or logical asset.

Allow hierarchical relationships where necessary.

## Execution Requirement

A Level 2 delivery, verification, testing, commissioning, handover, or readiness requirement that can generate evidence.

Requirements must be separate from evidence.

A requirement must not become "true" simply because somebody manually changes its status.

## Readiness Condition

A documented condition that shall be satisfied, formally dispositioned, or otherwise treated in accordance with the governing profile before a Level 2 stage-gate or readiness decision.

## Activity

An inspection, verification, test, commissioning activity, review, or other action capable of producing evidence.

## Evidence

An immutable or revision-controlled artifact supporting an assertion.

Evidence should include:

- identifier;
- evidence type;
- source;
- creator;
- responsible party;
- creation date;
- revision;
- approval status;
- applicable requirements;
- applicable asset/system;
- validity;
- supersession relationship;
- provenance;
- optional external document reference;
- optional hash/checksum.

Evidence shall also identify its evidence class, authoritative source, applicable system or boundary, applicable requirement or readiness condition, status, review state, currency at the decision point, and whether it is generated through Commissioning & Outcome Execution, Operational Readiness, another delivery process, or an external authority.

OCRS shall distinguish Level 2 Commissioning Evidence and Operational Readiness Evidence from Level 1 Outcome Evidence. Level 2 evidence may become Outcome Evidence when it is required by the applicable OEN and included in the Outcome Assurance process; its existence alone does not establish sufficiency.

Do not store large binary files directly inside OCRS packages unless necessary.

Support references to externally managed evidence repositories.

## Deficiency

A controlled finding, non-conformance, incomplete work, missing record, failed verification, unresolved condition, or other gap that may affect readiness, safety, operability, system integrity, handover, Transfer of Operational Control, stage-gate progression, or evidence records.

Use the controlled ICxA Category A/B/C/D model:

- **Category A:** prevents the applicable stage-gate because it affects a required readiness condition, including safety, regulatory compliance, environmental protection, operability, system integrity, or required functionality.
- **Category B:** does not prevent the current Commissioning Stage-Gate but is controlled for closure before a later defined stage-gate, readiness point, energization, Start-Up, System Handover, or Transfer of Operational Control, unless formally reclassified or accepted through the applicable readiness and risk process.
- **Category C:** does not prevent the applicable stage-gate and may be controlled for closure after progression only when formally accepted, assigned, risk-assessed, and included in an approved closure plan.
- **Category D:** requires disposition because it is disputed, outside defined scope, outside funding responsibility, outside closure authority, or requires reclassification before it can be treated as Category A, B, or C.

Risk descriptors such as critical, high, medium, or low may supplement but shall not replace Category A/B/C/D classification. Category, severity, safety significance, evidence impact, owner, due date, disposition, reclassification history, closure evidence, and affected current and future gates shall be modeled separately.

## Constraint

A condition that restricts or prevents progression even where it may not represent defective work.

Examples could include:

- unavailable utility;
- missing operator;
- incomplete procedure;
- permit unavailable;
- upstream system unavailable.

Keep deficiency and constraint semantically distinct.

A constraint shall not be used to avoid recording a Deficiency where an applicable requirement has not been satisfied. Conversely, an external dependency or unavailable prerequisite is not automatically a Deficiency.

## Dependency

A relationship whereby readiness of one object depends upon another object or condition.

## State

The current evidenced condition of an object.

Do not confuse state with percentage progress.

## Commissioning Stage-Gate

A Level 2 field-execution decision point used to confirm that readiness prerequisites, evidence, safety controls, Deficiency classification, boundaries, interface conditions, and transfer conditions are complete or dispositioned before progression. A Commissioning Stage-Gate may provide evidence for a Level 1 outcome stage-gate but does not by itself constitute Outcome Authorization.

## Operational Readiness Decision Gate

A Level 2 readiness decision point established through the Readiness Charter and Operational Readiness Plan. The core model shall support ORC, AOCR, IOC, and FOC profiles, including entry criteria, mandatory evidence categories, residual-risk declaration requirements, decision authority, hold criteria, and controlled decision records.

## Readiness Review

A structured Level 2 review of the defined boundary, evidence, safety controls, Deficiency status, dependencies, constraints, interfaces, and transfer conditions before stage-gate progression.

## Readiness Recommendation

The controlled Level 2 output of a Commissioning Readiness Review: proceed, proceed with documented conditions, or not supported pending corrective action. It may be submitted into Level 1 governance, but does not constitute Outcome Authorization.

Operational Readiness decisions shall be modeled separately using controlled decision outcomes such as ready, conditionally ready, or hold, together with the decision authority, residual-risk declaration, conditions, and decision record.

## Outcome Stage-Gate

A Level 1 decision point corresponding to a specific outcome state at which the Outcome Director may authorize, not authorize, defer, restrict, suspend, or reverse an outcome on the basis of evidence, the Outcome Auditor evaluation, residual risk, and professional judgment.

## Outcome Auditor Evaluation

The independent Level 1 evaluation of whether available Outcome Evidence satisfies the applicable OEN and is sufficient, credible, and relevant to support an authorization decision. OCRS may store the result and basis; deterministic software shall not impersonate or silently generate this professional evaluation.

## Outcome Authorization

A deliberate Level 1 decision made by the designated Outcome Director, based on evidence evaluation and professional judgment, to accept the residual risk associated with a specific outcome state and permit progression to that state.

Keep:

**deterministic criteria evaluation and Level 2 readiness decisions**

separate from

**Outcome Auditor evaluation, residual-risk acceptance, and Outcome Authorization**.

A software system may determine that encoded criteria appear satisfied and may produce a deterministic evaluation result.

That does not constitute the Outcome Auditor's independent sufficiency evaluation, the Outcome Director's acceptance of residual risk, or Outcome Authorization.

This separation is critical.

## Party

Person, organization, role, or authority associated with creation, verification, acceptance, or authorization.

Model the role assignment separately from the party. At minimum, support Level 2 Execution Evidence Owner, Readiness Reviewer or decision authority, Outcome Auditor, Outcome Director, Delivery Party, and Receiving Organization. Preserve competence, independence, delegation, co-signature, validity period, and authority boundary where applicable.

---

# State Model

Do not define an excessively rigid universal lifecycle in v0.1.

Create a generic mechanism for defining states and permitted transitions, with controlled ICxA profiles layered on the generic core.

Provide the ICxA Commissioning & Outcome Execution profile using the controlled sequence and terms applicable to the reference scope, for example:

```text
Not Started
↓
Construction Completion (CC)
↓
Static Commissioning
↓
Ready for Dynamic Commissioning
↓
Dynamic Commissioning
↓
Ready for Start-up
↓
Start-Up
↓
Performance Verification, where applicable
↓
Trial Operation, where applicable
↓
System Handover
↓
Transfer of Operational Control, when the applicable readiness and transfer decisions are expressly made and recorded

```

Do not use **Installed**, **Static Complete**, **Accepted**, **Project Complete**, or similar ambiguous statuses as substitutes for controlled ICxA stage-gates or decisions. Represent activities, evidenced states, stage-gates, handover, and Transfer of Operational Control as distinct concepts.

For future Operational Readiness profiles, preserve the APR lifecycle of Awareness, Preparedness, Readiness, and Ramp-up/Stabilization and the People, Organization, Asset, and Systems & Processes capability pillars. Do not force APR into the Commissioning Stage-Gate sequence.

Every state transition should be capable of having:

- prerequisites;
- applicable requirements;
- evidence requirements;
- Category A/B/C/D Deficiency rules, including current-gate effect and required future closure point;
- constraint rules;
- dependency rules;
- approval or authorization requirements.

Do not allow arbitrary transitions that bypass required predecessor states unless the applicable controlled profile explicitly permits them and the deviation, rationale, evidence, residual risk, and authorization basis are traceable.

---

# Evidence-First Logic

OCRS must distinguish between:

1. assertion;
2. Level 2 evidence;
3. deterministic criteria evaluation;
4. Readiness Review;
5. Readiness Recommendation or readiness decision;
6. applicable Outcome Evidence Need;
7. Outcome Auditor evaluation;
8. residual-risk acceptance; and
9. Outcome Authorization.

Example:

An implementation must not simply store:

```json
{
  "system": "SYS-042",
  "rfdc": true
}

```

Instead the model should support logic approximately equivalent to:

```json
{
  "commissioningStageGate": "RFDC",
  "subject": "SYS-042",
  "readinessConditions": [
    {
      "requirement": "REQ-001",
      "evaluation": "satisfied",
      "supportingEvidence": [
        "EV-104",
        "EV-105"
      ]
    },
    {
      "requirement": "REQ-002",
      "evaluation": "not_satisfied",
      "blockingItems": [
        "DEF-017"
      ]
    }
  ],
  "deterministicEvaluation": "not_satisfied",
  "readinessRecommendation": "not_supported",
  "level1OutcomeStageGate": null,
  "outcomeAuthorization": null
}

```

Treat this only as an illustrative structure.

Develop a cleaner normalized model in the actual schemas.

---

# Level 2 Deterministic Criteria Evaluation

Create a deterministic reference criteria-evaluation model for the Level 2 RFDC Commissioning Stage-Gate.

For OCRS v0.1, demonstrate:

**RFDC for one system**

Example criteria:

- Construction Completion for the defined boundary confirmed;
- required A-ITRs and construction records accepted;
- required static tests complete;
- applicable B-ITRs, static commissioning records, and test evidence accepted;
- system and test boundaries confirmed and mapped;
- required safety and Control of Work prerequisites satisfied;
- upstream dependencies satisfied;
- no open Category A Deficiencies affecting RFDC;
- Category B and C Deficiencies controlled in accordance with their defined closure points;
- Category D items dispositioned or classified before they can affect the decision;
- no blocking constraints.

Deterministic criteria evaluation should produce:

- satisfied;
- not satisfied;
- indeterminate.

Use `indeterminate` when the information needed to determine a criterion is missing, stale, ambiguous, or not authoritative. Use `not_satisfied` where available evidence affirmatively demonstrates that a criterion has not been met. Do not collapse these two conditions.

Do not interpret missing evidence as successful completion.

This is a core safety and assurance principle:

> **Absence of evidence is not evidence of readiness.**

The evaluator shall then support—but not silently issue—a controlled Readiness Recommendation of:

- proceed;
- proceed with documented conditions; or
- not supported pending corrective action.

The recommendation shall identify the Level 2 Execution Evidence Owner, reviewer, decision date, defined boundary, evidence reviewed, open Deficiencies, constraints, dependencies, conditions, residual-risk inputs, and rationale.

---

# Level 1 Outcome Assurance Interface and Authorization

Outcome Authorization must be modeled separately from deterministic criteria evaluation, Readiness Review, and Readiness Recommendation.

For example:

```text
RFDC Deterministic Evaluation: SATISFIED
Readiness Recommendation: PROCEED

Outcome Auditor Evaluation: PENDING
Outcome Authorization: NOT YET DECIDED

```

or:

```text
RFDC Deterministic Evaluation: SATISFIED
Readiness Recommendation: PROCEED
Applicable Outcome Evidence Need: OEN-RFDC-001
Outcome Auditor Evaluation: EVIDENCE SUFFICIENT

Outcome Authorization: AUTHORIZED
Outcome Director: ROLE-OD-001
Residual Risk Accepted: RR-001
Timestamp: ...

```

The second example is permitted only where the project has expressly established a Level 1 outcome stage-gate corresponding to the specific outcome state and mapped the RFDC evidence package to its OEN.

Preserve the full audit trail, including non-authorization, deferral, restriction, suspension, and reversal decisions.

Never overwrite historical authorization records.

Each Outcome Authorization record shall identify the governed outcome and stage-gate, system or boundary, applicable OEN, evidence evaluated, Outcome Auditor evaluation, residual risks accepted or rejected, Outcome Director, date, conditions, limitations, constraints, exceptions, acceptance basis, and handover basis where applicable.

---

# Explainability

Every derived readiness conclusion must be traceable.

An implementation should be able to return an explanation tree such as:

```text
SYS-042
└── RFDC DETERMINISTIC EVALUATION: NOT SATISFIED
    ├── RC-001: SATISFIED
    │   ├── EV-104
    │   └── EV-105
    └── RC-002: NOT SATISFIED
        └── DEF-017: CATEGORY A

READINESS RECOMMENDATION: NOT SUPPORTED
LEVEL 1 OUTCOME STAGE-GATE: NOT ESTABLISHED FOR THIS EXAMPLE
OUTCOME AUTHORIZATION: NOT APPLICABLE

```

Design the underlying data model so an explanation like this can be generated without relying on AI.

AI may later summarize or interrogate the graph, but the truth model itself must remain deterministic and inspectable.

---

# Provenance and Auditability

Design for strong provenance.

Records should support, as appropriate:

- created at;
- created by;
- modified at;
- modified by;
- source system;
- revision;
- supersedes;
- superseded by;
- approval;
- verification;
- digital hash;
- external evidence reference.

Records affecting the governed outcome basis shall support a controlled change record, including changes to the Outcome Obligation, Outcome Requirements, OEN, stage-gate conditions, authorization basis, residual risk, acceptance or handover conditions, SBS, boundaries, interfaces, operational-readiness assumptions, temporary changes, overrides, bypasses, deviations, and temporary operating modes.

Do not make OCRS dependent upon blockchain or any other particular immutability technology.

---

# Extension Mechanism

Projects and industries will require additional information.

Create a controlled extension mechanism.

The core OCRS schemas must therefore:

- remain relatively small;
- allow namespace-qualified extensions;
- prevent project-specific fields from corrupting the core model;
- permit industry profiles;
- permit organization profiles;
- permit project profiles.

Example future profiles might include:

- power transmission;
- oil and gas;
- LNG;
- mining;
- data centres;
- nuclear;
- infrastructure.

Do not create these profiles now.

Design only the extension mechanism.

Reserve profile identifiers for controlled ICxA profiles, including Commissioning & Outcome Execution, Operational Readiness, and Outcome Assurance. A project or vendor extension shall not use the ICxA namespace or redefine the meaning, authority, or decision rights of a controlled ICxA concept.

The extension mechanism shall allow an implementation to declare:

- the OCRS core version;
- the ICxA profile name and version;
- the exact ICxA standard editions and revisions used;
- project or industry extensions;
- controlled term mappings and aliases;
- deviations or tailoring, with justification; and
- whether the package claims only OCRS technical conformance or also supplies evidence for a separate ICxA conformity assessment.

---

# API Independence

OCRS v0.1 is primarily a data and semantic standard.

Do not make REST, GraphQL, MCP, event streaming, or any other interface mandatory.

However, structure identifiers and schemas so future API specifications can be developed cleanly.

A future OCRS API standard should be possible without redesigning the ontology.

---

# AI and Agent Independence

AI must not be required for OCRS conformance.

An OCRS dataset must remain interpretable and evaluable using conventional deterministic software.

Document explicitly:

> OCRS defines lifecycle completion, commissioning, readiness, and outcome-governance information independently of the computational architecture used to create, evaluate, or consume that information.

AI systems may:

- query OCRS;
- identify missing information;
- assemble evidence;
- detect inconsistencies;
- predict risks;
- summarize readiness;
- propose actions.

AI systems must not silently modify authoritative evidence or authorization records.

Agent behavior is outside the normative scope of OCRS v0.1.

---

# Canonical Reference Project

Create one small fictional reference project.

Use something technically realistic but deliberately small.

Suggested system:

**Cooling Water Pump System CW-101**

Include approximately:

- 1 system;
- 2–3 subsystems;
- 5–10 tags/assets;
- 8–15 requirements;
- 5–10 activities/tests;
- 10–20 evidence records;
- several dependencies;
- 2–4 deficiencies;
- at least one constraint;
- one RFDC gate.

Create two scenarios.

## Scenario A — Not Ready

RFDC must fail because:

- one Category A Deficiency remains open;
- one required test lacks accepted evidence.

The system should distinguish the known unsatisfied readiness condition from the indeterminate condition caused by missing accepted evidence and explain both causes. The Readiness Recommendation shall be `not_supported`.

## Scenario B — Ready

Provide the missing evidence and close the Category A Deficiency with traceable closure evidence.

RFDC evaluation should then become satisfied.

The Readiness Review should then support a controlled recommendation to proceed.

Demonstrate the Level 1 boundary in one of two explicit ways:

1. **Default reference case:** no Level 1 outcome stage-gate is established for RFDC; Outcome Auditor evaluation and Outcome Authorization are `not_applicable`, not `pending` or `authorized`.
2. **Optional mapped case:** establish a separate Level 1 outcome stage-gate, Outcome Obligation, Outcome Requirements, and OEN; submit the RFDC evidence package; record an independent Outcome Auditor evaluation; then record the Outcome Director's separate authorization or non-authorization decision and residual-risk acceptance basis.

This reference project becomes the canonical OCRS v0.1 conformance example.

---

# JSON Schema Requirements

Use current stable JSON Schema conventions.

Schemas should be:

- human-readable;
- modular;
- strongly typed where appropriate;
- documented;
- reusable;
- validated automatically.

Avoid premature complexity.

Avoid deeply nested structures where normalized references are more maintainable.

Use globally unique or namespace-compatible identifiers.

Where appropriate use enumerations, but avoid creating rigid enumerations where extension will be required.

---

# Validation and Testing

Add automated validation.

The repository should be able to execute a command that:

1. validates all schemas;
2. validates all valid examples;
3. confirms intentionally invalid examples fail;
4. evaluates the canonical RFDC gate;
5. compares the evaluation result against expected results.

A failure in any of these should fail CI.

Set up GitHub Actions or equivalent CI configuration.

The project must be reproducible by another developer after cloning the repository.

---

# Conformance Levels

Design but do not overcomplicate initial conformance.

Consider:

### OCRS Data Conformant

Data conforms to required OCRS schemas.

### OCRS Exchange Conformant

Implementation can import/export OCRS data without semantic loss.

### OCRS Evaluation Conformant

Implementation produces expected results from normative gate-evaluation test cases.

### OCRS ICxA Profile Conformant

Data and behavior conform to the declared OCRS representation profile for a named ICxA standard suite, edition, and revision. This is a technical interoperability claim only. It shall not be represented as certification that an organization, project, system, readiness decision, Outcome Auditor evaluation, or Outcome Authorization conforms to the underlying ICxA Standards.

Do not implement a commercial certification process.

Document how these technical conformance categories could support later ICxA certification.

---

# Normative vs Informative Content

Clearly distinguish:

**Normative**
requirements necessary for OCRS conformance.

**Informative**
examples, explanations, diagrams, implementation suggestions, and guidance.

Use RFC-style terminology where useful:

- MUST;
- MUST NOT;
- SHOULD;
- SHOULD NOT;
- MAY.

Define these terms.

Avoid using mandatory language casually.

---

# Documentation

The main README must explain OCRS in plain language.

A new reader should understand within approximately two minutes:

1. what OCRS is;
2. why it exists;
3. what problem it solves;
4. what OCRS does not attempt to do;
5. how ICxA governs it;
6. why implementation remains open;
7. how to inspect the reference example;
8. how to validate an implementation.

Include this key concept:

> **OCRS does not determine readiness by percentage complete. It provides a structured model linking readiness assertions to requirements, evidence, dependencies, deficiencies, gates, and authorization.**

Also include:

> **OCRS preserves the distinction between Level 2 readiness and Level 1 Outcome Authorization. A deterministic evaluation or Readiness Recommendation does not accept residual risk and does not authorize an outcome.**

---

# Diagrams

Create Mermaid diagrams where helpful.

At minimum include:

## Semantic relationship

```text
Outcome Obligation
  ↓
Outcome Requirements
  ↓
Outcome Evidence Need
  ↓
Outcome Evidence
  ↓
Outcome Auditor Evaluation
  ↓
Outcome Director Authorization

Level 2 evidence chain:

System / Boundary
  ↓
Execution Requirement / Readiness Condition
  ↓
Activity / Verification / Test
  ↓
Controlled Evidence
  ↓
Readiness Review
  ↓
Readiness Recommendation / Readiness Decision

```

Also show Deficiencies, constraints, dependencies, and residual-risk inputs interacting with deterministic criteria evaluation and the Readiness Review, while preserving the separate Level 1 authority path.

## Architectural separation

```text
ICxA Level 1 Outcome Assurance
      ↑ evidence and recommendation interface
ICxA Level 2 Cx & OR
      ↓ digital representation
OCRS Core + Versioned ICxA Profiles
      ↓
Implementations
      ↓
Applications / APIs / AI / Agents

```

Do not make the diagram imply that AI is required.

---

# Important Constraints

Do NOT:

- build a SaaS application;
- build a dashboard;
- build a mobile app;
- create a Procore clone;
- create a completion-management UI;
- choose an agent framework;
- choose an LLM;
- optimize for OpenClaw or another current agent system;
- create blockchain architecture;
- over-engineer microservices;
- create proprietary dependencies;
- require ICxA permission to implement OCRS;
- encode commercial licensing into the technical standard;
- conflate gate satisfaction with authorization;
- conflate a Level 2 Commissioning Stage-Gate or Operational Readiness decision gate with a Level 1 outcome stage-gate;
- represent a Readiness Review, Readiness Recommendation, certificate, technical approval, readiness decision, System Handover, or Transfer of Operational Control as Outcome Authorization unless expressly governed under the applicable Level 1 process;
- allow software to impersonate the Outcome Auditor or Outcome Director;
- treat project-level roll-up status as authorization of systems or interfaces whose evidence, readiness, audit, or residual-risk status differs;
- use severity labels in place of the controlled Category A/B/C/D Deficiency classification;
- use physical completion as evidence of Operational Readiness across the People, Organization, Asset, and Systems & Processes pillars;
- conflate progress percentage with readiness;
- treat missing evidence as successful completion.

---

# Development Approach

Work iteratively.

## Phase 1

Create:

- repository structure;
- README;
- governance model;
- design principles;
- core terminology;
- initial ontology;
- declared ICxA standard baseline and versioned alignment profile;
- Level 1/Level 2 authority-boundary model.

Do not proceed to substantial implementation until the ontology is internally coherent.

## Phase 2

Create:

- JSON schemas;
- identifiers;
- reference relationships;
- extension mechanism;
- controlled ICxA profile declarations and project/vendor namespace rules.

## Phase 3

Create:

- canonical reference project;
- RFDC criteria;
- valid and invalid scenarios;
- Readiness Review and Readiness Recommendation records;
- default no-Level-1-mapping case and optional expressly mapped Level 1 case.

## Phase 4

Create:

- deterministic gate evaluator;
- validation tooling;
- conformance tests;
- CI.

## Phase 5

Review the architecture for:

- unnecessary coupling;
- vendor assumptions;
- AI assumptions;
- ambiguity;
- inability to represent provenance;
- inability to explain readiness;
- inability to extend the model;
- collapse of Level 2 readiness into Level 1 authorization;
- loss of system, test, readiness, handover, or authorization boundary distinctions;
- loss of Outcome Auditor independence or Outcome Director accountability.

Refactor before calling the repository OCRS v0.1.

---

# Required Design Reviews

Before considering v0.1 complete, explicitly answer these questions in `docs/architecture.md`:

1. Can OCRS represent why a system is not ready?
2. Can OCRS identify missing evidence?
3. Can OCRS distinguish missing evidence from failed evidence?
4. Can OCRS distinguish a deficiency from a constraint?
5. Can OCRS represent dependencies between systems?
6. Can OCRS distinguish deterministic criteria evaluation and a Level 2 readiness decision from Outcome Auditor evaluation and Outcome Authorization?
7. Can OCRS preserve evidence provenance?
8. Can OCRS represent superseded evidence?
9. Can two independent implementations exchange the same OCRS package without losing meaning?
10. Can OCRS work without AI?
11. Can an AI agent interrogate OCRS without OCRS depending on that agent?
12. Can project-specific extensions be added without modifying core schemas?
13. Can ICxA issue a future OCRS v0.2 without breaking every v0.1 implementation?
14. Can a commercial vendor implement OCRS without needing access to proprietary ICxA software?
15. Does ICxA retain clear stewardship over what officially constitutes OCRS?
16. Can OCRS distinguish an Outcome Obligation, Outcome Requirement, execution requirement, and readiness condition?
17. Can OCRS distinguish a Commissioning Stage-Gate, Operational Readiness decision gate, and Level 1 outcome stage-gate?
18. Can OCRS distinguish deterministic criteria evaluation, Readiness Recommendation, Outcome Auditor evaluation, and Outcome Authorization?
19. Can OCRS preserve system-specific progression without implying that a project-level roll-up authorizes every system and interface?
20. Can OCRS represent Category A/B/C/D Deficiencies, reclassification history, current-gate effect, and required future closure point?
21. Can OCRS distinguish System Handover from Transfer of Operational Control?
22. Can OCRS represent ORC, AOCR, IOC, and FOC and the People, Organization, Asset, and Systems & Processes pillars through a future Operational Readiness profile without redesigning the core?
23. Can OCRS record non-authorization, deferral, conditional decisions, restriction, suspension, and reversal without overwriting history?

If any answer is no, document the architectural problem and correct it where practical before finalizing v0.1.

---

# Definition of Done for OCRS v0.1

OCRS v0.1 is complete when:

- the core ontology is documented;
- normative terminology is defined;
- core JSON schemas validate;
- the canonical example validates;
- the not-ready RFDC example evaluates correctly;
- the ready RFDC example evaluates correctly;
- the RFDC example issues the correct controlled Readiness Recommendation;
- RFDC remains explicitly represented as a Level 2 Commissioning Stage-Gate;
- Outcome Auditor evaluation and Outcome Authorization remain independently represented and are `not_applicable` unless a Level 1 outcome stage-gate and OEN are expressly established;
- the optional mapped case preserves independent Outcome Auditor evaluation, Outcome Director accountability, and explicit residual-risk acceptance;
- Category A/B/C/D Deficiency semantics are preserved;
- the SBS, system boundary, test boundary, and decision boundary remain traceable;
- provenance is preserved;
- extension mechanisms are documented;
- conformance tests run automatically;
- another developer can clone the repository and execute the tests;
- the specification is demonstrably independent of any software vendor or AI architecture;
- ICxA stewardship is clearly documented;
- unrestricted third-party implementation is clearly supported.

Do not expand scope beyond this milestone unless necessary to correct a foundational architectural issue.

---

# Working Method

When making architecture decisions:

1. prefer semantic clarity over feature count;
2. prefer open standards over implementation assumptions;
3. prefer explicit relationships over implicit workflow logic;
4. prefer evidence provenance over manually assigned status;
5. prefer deterministic evaluation over opaque inference;
6. preserve independent professional evidence evaluation and accountable Outcome Director authorization where Level 1 governance applies;
7. preserve the distinction between a readiness decision and Outcome Authorization;
8. preserve system-level and interface-level progression where readiness differs;
9. avoid designing for today's AI architecture;
10. document important decisions using Architecture Decision Records where appropriate.

If an issue materially affects the long-term standard architecture, document the alternatives and recommendation before implementing it.

The objective is not to create completions software.

The objective is to create the **open machine-readable language through which lifecycle completion, commissioning, Operational Readiness, and Outcome Assurance information can be represented, exchanged, evaluated, and independently verified without changing the authority of the underlying ICxA processes.**
