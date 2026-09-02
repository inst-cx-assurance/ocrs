# Initial Ontology

This chapter defines the initial OCRS ontology for v0.1. It is intentionally compact and intended to support a single commissioning stage-gate profile while preserving future extensibility.

## 1. Primary entities

The v0.1 ontology includes the following primary classes:

- Project
- System
- Subsystem
- Asset / Equipment / Tag
- Boundary
- Requirement
- Readiness Condition
- Outcome Obligation
- Outcome Requirement
- Outcome Evidence Need
- Activity
- Evidence
- Deficiency
- Constraint
- Dependency
- Stage-Gate
- Readiness Review
- Readiness Recommendation
- Readiness Decision
- Outcome Auditor Evaluation
- Residual Risk
- Outcome Authorization
- Party
- Role Assignment
- Profile

## 2. Relationship model

The core relationships include:

- project contains systems and subsystems;
- system has boundaries and assets;
- requirement applies to a system, subsystem, asset, or boundary;
- readiness condition is satisfied or dispositioned by evidence and review;
- outcome obligation leads to outcome requirement and evidence need;
- evidence supports a requirement, readiness condition, or outcome evidence need;
- deficiency and constraint affect readiness or outcome sufficiency;
- dependency governs sequencing, readiness, or handover;
- stage-gate is assessed through readiness review and recommendation;
- recommendation may support a readiness decision; and
- an optional Level 1 link may connect stage-gate evidence to an applicable Outcome Evidence Need and Outcome Authorization.

## 3. Phase 1 model constraints

The Phase 1 ontology must:

- preserve the distinction between Level 1 and Level 2 record types;
- support a single RFDC stage-gate as the canonical example;
- preserve optional mapping to Level 1 governance when expressly governed under the applicable ICxA process; and
- maintain explicit state and traceability fields for evidence, deficiencies, and decisions.

## 4. Future extensibility

The ontology is intentionally open to future profiles, including operational readiness profiles and other official ICxA-aligned extensions. The generic core shall remain stable while profile-specific extensions attach without altering the core authority model.
