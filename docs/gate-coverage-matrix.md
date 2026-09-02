# Gate coverage matrix

| Gate / transition                 | Core representation       | Controlled term      | Official profile | Detailed evidence profile       | Deterministic evaluator  | Canonical example   | Conformance test                 |
| --------------------------------- | ------------------------- | -------------------- | ---------------- | ------------------------------- | ------------------------ | ------------------- | -------------------------------- |
| Construction Completion           | Yes                       | Yes                  | Core only        | No                              | Prerequisite status only | CW-101 prerequisite | Yes                              |
| Ready for Dynamic Commissioning   | Yes                       | Yes                  | Draft RFDC 0.1   | Yes, ICxA verification required | Yes                      | Ready + not-ready   | Yes                              |
| Ready for Energization            | Yes                       | Yes                  | Not implemented  | No                              | No                       | No                  | Schema enum only                 |
| Ready for Start-Up                | Yes                       | Yes                  | Not implemented  | No                              | No                       | No                  | Schema enum only                 |
| Start-Up evidence-control point   | Activity/evidence         | Yes in specification | Not implemented  | No                              | No                       | No                  | No                               |
| Performance Verification          | Yes                       | Yes                  | Not implemented  | No                              | No                       | No                  | Schema enum only                 |
| Trial Operation                   | Yes                       | Yes                  | Not implemented  | No                              | No                       | No                  | Schema enum only                 |
| System Handover                   | Dedicated record/boundary | Yes                  | Not implemented  | No                              | No                       | Boundary only       | Distinction test                 |
| Transfer of Operational Control   | Dedicated record/boundary | Yes                  | Not implemented  | No                              | No                       | Boundary only       | Explicit-record distinction test |
| Organizational Readiness Complete | Yes                       | Yes                  | Not implemented  | No                              | No                       | No                  | Schema enum only                 |
| Asset Operational Control Ready   | Yes                       | Yes                  | Not implemented  | No                              | No                       | No                  | Schema enum only                 |
| Initial Operational Capability    | Yes                       | Yes                  | Not implemented  | No                              | No                       | No                  | Schema enum only                 |
| Full Operational Capability       | Yes                       | Yes                  | Not implemented  | No                              | No                       | No                  | Schema enum only                 |

Operational Readiness core also represents Awareness, Preparedness, Readiness, Ramp-up/Stabilization and People, Organization, Asset, Systems & Processes. Core representation is not a detailed or official profile claim.
