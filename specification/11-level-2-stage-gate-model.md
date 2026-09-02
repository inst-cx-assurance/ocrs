# Level 2 gates and transitions

Commissioning Stage-Gates and Operational Readiness decision gates are distinct. Evidence-control points, System Handover, and Transfer of Operational Control are also distinct records/events.

The core controlled Commissioning terms include Construction Completion, Ready for Dynamic Commissioning, Ready for Energization, Ready for Start-Up, Performance Verification, and Trial Operation. Start-Up can be represented as an evidence-control point/activity. System Handover and Transfer of Operational Control use dedicated records.

Operational Readiness gates include Organizational Readiness Complete, Asset Operational Control Ready, Initial Operational Capability, and Full Operational Capability. Core fields preserve Awareness, Preparedness, Readiness, Ramp-up/Stabilization, and the People, Organization, Asset, and Systems & Processes pillars. Detailed profiles are not implemented in v0.1.

Only RFDC has deterministic profile behavior. Its evaluator returns an explanation tree and recommendation support, but never creates a Review, Recommendation, or decision record. Core examples demonstrate a structured conditionally-ready decision, System Handover, and effective TOC after a supportive AOCR decision; they prove semantic representability only and do not claim detailed ORC/AOCR/IOC/FOC profile conformance.

A Level 2 readiness decision records its exact gate/subject/boundary context, authorized decision-maker assignment, decision basis, residual-risk declaration and inputs, Level 2 acceptance basis, rationale, history, and controlled Condition IDs. `conditionally_ready` requires an open controlled Condition. Handover acceptance requires an applicable receiving-organization role. Effective TOC requires an effective supportive AOCR decision (or a future explicitly profile-approved equivalent), consistent parties/systems/boundaries/dates, and applicable transfer roles.
