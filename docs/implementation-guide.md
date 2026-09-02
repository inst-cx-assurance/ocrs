# Implementation guide

Use a Draft 2020-12 validator with format checking, then apply OCRS semantic rules. JSON Schema alone cannot prove uniqueness, typed references, graph acyclicity, exact inventory, safe external references, profile support, current evidence, or Deficiency controls.

Recommended import flow:

1. parse JSON with size/resource limits;
2. reject an unsafe scenario/base path before resolving local controlled scenarios;
3. validate the declared schema and profiles;
4. index records by stable ID and reject duplicates;
5. verify exact inventory, typed references, versions, supersession, graph rules, extensions, and optional package hash;
6. evaluate only an explicitly supported profile;
7. return all explanation nodes and supporting record IDs; and
8. never create a human Review, Recommendation, or decision implicitly.

Exporters should canonicalize timestamps with a timezone, preserve unknown declared extensions losslessly, retain prior versions, and keep external evidence outside the package unless embedding is explicitly required. Content hashing uses recursively sorted JSON object keys and excludes `manifest.contentHash` itself.

The reference toolchain uses Node 22, TypeScript, `tsx`, Ajv 8, and Vitest. These are implementation choices, not protocol requirements.
