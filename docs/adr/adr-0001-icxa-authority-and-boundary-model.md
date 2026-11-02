# ADR-0001: ICxA authority and OCRS boundary model

- Status: Superseded in part by ADR-0002
- Date: 2026-09-01

## Context

> Historical note: ADR-0002 supersedes every part of this decision that placed Level 1/OAP records or an optional Level 1 mapping inside OCRS. The remaining open-implementation, ICxA stewardship, technical-conformance, versioning, draft-status, and legal-review decisions remain historical foundations.

OCRS must operate as an open interoperability layer for evidence, readiness, and outcome assurance records without altering the authority model defined by the ICxA standards. The repository must distinguish between technical representation and governed professional judgment.

## Decision

The approved Phase 1 model is:

1. ICxA is the sole steward and publication authority for official OCRS specifications, official ICxA profiles, namespaces, versions, and conformance suites.
2. Third parties may implement OCRS without ICxA permission, subject to final published licenses.
3. RFDC remains a Level 2 Commissioning Stage-Gate and shall not automatically or canonically map to Level 1 Outcome Authorization.
4. RFDC evidence and Readiness Recommendation may support a separately established Level 1 outcome stage-gate only where the project expressly defines the Outcome Obligation, Outcome Requirements, Outcome Evidence Need, Outcome Auditor evaluation, and Outcome Director authorization process.
5. ORC, AOCR, IOC, and FOC remain Level 2 Operational Readiness decision gates and shall not automatically constitute Level 1 Outcome Authorization.
6. The generic OCRS core uses minimal generic decision states. Controlled ICxA terms and statuses are defined in versioned ICxA profiles rather than embedded as universal core semantics.
7. OCRS technical conformance tests are open technical conformance tests. Any future ICxA certification program remains separate from technical OCRS compatibility.
8. OCRS technical conformance does not constitute conformity or certification against the underlying ICxA Standards.
9. Controlled ICxA terminology retains the meaning assigned by the declared ICxA standard edition and revision. Aliases and deprecated terms may be represented only through explicit mapping and shall not redefine controlled terms.
10. OCRS core versions and ICxA profile versions are independently identifiable.
11. OCRS v0.1 is marked Draft / Experimental / Not Yet Stable.
12. Final specification, code, schema, test, attribution, disclaimer, and trademark licensing language remains subject to ICxA legal review.
13. The repository is publicly available; publication does not establish profile approval or grant rights beyond the published licensing terms.

## Consequences

- OCRS can preserve authority boundaries without collapsing Level 1 and Level 2 records into one automated status.
- Third-party implementations remain open, while official profile and conformance governance remain under ICxA stewardship.
- The repository does not assert that software or schema validation can substitute for professional judgment, evidence evaluation, residual-risk acceptance, or Outcome Authorization.
- Future ICxA profile revisions can add controlled terms and statuses without changing the generic core semantics.
