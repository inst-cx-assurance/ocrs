# Current implementation gap review

Status: completed baseline audit, 2026-09-01. This review compares the repository as found with `BUILD-BRIEF.md` and the controlling OCRS-only scope decision.

## Baseline found

The worktree was on `main` and every file except `BUILD-BRIEF.md` was untracked. All existing files were therefore treated as protected user/Copilot work. The repository contained 31 small Draft 2020-12 schemas, one CW-101 package, two nominally valid conformance packages, one invalid package, a TypeScript RFDC evaluator, one two-test Vitest file, and a minimal CI workflow.

The reported commands passed on 2026-09-01:

| Command | Result | What it actually established |
| --- | --- | --- |
| `npm install` | pass; 185 packages; zero reported audit vulnerabilities | The existing lockfile was installable in the current environment. |
| `npm run validate:schemas` | pass | One example package was validated with schema meta-validation disabled; the success line was printed twice. It did not validate every schema, valid fixture, invalid fixture, or semantic reference. |
| `npm test` | pass; 1 file, 2 tests | One ready result and one not-ready result matched top-level strings. |
| `npm run rfdc:evaluate` | pass; `satisfied` | The evaluator accepted an unvalidated package and returned a shallow rules list. |

## Gap assessment at audit time

| Requested capability | Found | Gap / disposition |
| --- | --- | --- |
| Complete repository structure | Partial | Important schema, profile, example, validation, conformance, and documentation artifacts were absent. |
| Complete core schemas | No | Many required Level 2 entities and distinct boundary/decision/handover records were missing. Several prohibited Level 1/OAP-oriented schemas were present. |
| Identifier strategy | No | IDs accepted any non-empty string; namespace, entity type, uniqueness, and record versions were not enforced. |
| Reference integrity | No | No duplicate, broken, or wrong-type reference checking existed. |
| Controlled extensions | Partial | A declaration schema existed but did not prevent official-term or namespace redefinition. |
| Profile declarations | Partial | A draft manifest existed, but versions were placeholders and RFDC behavior was not a machine-readable profile. |
| Canonical not-ready scenario | Partial | It was smaller than requested and schema-inconsistent; the evaluator collapsed important evidence distinctions. |
| Canonical ready scenario | Partial | It had only three assets, five requirements, five evidence records, and no full manifest or provenance model. |
| `not_satisfied` vs `indeterminate` | Incorrect | Missing evidence was set to `not_satisfied`; invalid evidence states were all treated alike. |
| Valid and invalid fixtures | No | Only one generic missing-project invalid input existed; expected semantic reasons were not asserted. |
| Category A/B/C/D behavior | Partial | Only an open Category A was evaluated. B/C/D controls were not validated. |
| Evidence provenance/supersession | Partial | A few fields existed without revision-chain or current-record validation. |
| Explanation tree | No | Output was a flat string/rule list and could be empty for a ready result. |
| Conformance categories | Partial | Documentation contemplated categories but tooling did not implement them. |
| Reproducible clean install | Partial | `npm install` passed; CI used `npm ci`, but the complete clean workflow had not been demonstrated. |
| CI | Partial | CI ran only the two-step `conformance` script and had no explicit least-privilege permissions. |
| Complete documentation | No | Most documents still claimed schemas and implementation were out of scope. |
| `AUDIT-PACK.md` | Partial | It described the earlier Level 1-inclusive architecture and overstated implementation coverage. |
| `IMPLEMENTATION-REPORT.md` | Partial | It reported two tests and a minimal pipeline, not the requested completion proof. |

## Controlling scope correction

`BUILD-BRIEF.md` is retained as project history, but its Level 1/OAP implementation directions are superseded for draft OCRS v0.1 by ADR-0002. OCRS now stops at Level 2. A future, independent OAP may consume an exact immutable OCRS package, but OCRS defines no OAP transaction or OAP records.

## Implementation response

The v0.1 completion work will:

- keep the Node 22 and `tsx` toolchain;
- use Draft 2020-12 meta-schema validation and modular entity schemas;
- add stable namespaced identifiers, record versions, exact inventory, provenance, qualifications, and optional deterministic package hashes;
- perform controlled semantic validation for references, versions, revision/supersession chains, dependencies, deficiencies, extensions, boundaries, and history;
- implement two complete CW-101 scenarios and a deterministic, explanation-tree RFDC evaluator;
- add reason-specific invalid fixtures and broad unit/semantic tests;
- expose explicit commands for every CI and conformance stage; and
- rewrite stale documentation to describe the implemented OCRS-only draft accurately.

