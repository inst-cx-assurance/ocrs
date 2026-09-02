# Validation guide

## Commands

| Command                           | Coverage                                                         |
| --------------------------------- | ---------------------------------------------------------------- |
| `npm ci`                          | clean lockfile installation                                      |
| `npm run format:check`            | formatting                                                       |
| `npm run lint`                    | TypeScript/config lint                                           |
| `npm run build`                   | strict TypeScript compilation                                    |
| `npm run validate:schemas`        | all schemas against Draft 2020-12, then compilation              |
| `npm run validate:packages`       | profiles and both canonical resolved package states              |
| `npm run validate:invalid`        | every invalid fixture must fail for its expected diagnostic code |
| `npm run validate:references`     | semantic package/reference integrity                             |
| `npm test`                        | unit and semantic tests                                          |
| `npm run rfdc:evaluate:ready`     | Scenario B                                                       |
| `npm run rfdc:evaluate:not-ready` | Scenario A                                                       |
| `npm run conformance`             | complete OCRS v0.1 technical suite                               |

Invalid fixtures are controlled mutation documents applied to the valid reference package. This keeps each failure small and attributable. A fixture passes only if its named diagnostic appears; an unrelated failure is insufficient.

Schema validity is necessary but does not establish readiness. Semantic validity is necessary before RFDC evaluation. A satisfied deterministic result supports, but does not issue, a controlled human Readiness Recommendation.
