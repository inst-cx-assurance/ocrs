# CW-101 canonical walkthrough

The fictional reference models one cooling-water system, two subsystems, six tagged assets, one electrical interface, five boundary types, five execution requirements, ten RFDC readiness conditions, six activities, ten evidence records, two dependencies, three Deficiencies, and one constraint.

Scenario A resolves `rfdc-not-ready.scenario.json` against the complete base package. The static test evidence is present but marked missing/pending, so that condition is `indeterminate`. Category A Deficiency `CW-A1` is open, so Deficiency control is `not_satisfied`. The overall result is `not_satisfied`, and the stored Review/Recommendation do not support progression.

Scenario B is `rfdc-ready.package.json`. Accepted current static-test evidence is supplied and the Category A item is closed with `CW-DEF-CLOSE`. Every RFDC condition is satisfied. The separately recorded human Readiness Review supports the separately recorded recommendation to proceed.

Neither scenario contains or implies OAP records or Outcome Authorization.
