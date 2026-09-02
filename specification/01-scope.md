# Scope

## 1. Objective

OCRS v0.1 defines the open semantic and interoperability layer for representing structured evidence, readiness records, deficiency and dependency tracking, and governance links between Level 1 Outcome Assurance and Level 2 commissioning / operational readiness activities.

## 2. In scope

The initial scope covers a small but foundational model:

- project and system context;
- asset, subsystem, and boundary context;
- requirement and readiness condition representation;
- Outcome Obligation, Outcome Requirement, and Outcome Evidence Need;
- activity and evidence records;
- deficiency, constraint, dependency, and risk representation;
- Level 2 commissioning stage-gate, readiness review, and readiness recommendation;
- Level 1 independent evaluation and outcome authorization linkage where applicable;
- responsible party and role assignments; and
- extension points for future profiles.

## 3. Initial canonical profile

The initial canonical Commissioning Stage-Gate profile is Ready for Dynamic Commissioning (RFDC). It is a Level 2 commissioning stage-gate and must not be relabeled as an Operational Readiness gate or as Level 1 Outcome Authorization.

## 4. Out of scope for v0.1

The following are deliberately excluded from the initial implementation scope:

- schemas and machine validation models;
- conformance evaluator software;
- reference implementations and production application code;
- detailed operational readiness profile implementations for ORC, AOCR, IOC, and FOC;
- full lifecycle coverage of all commissioning or readiness scenarios; and
- proprietary ICxA applications.

## 5. Boundary of authority

OCRS represents but does not supplant authority. It preserves the distinction between:

- Level 1 Outcome Assurance decision and authorization authority; and
- Level 2 readiness execution, recommendations, and stage-gate records.

If a Level 2 stage-gate supports Level 1 governance, the OCRS model must preserve that link explicitly rather than collapse the two authority domains into a single status.
