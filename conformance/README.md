# Conformance and Validation

This directory contains conformance fixtures used by the repository validation pipeline.

- valid/ contains schema-valid example packages
- invalid/ contains intentionally invalid inputs used to confirm that validation fails
- expected-results/ contains deterministic evaluation expectations

The repository test suite validates the schema and checks the RFDC evaluator against expected outcomes.
