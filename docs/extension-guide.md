# Extension guide

Declare every extension in `extensionDeclarations` with a non-reserved namespace, extension version, and applicable entity types. Store extension values under the record's `extensions` object using qualified keys.

```json
{
  "extensions": {
    "vendor.example:work-package": "WP-42"
  }
}
```

Extensions may add information. They may not change official identifier syntax, entity types, Deficiency categories, gate meanings, authority boundaries, reference semantics, conformance results, or required core fields. `ocrs` and `icxa` are reserved namespaces. Controlled-term overrides fail validation.

If a change alters normative meaning, publish a new profile or core version instead of an extension. Document tailoring, deviations, qualifications, and compatibility explicitly.
