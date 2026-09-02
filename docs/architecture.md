# OCRS Architecture

## 1. Architectural separation

The repository architecture follows the core separation required by the build brief:

- ICxA Level 1 Outcome Assurance standards define governance and authorization authority.
- ICxA Level 2 commissioning and readiness standards define execution, review, and recommendation activities.
- OCRS represents the digital and exchange layer for those records.
- software implementations create, parse, and analyze OCRS-compatible information.
- AI or agent systems may reason over OCRS data but are not part of the core standard.

## 2. Governance by architecture

The architecture intentionally avoids embedding governance authority into the data model. It records decisions and supports traceability, but it does not validate or generate authorization itself.

## 3. Phase 1 boundaries

This repository intentionally does not include new schemas, application software, or evaluators. The Phase 1 repository is therefore limited to:

- specification and terminology content;
- governance information;
- profile baseline declaration;
- authority-boundary model; and
- decision tracking.
