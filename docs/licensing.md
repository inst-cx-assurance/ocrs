# Licensing Recommendation and Legal Review Notes

## 1. Recommendation

For the OCRS v0.1 draft, the most defensible provisional approach is:

- keep the specification content publicly readable, reusable, and implementable under a permissive open-specification model that preserves ICxA stewardship and attribution;
- use a recognized permissive open-source license for reference material, code, schema examples, test utilities, and other machine-readable artifacts where those materials are created in the repository; and
- avoid selecting a final repository-wide license until ICxA counsel confirms the legal structure for specification content, reference assets, and potential future certification materials.

## 2. Why this recommendation is appropriate

This recommendation aligns with the project objective:

- OCRS is intended to be open and implementable without restricting who may build OCRS-compatible implementations;
- the core objective is interoperability, not proprietary ecosystem control;
- the public specification should remain reusable without forcing a proprietary software stack or vendor lock-in; and
- reference assets should be shareable under a permissive license so implementers can validate and build around the published model.

## 3. Licensing structure to evaluate

The recommended structure to review with ICxA counsel is:

- Specification text: a public, open, attribution-preserving license or public-domain-style publication model suitable for standards content while preserving ICxA stewardship and official versions.
- Reference code and materials: an accepted permissive license such as MIT or Apache-2.0, depending on counsel review and the desired patent and attribution posture.

## 4. Why not to choose a license by popularity alone

A license should not be selected simply because it is common. A standards repository has different legal needs than a software repository. This is especially true when:

- the specification is stewarded by ICxA;
- the repository may contain normative materials and examples;
- future certification or conformance claims may be introduced; and
- the project must remain open to third-party implementers without altering governance authority.

## 5. Legal questions requiring ICxA counsel review

The following items require formal legal review before choosing a final license:

- whether the specification text should be covered by a standards license or a code license;
- whether any normative or controlled text must retain specific attribution or anti-endorsement language;
- whether the repository should separate specification terms from code terms under different licensing conditions;
- whether patent or trademark considerations require specific language or disclaimers;
- whether future certification marks, profile branding, or ICxA logos require separate legal treatment; and
- whether the release should include warranty disclaimers or limitation-of-liability language.

## 6. Current status

No final license selection has been made. The completed technical draft remains under the placeholder `LICENSE` notice. This recommendation is provisional and subject to ICxA counsel review before publication or a final legal choice.
