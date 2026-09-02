# Source-to-model traceability matrix

| Requested source concept                                  | OCRS artifact                           | Validation / test                         | Status                                     |
| --------------------------------------------------------- | --------------------------------------- | ----------------------------------------- | ------------------------------------------ |
| Project/lifecycle                                         | `project.schema.json`                   | package schema, inventory/reference tests | Complete                                   |
| SBS/system/subsystem/grouping/assets/interfaces           | structural schemas                      | typed references, duplicate IDs           | Complete core                              |
| Five boundary types                                       | boundary plus specialization schemas    | mapping evaluator, handover/control tests | Complete core                              |
| Level 2 roles/authority                                   | Party, Role Assignment, Authority Scope | typed-reference validation                | Complete core                              |
| Requirements/readiness conditions                         | requirement and condition schemas       | RFDC evaluator/tests                      | Complete RFDC draft                        |
| Activities/inspections/verifications/tests/demonstrations | Activity plus specialization schemas    | package validation                        | Complete core                              |
| Evidence/provenance/revisions                             | three schemas                           | evidence state, provenance, history tests | Complete                                   |
| Category A/B/C/D                                          | Deficiency/Reclassification             | semantic fixtures/tests                   | Complete draft; ICxA verification required |
| Constraints/dependencies                                  | schemas and graph rules                 | blocker/cycle/reference tests             | Complete RFDC/core                         |
| Residual-risk inputs                                      | dedicated Level 2 schema                | package/reference validation              | Complete core                              |
| Deterministic evaluation/explanation                      | schemas and reference evaluator         | reproducibility/explanation tests         | Complete RFDC                              |
| Commissioning gates                                       | schema                                  | gate-coverage matrix                      | Core complete; RFDC detailed               |
| Operational Readiness gates/lifecycle/pillars             | schema                                  | schema enum coverage                      | Core only                                  |
| Reviews/recommendations/readiness decisions               | separate schemas                        | no-auto-create tests                      | Complete core                              |
| Handover / Transfer of Operational Control                | separate schemas/boundaries             | distinction tests                         | Complete core                              |
| Change/profile/extension/manifest                         | schemas and semantic validator          | fixtures/history/hash tests               | Complete                                   |

Exact source-clause mapping to controlled ICxA editions/revisions remains open pending access and authorization. See `specification/icxa-alignment.md`.
