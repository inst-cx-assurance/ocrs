# Security and integrity considerations

The reference validator rejects duplicate IDs, broken/wrong-type references, unsupported versions, invalid supersession, prohibited dependency cycles, evidence label/currency/validity/scope contradictions, cross-context review/decision records, invalid Level 2 authority, invalid handover/TOC support, reserved extension namespaces, controlled-term overrides, project-status substitution, unsafe or unbound external evidence references, invalid evidence-hash lengths, and invalid package hashes.

Scenario resolution rejects absolute paths and `..` traversal. External evidence references are limited by semantic policy to HTTPS or URN values and reject path traversal or `file:` references. Consumers should additionally enforce host allowlists, network isolation, size/depth limits, timeouts, and content scanning appropriate to their environment; OCRS does not fetch external evidence.

Record inventory and typed references reduce reference/evidence substitution risk. Prior records and decisions must not be overwritten silently. Timestamps require an explicit timezone. Implementers should minimize personal information, avoid credentials/secrets, and never place local absolute paths in packages or fixtures.

The RFDC profile requires a verified SHA-256 package hash over OCRS Canonical JSON v0.1. This makes the versioned snapshot integrity-checkable; it does not make the package immutable, authenticate a person or organization, establish signing authority, encrypt data, or provide cryptographic non-repudiation. Signing and trust policy are outside v0.1.

Dependency audit results are environment/time-specific. The final verification records the observed `npm audit` result; it is not a permanent security guarantee.
