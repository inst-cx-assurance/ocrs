# Level 2 Stage-Gate Model

This chapter defines the initial Level 2 stage-gate model for OCRS v0.1.

## 1. Purpose

A Level 2 stage-gate records the status and disposition of a readiness decision at the commissioning or readiness execution level. It is not equivalent to Level 1 Outcome Authorization unless the applicable ICxA Level 1 process expressly governs and records it as such.

## 2. Required elements

The initial Level 2 stage-gate model should support:

- gate identifier and profile designation;
- associated system, subsystem, or boundary;
- readiness conditions and requirements assessed;
- evidence and review records;
- deficiency and constraint records;
- dependency and boundary conditions;
- readiness review and recommendation;
- final readiness decision or disposition; and
- an optional linkage to Level 1 Outcome Evidence Need and Outcome Authorization where the profile expressly maps the gate to Level 1 governance.

## 3. Canonical profile for v0.1

The canonical Level 2 stage-gate profile is Ready for Dynamic Commissioning (RFDC).

RFDC shall be represented as a Level 2 commissioning stage-gate. It must not be represented as:

- an Operational Readiness gate;
- a generic readiness status; or
- a Level 1 Outcome Authorization.

## 4. Relationship to Level 1

If the applicable ICxA Level 1 governance model expressly maps RFDC to an outcome authorization process, OCRS may preserve the linkage in a controlled way. The model must keep the Level 2 gate record and the Level 1 authorization record distinct.
