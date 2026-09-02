# Design principles

1. Evidence first: absence of evidence is never evidence of readiness.
2. Explicit semantics: requirements, assertions, evidence, evaluation, review, recommendation, readiness decision, handover, and control transfer remain separate records.
3. Boundary fidelity: system, test, readiness, handover, and Transfer of Operational Control boundaries remain distinct and mappable.
4. System precedence: aggregation MUST NOT override a conflicting system or interface result.
5. Determinism: the RFDC evaluator uses only declared records and rules; it has no AI, external service, probabilistic inference, or hidden heuristic.
6. Auditability: identifiers, versions, provenance, supersession, change records, inventory, and qualifications remain explicit.
7. Extension safety: extensions use non-reserved namespaces and cannot redefine controlled OCRS/ICxA terms.
8. Open implementation: the protocol is independent of vendor, language, storage, workflow, UI, and agent architecture.
9. Conservative security claims: content hashing is integrity checking, not identity proof or non-repudiation.
10. Protocol separation: OCRS has no dependency on OAP.
