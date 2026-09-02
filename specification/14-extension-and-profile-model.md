# Extension and profile model

Packages declare OCRS core and profile identifiers/versions in the manifest and include exact profile-declaration records. Official meanings never change under an existing version.

Extensions MUST use a namespace owned by the extension author. The `ocrs` and `icxa` namespaces are reserved. Extension fields use qualified keys and an extension declaration identifies version and applicable entity types. Extensions MUST NOT redefine official controlled terms, authority, gate semantics, Deficiency categories, or reference rules.

Profiles may be core, ICxA, industry, organization, project, or vendor profiles. Tailoring and uncertainty remain explicit through qualifications, exclusions, mapping status, and versioned declarations.
