# FCL Documentation Output

This directory contains the automatically generated documentation for FCL packages.

## Directory Structure

```
fcl-docs/                 # Main documentation directory for Docusaurus
    ├── packages/         # All packages documentation
    │   ├── index.md      # Packages index page
    │   ├── package-a/    # Documentation for package-a
    │   │   ├── index.md  # Main package page
    │   │   ├── installation/
    │   │   │   └── index.md
    │   │   └── reference/
    │   │       ├── index.md
    │   │       ├── functionName1.md
    │   │       └── ...
    │   ├── package-b/
    │   └── ...
    └── types/            # Core types documentation
        └── index.md      # Types reference page
```

## Using the Generated Documentation

1. The documentation is structured to be directly usable in a Docusaurus v2 project
2. Copy the entire `fcl-docs` directory to your Docusaurus project's `docs` directory
3. The documentation will be available under the `/fcl-docs/packages` and `/fcl-docs/types` paths in your Docusaurus site

## Auto-generation

This documentation is automatically generated from the source code of FCL packages.
Do not modify these files directly as they will be overwritten when documentation is regenerated.

Instead:
- Update the JSDoc comments in the source code
- Customize the templates in `docs-generator/templates/`
- Create a `docs-generator.config.js` file in the package root for custom content

## Types Documentation

The `types` directory contains documentation for core types exported from the `@onflow/typedefs` package. These types are organized into:

- **Interfaces** - Documented with properties and methods
- **Type Aliases** - Documented with their base type and properties (if applicable)
- **Enums** - Documented with all members and values

This documentation is regenerated with every `generate-docs` run to ensure it remains current.

For more details on how the documentation is generated, see the [docs-generator README](../README.md).
