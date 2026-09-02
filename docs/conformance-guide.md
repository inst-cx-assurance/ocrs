# Conformance guide

Declare conformance category and exact OCRS/profile versions. Claims are cumulative only when their requirements are actually met.

- **OCRS Data Conformant:** structural and cross-record semantic package validity for the exact declared snapshot. It does not establish source truth, professional evidence sufficiency, continuing field conditions, or readiness.
- **OCRS Exchange Conformant:** lossless import/export of identifiers, versions, relationships, provenance, qualifications, extensions, and controlled terms.
- **OCRS RFDC Evaluation Conformant:** deterministic agreement with both canonical scenarios and explanation requirements.
- **OCRS ICxA Profile Conformant:** exact approved ICxA profile mapping and behavior. Draft v0.1 requires ICxA verification and does not establish this claim.

Never use a technical conformance claim to assert readiness, professional judgment, ICxA Standards conformity/certification, or Outcome Authorization. Future OAP and certification policies remain outside OCRS v0.1.

The RFDC profile requires `manifest.contentHash`. This hardening is a draft compatibility change: earlier RFDC packages without a digest are no longer Data Conformant. The verified digest binds the canonical package bytes as defined in the implementation guide, but does not make records immutable or authenticate their producer.
