# Evidence model

Evidence records MUST identify evidence type, authoritative source, creator, responsible party, creation date, revision, record version, review and failure status, applicable requirements/conditions/subjects/boundaries, provenance, qualifications and limitations, and decision-point currency where applicable. Validity dates, external HTTPS or URN references, and a content hash MAY be supplied.

An implementation MUST distinguish missing, unavailable, rejected, failed, expired, superseded, and accepted-current evidence. Superseded evidence and prior revisions remain traceable but are not current support. External evidence remains externally managed; the OCRS reference preserves its reference and provenance rather than embedding binaries.

OCRS hashes do not authenticate the creator and do not provide non-repudiation.
