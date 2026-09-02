# State Model

The OCRS state model is designed to support explainability and traceability across readiness and outcome assurance records.

## 1. State categories

State information in OCRS v0.1 should track:

- requirement or condition status;
- evidence status;
- deficiency status;
- dependency status;
- review status;
- recommendation status; and
- authorization status.

## 2. Required distinctions

The following distinctions must remain explicit:

- not started vs in progress vs complete vs dispositioned;
- evidence missing vs evidence provided vs evidence rejected vs evidence accepted;
- deficiency open vs resolved vs accepted with constraints vs not applicable;
- readiness condition satisfied vs not satisfied vs waived by applicable authority vs deferred;
- recommendation supported vs not supported; and
- authorization authorized vs not authorized vs deferred vs restricted vs suspended vs reversed.

## 3. No collapse to a single status

OCRS shall not collapse the Level 1 and Level 2 states into one single automated status. A system may have a readiness state, a readiness recommendation, and an authorized outcome state that are related but distinct.

## 4. Traceability requirement

Every state change should be traceable to:

- the relevant requirement or readiness condition;
- the evidence supporting the claim;
- the decision record or professional judgment authorizing the state;
- the relevant responsible party; and
- the version of the profile or standard being applied.
