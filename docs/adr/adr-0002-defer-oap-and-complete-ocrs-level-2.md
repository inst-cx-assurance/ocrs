# ADR-0002: Defer OAP and complete OCRS at the Level 2 boundary

- Status: Accepted; supersedes the Level 1 implementation portions of ADR-0001 and `BUILD-BRIEF.md`
- Date: 2026-09-01

## Context

The original brief described one representation spanning Level 2 readiness and Level 1 Outcome Assurance. The controlling scope decision instead requires OCRS to be independently implementable as the Open Completion & Readiness Protocol and defers all Outcome Assurance Protocol (OAP) design.

## Decision

OCRS v0.1 represents Level 2 Commissioning & Outcome Execution and Operational Readiness information only. It may produce controlled evidence, deterministic evaluations, Readiness Reviews and Recommendations, readiness decisions, System Handover records, and Transfer of Operational Control records.

OCRS does not determine Outcome Evidence Need, perform Outcome Auditor evaluation, record Outcome Director judgment or residual-risk acceptance, issue Outcome Authorization, or imply that any Level 2 result is Outcome Authorization. No OAP schemas, validators, examples, workflow, or conformance categories form part of OCRS v0.1.

An OCRS package carries an exact identity, versioned record inventory, provenance, supersession state, declared project and boundaries, profiles, qualifications, external references, and an optional deterministic content hash. A future external protocol can therefore reference an exact OCRS package and exact record versions without OCRS depending on that protocol.

## Consequences

- Vendors can implement OCRS without implementing OAP.
- Existing Level 1-oriented draft schemas are removed from the active schema set; their architectural history remains documented in ADR-0001, this ADR, and Git history once committed.
- Existing specification chapters that described a Level 1 data model are converted to non-normative boundary notes.
- `Outcome Authorization` is not an OCRS record or conformance result.
- OCRS makes no cryptographic non-repudiation claim. A SHA-256 content hash, when present and verified, establishes deterministic content integrity only.

