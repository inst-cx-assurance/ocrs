# OCRS governance

## Stewardship and open implementation

ICxA is the steward of official OCRS specifications, namespaces, versions, profiles, conformance suites, and any future certification marks. Stewardship does not restrict who may implement published OCRS: owners, contractors, consultants, open-source projects, and commercial vendors may create independent implementations, subject to the final published licenses.

OCRS technical behavior is distinct from ICxA conformity or certification. Schema validity does not prove readiness. Deterministic RFDC evaluation does not replace professional judgment. An OCRS Readiness Recommendation or readiness decision is not Outcome Authorization.

## Scope authority

OCRS v0.1 ends at Level 2. OAP and all Level 1 assurance and authorization functions are outside this release. The boundary is controlled by ADR-0002. Changes that cross it require a separately approved protocol decision and cannot be introduced as an OCRS extension.

## Change control

Core changes require:

1. an issue or proposal describing meaning and compatibility impact;
2. an ADR when architecture, authority, identifiers, or versioning changes;
3. updated schemas, examples, expected-failure fixtures, tests, and traceability;
4. a new semantic version when normative meaning changes; and
5. ICxA approval for official OCRS or ICxA profile publication.

Official profile meaning never changes silently. Profile versions are independent of OCRS core versions and must declare the applicable source editions/revisions. Project and vendor extensions cannot use reserved `ocrs` or `icxa` namespaces or redefine controlled terms.

## Conformance claims

The allowed v0.1 technical categories are OCRS Data Conformant, OCRS Exchange Conformant, OCRS RFDC Evaluation Conformant, and OCRS ICxA Profile Conformant. The last is available only after the declared mappings are verified and approved; this draft marks those mappings for ICxA verification.

No technical category certifies an organization, project, system, evidence sufficiency judgment, or underlying ICxA Standards conformity. Any future commercial certification policy remains separate.

## Security and records

Maintainers must preserve prior versions and decision history, reject unsafe or substituted references, avoid secrets and personal information in fixtures, and use least-privilege CI. OCRS content hashes establish deterministic integrity only and do not provide identity authentication or cryptographic non-repudiation.

## Legal and publication status

Final specification/code licenses, attribution, trademark rules, disclaimers, public-release approval, and certification marks require ICxA legal and governance review. See `docs/licensing.md` and `docs/open-decisions.md`.
