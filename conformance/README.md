# Conformance fixtures

`invalid/*.fixture.json` files are controlled mutations applied to the canonical ready package or a named valid Level 2 fixture. Each declares an exact expected semantic diagnostic. `npm run validate:invalid` fails unless every fixture produces its named reason.

The canonical RFDC package/scenario lives under `examples/cw-101-reference`; additional valid core fixtures live under `conformance/valid`. `hash-test-vectors.json` fixes the OCRS Canonical JSON v0.1 byte representation and SHA-256 results.
