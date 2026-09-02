# RFDC v0.1 profile

RFDC is a Level 2 Commissioning Stage-Gate evaluated for a declared system and system/test/readiness boundaries. The machine-readable definition is `profiles/rfdc/profile.json`.

The draft rules require a satisfied Construction Completion prerequisite; accepted A-ITR/construction, B-ITR, static commissioning, safety-control, and Control of Work evidence; test-to-system boundary mapping; satisfied dependencies; no blocking constraints; and controlled A/B/C/D Deficiencies.

Exact ICxA evidence mappings could not be confirmed from authorized repository material and are marked `icxa_verification_required`. These reference categories are a draft interoperability implementation, not copied or asserted ICxA normative text.

The evaluator validates the package first, evaluates every condition, returns `satisfied`, `not_satisfied`, or `indeterminate`, and provides a complete explanation tree. Result precedence is `not_satisfied` over `indeterminate` over `satisfied`.

Evidence support requires accepted-current status, accepted review, no failed status, applicable currency and validity at `evaluatedAt`, matching evidence type, and full condition requirement/subject/boundary scope. A label alone cannot bypass those checks. Failed evidence is deterministically `not_satisfied`; missing, unavailable, rejected, stale, expired, or superseded evidence is `indeterminate`. Contradictory package assertions fail semantic validation before evaluation.

RFDC conformance requires `manifest.contentHash` as a lowercase SHA-256 digest of OCRS Canonical JSON v0.1. This is a deliberate compatibility change from earlier draft packages that allowed the field to be omitted. It provides content-change detection only, not signatures, producer authentication, immutability, or non-repudiation.

The evaluator never automatically creates a Review, Recommendation, readiness decision, Handover, or Transfer of Operational Control record.
