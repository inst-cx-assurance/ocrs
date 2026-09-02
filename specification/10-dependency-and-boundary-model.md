# Dependency and boundary model

OCRS preserves SBS, system, subsystem, asset, interface, and grouping distinctions. Boundary types are system, test, readiness, handover, and Transfer of Operational Control. A test result used for progression MUST be traceable from its test boundary to an applicable system boundary.

Dependencies identify source, target, type, gate, evaluation status, and whether circularity is expressly allowed. Prohibited dependency cycles fail semantic validation. Missing or indeterminate dependencies cannot be silently treated as satisfied.

Project-level aggregation is informative and cannot override a conflicting system or interface. Handover does not imply operational control; control changes only through an explicit Transfer of Operational Control record linked to an applicable readiness decision.
