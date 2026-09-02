# State model

OCRS separates recorded source states from derived evaluation. A source record MUST NOT become satisfied merely because an aggregate status is edited.

Evidence states are `accepted_current`, `missing`, `unavailable`, `rejected`, `failed`, `expired`, and `superseded`. Only accepted, reviewed, current, non-failed, in-validity, correctly typed evidence covering every required condition, requirement, subject, and boundary satisfies an evidence rule. Failed evidence yields `not_satisfied`; missing, unavailable, rejected, stale, expired, superseded, unknown-currency, or otherwise unusable evidence yields `indeterminate` unless another declared rule establishes failure independently. A contradictory `accepted_current` label fails semantic validation.

Deterministic evaluation precedence is `not_satisfied` over `indeterminate` over `satisfied`. This preserves every child result in the explanation tree even when the top-level result is not satisfied.

Decision and history records are append-only in meaning: a correction or supersession creates a new record and preserves the prior record and change basis. System Handover and Transfer of Operational Control have separate lifecycles.
