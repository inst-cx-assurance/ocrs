# OCRS v0.1 audit pack

Audit date: 2026-09-02

Release status: Draft / Experimental / Not Yet Stable
Scope: OCRS Level 2 only; OAP deferred under ADR-0002

## Audit conclusion

The repository implements a semantically hardened draft OCRS v0.1 technical baseline: 48 Draft 2020-12 schemas, two validated profile artifacts, one complete canonical CW-101 package with two resolved scenarios, four valid Level 2 core-representability fixtures, 42 reason-specific invalid fixtures, deterministic RFDC evaluation, 38 tests across five test files, a complete conformance command, least-privilege CI, and supporting specification/governance/implementation documentation.

No known failing conformance check remains. OCRS remains independently implementable without OAP. No OAP schema, validator, example, evaluator, workflow, or conformance category is present.

## Baseline independently established

The repository originally had small placeholder schemas, one thin package, a flat evaluator, one invalid input, one test file with two tests, stale Phase 1 documentation, and Level 1-oriented schema artifacts. The reported baseline commands passed but validated only one package and two top-level outcomes. Full details are in `docs/current-implementation-gap-review.md`.

All existing work was read before changes. `BUILD-BRIEF.md` is retained unchanged as historical input. ADR-0001 is retained and marked superseded in part; ADR-0002 records the controlling OAP deferral. Active Level 1 schema artifacts were removed because retaining them would implement prohibited scope.

## Implemented controls

| Area               | Evidence                                                                                                                                                               |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Schema             | 48 schemas meta-validated and compiled as Draft 2020-12                                                                                                                |
| Identity/version   | namespaced ID syntax, unique IDs, semantic record/profile/schema/manifest versions                                                                                     |
| Exchange integrity | exact record inventory, typed references, package/project/boundary/profile identity, qualifications/exclusions, and matching external-evidence digest/version bindings |
| History            | record supersession, evidence revisions, change records, no silent duplicate decision IDs                                                                              |
| Evidence           | distinct usability states, provenance, review/failure/time/currency and requirement/subject/boundary/type scope; exact-length evidence hashes                          |
| Deficiency         | Category A/B/C/D controls, separate risk label, owner/closure/acceptance/history fields                                                                                |
| Graph/boundary     | broken/wrong-type refs, dependency cycles, test-to-system boundary mapping, aggregate conflict prevention                                                              |
| Extensions         | reserved namespace and controlled-term redefinition rejection                                                                                                          |
| RFDC               | ten deterministic criteria, three results with fixed precedence, full explanation tree, required content hash, no automatic human records                              |
| Level 2 controls   | coherent Review/Recommendation, structured conditional decision, Handover, and AOCR-supported TOC core semantics; no detailed OR profile claim                         |
| Security           | traversal/unsafe reference checks, invalid hash checks, version checks, secret/path scans, dependency audit                                                            |

## Canonical outcomes

- Scenario A — `ocrs:package:CW-101-RFDC-NOT-READY`: `not_satisfied`; recommendation support `not_supported`. Static-test evidence is `indeterminate`; open Category A Deficiency control is `not_satisfied`.
- Scenario B — `ocrs:package:CW-101-RFDC-READY`: `satisfied`; recommendation support `proceed_supported`. All ten RFDC conditions are satisfied and cite supporting records.

The evaluator returns `createdRecordIds: []`; it does not create a Readiness Review, Recommendation, readiness decision, or external authorization record.

## Verification record

The final recorded verification sequence is:

```text
npm ci                                  PASS; 141 packages installed, 142 audited; 0 vulnerabilities reported
npm run format:check                    PASS
npm run lint                            PASS
npm run build                           PASS
npm run validate:schemas                PASS; 48 schemas
npm run validate:packages               PASS; 2 profiles; 2 resolved RFDC states; 4 valid Level 2 fixtures
npm run validate:invalid                PASS; 42 expected failures with named diagnostics
npm run validate:references             PASS; both resolved package states
npm test                                PASS; 5 files; 38 tests
npm run rfdc:evaluate:ready              PASS; satisfied
npm run rfdc:evaluate:not-ready          PASS; not_satisfied
npm run conformance                     PASS
npm audit                               PASS; 0 vulnerabilities reported
git diff --check                        PASS (line-ending notices only on Windows)
```

CI tests Node 22.13 and Node 24, performs a clean lockfile installation, runs the aggregate conformance command once, and performs `npm audit`. Actions are pinned to full commit SHAs with release comments. Workflow permissions are `contents: read`; no publication, deployment, release, upload, credential, or external-message step exists.

## Security review

The active schemas/source/examples/profiles/tests contain no OAP implementation terms beyond an explicit package exclusion. Credential/private-key scans returned no matches. No local absolute path is stored in a package. The only `file:///../../` string is the intentional unsafe-reference fixture. External evidence is never fetched by the reference tooling.

RFDC package SHA-256 values verify OCRS Canonical JSON v0.1 content after excluding only the hash field itself. Reproducible test vectors are included. This is an integrity mechanism only; OCRS v0.1 makes no immutability, authentication, signature, encryption, or non-repudiation claim.

## Limitations and audit holds

- Exact ICxA editions, revisions, publication dates, clause mappings, controlled terminology, and RFDC evidence mapping require Paul and ICxA audit.
- Only RFDC is a detailed deterministic profile. Other gates are core-representable only, as disclosed in the gate-coverage matrix.
- The fictional example uses `example.invalid` for its external evidence reference and is not field data.
- Content hashing has no signing/trust framework.
- Final licenses, attribution, trademark/disclaimer language, publication approval, and any certification policy remain open.
- The reference implementation is intentionally small and does not impose production resource limits, host allowlists, or an API.

## Publication and communication confirmation

No Git push, publication, release, deployment, package upload, archive upload, or outbound message was performed. The mandated dependency installation, version check, and audit used read-only npm registry requests; no repository artifact or project data was published. The requested audit archive is created locally only after final verification and is excluded from formatting and source packaging inputs.
