# Changelog

## 0.1.0-draft — 2026-09-02

### Added

- modular Draft 2020-12 schemas for the OCRS Level 2 core
- namespaced identifier, record-version, reference-integrity, inventory, supersession, extension, and package-integrity validation
- complete CW-101 ready package and controlled not-ready scenario
- deterministic RFDC evaluator with complete explanation tree
- Category A/B/C/D semantic controls and reason-specific invalid fixtures
- expanded tests, explicit CI stages, conformance command, validation/security/traceability documentation, audit pack, and implementation report

### Changed

- completed the repository beyond the earlier Phase 1-only documentation state
- established OCRS as the Open Completion & Readiness Protocol at the Level 2 boundary
- pinned direct development dependencies while retaining the Node 22-compatible `tsx` toolchain

### Removed from active scope

- draft Level 1/OAP entity schemas and any implication that OCRS issues Outcome Authorization

The reasons and compatibility boundary are recorded in ADR-0002. Version 0.1 remains Draft / Experimental / Not Yet Stable.
