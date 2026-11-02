# OCRS verification pack

Status: public experimental implementation; no certification or ICxA Profile Conformance is claimed.

OCRS Conformance validates 48 schemas, 20 negative fixtures, package/reference integrity, and ready/not-ready RFDC scenarios. Regression coverage includes multiple RFDC gates, operational-gate evaluation references, review/evaluation gate consistency, evidence review status, inventory deep equality and duplicate record identifiers. Full dependency auditing includes development tooling.

Policy-sensitive limitations remain in no-dependency declarations, proposed-handover acceptance fields, reviewer attribution, and official evidence/category mappings. Passing tests do not close those governance questions.

## Reproduction

Run npm ci, npm run conformance, and npm audit on Node.js 22 and 24. Conformance includes formatting, lint, TypeScript build, schema and fixture validation, and regression tests.

See [verification status](docs/verification-status.md) for the complete finding register and approval holds. Current licensing is defined by LICENSE and specification/LICENSE.
