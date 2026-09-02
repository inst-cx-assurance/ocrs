# Conformance fixtures

`invalid/*.fixture.json` files are one-purpose controlled mutations applied to the canonical ready package. Each declares an exact expected semantic diagnostic. `npm run validate:invalid` fails unless every fixture produces its named reason.

The canonical valid package and controlled scenarios live under `examples/cw-101-reference`. This avoids duplicating a large package while preserving two complete resolved package states.
