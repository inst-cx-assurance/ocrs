# ICxA alignment and source-to-model posture

The machine-readable baseline is `profiles/icxa/profile-manifest.json`. Exact ICxA editions, revisions, publication dates, controlled terminology, and detailed evidence mappings were not available as authorized repository material during implementation and are therefore marked `ICxA verification required`.

OCRS v0.1 represents Level 2 Commissioning & Outcome Execution and Operational Readiness concepts without copying protected normative text. ICXA-20103 and ICXA-20203 are informative only and are not converted into mandatory OCRS behavior.

| Source family / controlled concept                | OCRS representation                                         | Mapping                    | Limitation / verification evidence                                    |
| ------------------------------------------------- | ----------------------------------------------------------- | -------------------------- | --------------------------------------------------------------------- |
| Commissioning system/SBS context                  | SBS, System, Asset, Interface, Boundary schemas             | Partial pending ICxA audit | Verify controlled definitions and exact source clauses.               |
| Execution requirement/activity/evidence           | Requirement, Activity, Evidence, Provenance schemas         | Partial pending ICxA audit | Verify mandatory evidence categories and acceptance semantics.        |
| Category A/B/C/D Deficiency                       | Deficiency and Reclassification schemas plus semantic rules | Partial pending ICxA audit | Verify wording, current-gate effects, and closure rules.              |
| Commissioning Stage-Gates                         | Commissioning Stage-Gate schema                             | Core representable         | Verify controlled gate list and terminology.                          |
| RFDC                                              | RFDC profile, evaluator, scenarios, tests                   | Implemented draft          | Verify exact ICxA evidence mapping before profile-conformance claim.  |
| Operational Readiness lifecycle and pillars       | Operational Readiness Gate schema                           | Core representable         | No detailed evidence profile/evaluator/example in v0.1.               |
| ORC/AOCR/IOC/FOC concepts                         | Controlled core gate values                                 | Core representable         | Official detailed profile and deterministic behavior not implemented. |
| System Handover / Transfer of Operational Control | Separate schemas and boundaries                             | Core representable         | Verify exact decision prerequisites and terminology.                  |

Where an approved official ICxA profile later differs from generic OCRS core behavior, the profile governs only claims made under that exact profile version. Technical OCRS conformance is not ICxA certification.
