# Source-to-model traceability matrix

| Requested source concept                                  | OCRS artifact                           | Validation / test                         | Status                                                |
| --------------------------------------------------------- | --------------------------------------- | ----------------------------------------- | ----------------------------------------------------- |
| Project/lifecycle                                         | `project.schema.json`                   | package schema, inventory/reference tests | Implemented v0.1 fields; no universal lifecycle claim |
| SBS/system/subsystem/grouping/assets/interfaces           | structural schemas                      | typed references, duplicate IDs           | Implemented core representation                       |
| Five boundary types                                       | boundary plus specialization schemas    | scope, mapping, handover/TOC tests        | Implemented core representation                       |
| Level 2 roles/authority                                   | Party, Role Assignment, Authority Scope | role/validity/permission/scope fixtures   | Implemented for represented v0.1 actions              |
| Requirements/readiness conditions                         | requirement and condition schemas       | gate membership/scope and RFDC tests      | Detailed only for draft RFDC                          |
| Activities/inspections/verifications/tests/demonstrations | Activity plus specialization schemas    | package/reference validation              | Implemented structural representation                 |
| Evidence/provenance/revisions                             | three schemas                           | usability/scope/binding/history fixtures  | Implemented RFDC semantics                            |
| Category A/B/C/D                                          | Deficiency/Reclassification             | semantic fixtures/tests                   | Draft mapping; ICxA verification required             |
| Constraints/dependencies                                  | schemas and graph rules                 | blocker/cycle/context tests               | Implemented RFDC/core behavior                        |
| Residual-risk inputs                                      | dedicated Level 2 schema                | decision/reference validation             | Level 2 representation only                           |
| Deterministic evaluation/explanation                      | schemas and reference evaluator         | context/input/reproducibility tests       | Detailed only for RFDC                                |
| Commissioning gates                                       | schema                                  | gate-coverage matrix                      | Core-representable; RFDC detailed                     |
| Operational Readiness gates/lifecycle/pillars             | schema                                  | schema enum coverage                      | Core only                                             |
| Reviews/recommendations/readiness decisions               | separate schemas                        | context/authority/condition fixtures      | Implemented core semantics; OR profiles absent        |
| Handover / Transfer of Operational Control                | separate schemas/boundaries             | authority/AOCR/context/date fixtures      | Implemented core semantics; profile mapping open      |
| Change/profile/extension/manifest                         | schemas and semantic validator          | fixtures/history/hash vectors             | Implemented v0.1 mechanics                            |

Exact source-clause mapping to controlled ICxA editions/revisions remains open pending access and authorization. See `specification/icxa-alignment.md`.
