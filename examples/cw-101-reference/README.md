# CW-101 RFDC reference

- `rfdc-ready.package.json` is the complete Scenario B exchange package.
- `rfdc-not-ready.scenario.json` is the controlled Scenario A mutation set resolved against the complete package.

Both resolved states pass structural and semantic package validation. Scenario A evaluates `not_satisfied` with separate indeterminate evidence and Category A blocker nodes. Scenario B evaluates `satisfied`. See `docs/cw-101-walkthrough.md`.

Additional fixtures under `conformance/valid` demonstrate coherent Review/Recommendation, conditional Operational Readiness decision, System Handover, and effective AOCR-supported Transfer of Operational Control records. They prove core semantic representability only and do not claim detailed AOCR or ICxA profile conformance.
