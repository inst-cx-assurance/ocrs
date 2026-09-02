# Implementation guide

Use a Draft 2020-12 validator with format checking, then apply OCRS semantic rules. JSON Schema alone cannot prove uniqueness, typed references, graph acyclicity, exact inventory, safe external references, profile support, current evidence, or Deficiency controls.

Recommended import flow:

1. parse JSON with size/resource limits;
2. reject an unsafe scenario/base path before resolving local controlled scenarios;
3. validate the declared schema and profiles;
4. index records by stable ID and reject duplicates;
5. verify exact inventory, all typed references, evidence scope/usability, gate/review/decision contexts, Level 2 roles and authority, handover/TOC consistency, versions, supersession, graph rules, extensions, and required profile hash;
6. evaluate only an explicitly supported profile;
7. return all explanation nodes and supporting record IDs; and
8. never create a human Review, Recommendation, or decision implicitly.

Exporters should canonicalize timestamps with a timezone, preserve unknown declared extensions losslessly, retain prior versions, and keep external evidence outside the package unless embedding is explicitly required. Exact external evidence relied upon by the package is bound to a digest, controlled version, or immutable external identifier.

## OCRS Canonical JSON v0.1

Package hashing deep-copies the JSON value, removes only `manifest.contentHash`, recursively sorts each object's keys by ascending UTF-16 code-unit order, preserves array order, serializes strings/numbers/booleans/null with JSON stringification, inserts no insignificant whitespace, encodes the result as UTF-8 without a BOM, and hashes those bytes with SHA-256. Inputs are valid JSON: non-finite numbers, `undefined`, functions, sparse arrays, and non-JSON host objects are outside the algorithm. `conformance/hash-test-vectors.json` supplies reproducible canonical strings and digests.

The reference toolchain supports Node `>=22.13.0 <23` and `>=24.0.0 <25`, TypeScript, `node --import tsx`, Ajv 8, and Vitest. CI tests both Node lines. These are implementation choices, not protocol requirements.
