# Open Completion & Readiness Protocol (OCRS)

OCRS is an open, machine-readable protocol for exchanging and evaluating Level 2 Commissioning & Outcome Execution and Operational Readiness information. It links systems and boundaries to requirements, activities, controlled evidence, Deficiencies, constraints, dependencies, reviews, recommendations, readiness decisions, System Handover, and Transfer of Operational Control.

**OCRS does not determine readiness by percentage complete. It provides a structured model linking readiness assertions to requirements, evidence, dependencies, deficiencies, and controlled gates.**

OCRS v0.1 stops at the Level 2 boundary. A deterministic evaluation, Readiness Recommendation, Operational Readiness decision, System Handover, or Transfer of Operational Control is not Outcome Authorization. OAP is a future, separate protocol and is not implemented here.

## Draft status

Version 0.1 is Draft / Experimental / Not Yet Stable. The schemas, reference evaluator, and conformance fixtures are suitable for review and interoperability experiments, not an ICxA certification claim.

## What v0.1 contains

- 46 modular JSON Schemas using Draft 2020-12;
- stable namespaced identifiers and exact record versions;
- a package manifest with profiles, complete inventory, qualifications, external evidence references, and optional SHA-256 content integrity;
- semantic validation for typed references, versions, supersession, dependencies, Deficiency controls, extensions, and package integrity;
- core representation for the commissioning and Operational Readiness gates listed in the gate-coverage matrix;
- one fully deterministic RFDC profile;
- a complete fictional CW-101 package plus ready and not-ready controlled scenarios;
- reason-specific invalid fixtures and an inspectable explanation-tree evaluator.

OCRS is independent of databases, APIs, workflow engines, AI models, and vendors. **Licensing proposal (not yet effective):** ICxA proposes free internal noncommercial development and testing of the reference software and technical assets. Commercial use, production deployment, and public distribution would require a separate written ICxA commercial license associated with an eligible active Corporate Membership. Membership alone is not a license. See the draft `LICENSE` and `specification/LICENSE`; existing licensing restrictions remain in force until approval and publication. ICxA marks and certification require separate authorization.

## Quick start

Node.js 22.12 or later is required.

```sh
npm ci
npm run conformance
```

Useful individual commands:

```sh
npm run format:check
npm run lint
npm run validate:schemas
npm run validate:packages
npm run validate:invalid
npm run validate:references
npm test
npm run rfdc:evaluate:ready
npm run rfdc:evaluate:not-ready
```

`npm run conformance` runs formatting, linting, TypeScript compilation, schema/package/fixture/reference validation, tests, and both RFDC evaluations.

## Repository map

- `specification/` — normative draft protocol chapters and informative alignment material
- `schemas/` — modular Draft 2020-12 schemas
- `profiles/` — controlled RFDC and ICxA alignment declarations
- `examples/cw-101-reference/` — canonical package and scenarios
- `conformance/` — expected-failure fixtures
- `src/` — deterministic validation, integrity, scenario, and RFDC evaluation tooling
- `test/` — unit and semantic conformance tests
- `docs/` — architecture, implementation, security, validation, governance, and audit guidance

Start with [the CW-101 walkthrough](docs/cw-101-walkthrough.md), [the validation guide](docs/validation-guide.md), and [the OAP boundary note](docs/future-oap-interface.md).
