# Level 2 gates and transitions

Commissioning Stage-Gates and Operational Readiness decision gates are distinct. Evidence-control points, System Handover, and Transfer of Operational Control are also distinct records/events.

The core controlled Commissioning terms include Construction Completion, Ready for Dynamic Commissioning, Ready for Energization, Ready for Start-Up, Performance Verification, and Trial Operation. Start-Up can be represented as an evidence-control point/activity. System Handover and Transfer of Operational Control use dedicated records.

Operational Readiness gates include Organizational Readiness Complete, Asset Operational Control Ready, Initial Operational Capability, and Full Operational Capability. Core fields preserve Awareness, Preparedness, Readiness, Ramp-up/Stabilization, and the People, Organization, Asset, and Systems & Processes pillars. Detailed profiles are not implemented in v0.1.

Only RFDC has deterministic profile behavior. Its evaluator returns an explanation tree and recommendation support, but never creates a Review, Recommendation, or decision record.
