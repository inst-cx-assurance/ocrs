# Evidence model

Evidence records MUST identify evidence type, authoritative source, creator, responsible party, creation date, revision, record version, review and failure status, applicable requirements/conditions/subjects/boundaries, provenance, qualifications and limitations, whether decision-point currency applies, and currency when applicable. Validity dates MAY be supplied and are inclusive at the applicable evaluation time.

An implementation MUST distinguish missing, unavailable, rejected, failed, stale, expired, superseded, and accepted-current evidence. Superseded evidence and prior revisions remain traceable but are not current support. External evidence remains externally managed; when relied upon as exact evidence, its HTTPS/URN reference MUST be bound to a digest, controlled version, or immutable external identifier in both the evidence record and manifest index.

Evidence SHA-256 values are exactly 64 hexadecimal characters and SHA-512 values exactly 128. A label alone never overrides review, failure, currency, validity, type, provenance, requirement, subject, or boundary rules.

OCRS hashes do not authenticate the creator and do not provide non-repudiation.
