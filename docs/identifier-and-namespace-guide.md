# Identifier and namespace guide

OCRS IDs use `namespace:entity-type:local-id`, for example `ocrs:evidence:CW-STATIC`. The schema pattern is:

```text
^(ocrs|[a-z][a-z0-9.-]*):[a-z][a-z0-9-]*:[A-Za-z0-9][A-Za-z0-9._-]*$
```

IDs are stable record identifiers and MUST be unique in a package. Corrections receive a new ID and record version and use `supersedes`; prior records remain present. `recordVersion`, profile versions, manifest version, OCRS version, and schema version use semantic versions and have independent meanings.

The package manifest inventories every exact `(recordId, entityType, recordVersion)` tuple. Typed references are checked against the target's `entityType`. A future consumer can therefore reference an exact package and record version without controlling OCRS.

`ocrs` and `icxa` namespaces are reserved for official declarations. Vendors and projects use a namespace they control, such as `example.com:asset:123`. Qualified extension keys use `namespace:term`; extensions cannot redefine official fields or terms.
