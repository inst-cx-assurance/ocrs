# Validation guide

## Commands

| Command                           | Coverage                                                              |
| --------------------------------- | --------------------------------------------------------------------- |
| `npm ci`                          | clean lockfile installation                                           |
| `npm run format:check`            | formatting                                                            |
| `npm run lint`                    | TypeScript/config lint                                                |
| `npm run build`                   | strict TypeScript compilation                                         |
| `npm run validate:schemas`        | all schemas against Draft 2020-12, then compilation                   |
| `npm run validate:packages`       | profiles, both canonical RFDC states, and four valid Level 2 fixtures |
| `npm run validate:invalid`        | every invalid fixture must fail for its expected diagnostic code      |
| `npm run validate:references`     | semantic package/reference integrity                                  |
| `npm test`                        | unit and semantic tests                                               |
| `npm run rfdc:evaluate:ready`     | Scenario B                                                            |
| `npm run rfdc:evaluate:not-ready` | Scenario A                                                            |
| `npm run conformance`             | complete OCRS v0.1 technical suite                                    |

Invalid fixtures are controlled mutation documents applied to the valid reference package. This keeps each failure small and attributable. A fixture passes only if its named diagnostic appears; an unrelated failure is insufficient.

Some TOC/decision counterexamples declare `baseValidFixture` and mutate an already validated Level 2 fixture. Validation always checks the complete resolved package. The current suite includes 42 expected-invalid fixtures.

Schema validity alone is not Data Conformance. Data Conformance additionally requires semantic consistency, but still does not establish source truth, professional sufficiency, continuing field conditions, or readiness. A satisfied deterministic result supports, but does not issue, a controlled human Readiness Recommendation.
