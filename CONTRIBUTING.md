# Contributing to OCRS

OCRS v0.1 is a draft protocol implementation. Contributions may change schemas, tooling, tests, examples, profiles, and documentation when the change remains within the Level 2 scope and includes proportionate verification.

## Contribution rules

- Preserve the distinction among assertions, controlled evidence, deterministic evaluation, human Readiness Review, recommendation, readiness decision, System Handover, and Transfer of Operational Control.
- Do not add OAP or Level 1 assurance/authorization schemas, workflows, examples, validators, or conformance claims.
- Do not infer readiness from missing evidence or percentage completion.
- Keep identifiers, record versions, manifest inventory, provenance, supersession, and boundary mappings explicit.
- Add a reason-specific invalid fixture for new semantic rejection rules.
- Add tests for every new deterministic rule and update the applicable traceability and gate-coverage documentation.
- Mark uncertain ICxA mappings `icxa_verification_required`; do not copy unverified normative text.

## Before submitting a change

Run:

```sh
npm ci
npm run conformance
```

Explain the problem, compatibility impact, affected profile or schema version, tests added, and whether ICxA review is required. Architecture changes should include or update an ADR.

The repository remains Draft / Experimental / Not Yet Stable. Publication and final licensing remain governance decisions.
