# OCRS Governance

## 1. Stewardship

ICxA is the sole steward and publication authority for the Open Completion & Readiness Standard (OCRS), including the official specification, official ICxA profiles, official namespaces, official versions, and official conformance suites.

ICxA stewardship does not alter the authority model defined by ICxA standards. In particular:

- technical schema validation is not itself evidence evaluation;
- deterministic conformance checks are not independent Outcome Auditor evaluation;
- machine validation does not substitute for professional judgment; and
- schema validation does not create Outcome Authorization.

The governance hierarchy remains:

- Level 1 Outcome Assurance defines what requires authorization, what evidence is required, who independently evaluates the evidence, and who accepts residual risk and authorizes the outcome;
- Level 2 commissioning and readiness practices define how readiness is planned, executed, verified, and recommended; and
- OCRS expresses the digital representation and exchange of those records without altering their authority.

## 2. Open implementation

ICxA does not control:

- who may implement OCRS;
- which software may support OCRS;
- whether an implementation is open-source or commercial;
- which programming language is used;
- which database is used;
- which AI system is used; or
- which workflow architecture is used.

Any organization, software developer, owner, contractor, lender, insurer, consultant, open-source project, or commercial vendor may implement the published OCRS specification without permission from ICxA, subject to the final published licenses and any applicable ICxA legal conditions.

## 3. Conformance boundaries

OCRS distinguishes between:

- OCRS-compatible implementation; and
- ICxA-certified OCRS implementation.

An OCRS-compatible implementation is technically capable of creating, validating, exchanging, or consuming OCRS documents in a way that conforms to the published specification and any declared profile.

An ICxA-certified OCRS implementation may later require formal independent verification against ICxA-approved conformance requirements. That capability is intentionally not defined in v0.1 beyond preserving the distinction.

OCRS technical conformance tests are open technical conformance tests. Any future ICxA certification program remains separate from technical OCRS compatibility and shall not be treated as a substitute for OCRS technical conformance or for conformance to the underlying ICxA Standards.

A software implementation shall not claim conformity with an ICxA standard merely because it conforms to an OCRS schema or profile. Technical OCRS conformance does not constitute conformity or certification against the underlying ICxA Standards. Claims of conformance to an ICxA standard require demonstration that all applicable ICxA requirements within the declared boundary have been implemented and applied correctly. OCRS may preserve and exchange evidence of such implementation and decision-making, but it does not certify the organization, project, system, or decision itself.

## 4. Change control

Changes to the core OCRS specification shall be subject to ICxA stewardship approval. Core specification changes include:

- clarification or revision of official controlled terminology;
- change to the authority model or governance hierarchy;
- modification to the core ontology;
- change in the official profile alignment baseline; and
- amendments to versioning and namespace rules.

Profile changes must preserve compatibility where practical and shall be introduced as a new profile version when the meaning of a mapped ICxA requirement or controlled term changes.

## 5. Licensing and stewardship attribution

The specification and official profile materials must remain publicly readable, reusable, and implementable while preserving ICxA attribution and stewardship. Reference code, schemas, and examples may use permissive open-source licenses where appropriate, but the exact licensing model shall be selected only after ICxA legal review and a clear record of the recommended structure.

See docs/licensing.md for the provisional recommendation and legal questions requiring ICxA counsel review.

## 6. Versioning and namespace management

OCRS versioning shall be explicit and semantically versioned. The repository must differentiate between:

- OCRS core version;
- ICxA profile version;
- schema version, where applicable; and
- extension namespace identifier.

OCRS core versions and ICxA profile versions shall be independently identifiable. Versioned profiles may be backward-compatible or intentionally breaking. Breaking changes shall be marked and documented clearly. A change in the ICxA alignment baseline or a change in normative meaning shall not be silently carried forward under an existing profile version.

Controlled ICxA terminology shall retain the meaning assigned by the declared ICxA standard edition and revision. Aliases and deprecated terms may be represented only through explicit mapping and shall not redefine controlled terms.

## 7. Governance by separation

OCRS governance must preserve the separation of concerns between:

- specification authority;
- implementation freedom;
- conformance verification; and
- professional judgment in Level 1 authorization.

The repository must never suggest that document validation, schema checks, or software behavior replace the independent professional judgment that ICxA standards require at Level 1.

## 8. Draft status and private review

OCRS v0.1 is a draft / experimental / not yet stable publication. It is intended to establish the open semantic and interoperability layer for future profiles and implementations. It is not a final production certification, normative release, or lifecycle governance model for all future cases.

The repository shall remain private until ICxA completes the required governance and legal review. Final specification, code, schema, test, attribution, disclaimer, and trademark licensing language remains subject to ICxA legal review.
