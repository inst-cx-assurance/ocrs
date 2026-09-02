# Future OAP interface boundary

This note is non-normative.

OAP will be a future, separate protocol. Some vendors will implement OCRS without implementing OAP, so OCRS has no dependency on OAP.

A future OAP implementation may consume a versioned, integrity-checkable OCRS evidence-package snapshot. OCRS preserves package identity, exact record versions, provenance, manifest integrity information, bound external evidence references, and package qualifications so that exact input can be referenced later. Identity and versioning alone do not make a package immutable.

Outcome Evidence Need determination, Outcome Auditor evaluation, Outcome Director decision and residual-risk acceptance, and Outcome Authorization remain outside OCRS. This note does not define an OAP data model or transaction.
