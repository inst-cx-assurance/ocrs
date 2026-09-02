# RFDC v0.1 profile

RFDC is a Level 2 Commissioning Stage-Gate evaluated for a declared system and system/test/readiness boundaries. The machine-readable definition is `profiles/rfdc/profile.json`.

The draft rules require a satisfied Construction Completion prerequisite; accepted A-ITR/construction, B-ITR, static commissioning, safety-control, and Control of Work evidence; test-to-system boundary mapping; satisfied dependencies; no blocking constraints; and controlled A/B/C/D Deficiencies.

Exact ICxA evidence mappings could not be confirmed from authorized repository material and are marked `icxa_verification_required`. These reference categories are a draft interoperability implementation, not copied or asserted ICxA normative text.

The evaluator validates the package first, evaluates every condition, returns `satisfied`, `not_satisfied`, or `indeterminate`, and provides a complete explanation tree. It never automatically creates a Review, Recommendation, or readiness decision.
