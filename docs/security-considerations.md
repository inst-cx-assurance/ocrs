# Security and integrity considerations

The reference validator rejects duplicate IDs, broken/wrong-type references, unsupported versions, invalid supersession, prohibited dependency cycles, reserved extension namespaces, controlled-term overrides, project-status substitution, unsafe external evidence references, and invalid package hashes.

Scenario resolution rejects absolute paths and `..` traversal. External evidence references are limited by semantic policy to HTTPS or URN values and reject path traversal or `file:` references. Consumers should additionally enforce host allowlists, network isolation, size/depth limits, timeouts, and content scanning appropriate to their environment; OCRS does not fetch external evidence.

Record inventory and typed references reduce reference/evidence substitution risk. Prior records and decisions must not be overwritten silently. Timestamps require an explicit timezone. Implementers should minimize personal information, avoid credentials/secrets, and never place local absolute paths in packages or fixtures.

SHA-256 package hashing, when declared, checks deterministic content integrity. It does not authenticate a person or organization, establish signing authority, encrypt data, or provide cryptographic non-repudiation. Signing and trust policy are outside v0.1.

Dependency audit results are environment/time-specific. The final verification records the observed `npm audit` result; it is not a permanent security guarantee.
