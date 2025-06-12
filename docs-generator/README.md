# Docs Generator

This directory contains scripts to generate documentation for Flow Client Library (FCL) packages.

## Overview

The documentation generator creates Markdown files for Docusaurus v2 websites. It automatically extracts TypeScript function signatures, parameter types, return types, and JSDoc comments to create comprehensive API documentation.

## Directory Structure

- `generate-docs.js` - Main script for generating documentation for a single package
- `generate-all-docs.js` - Script to generate documentation for all packages with the generate-docs script
- `templates/` - Handlebars templates for generating documentation pages
- `output/` - Where generated files are created
- `generators/` - Function utils to generate pages from templates and data

## Features

- Automatic discovery of packages with generate-docs scripts
- Support for JSDoc comments including function descriptions, parameter info, and usage examples
- Handlebars templates for easy customization of output format
- Consistent documentation structure across all packages
- Package index page listing all available packages
- Core types documentation from the @onflow/typedefs package

### JSDoc Support

The documentation generator extracts information from JSDoc comments in code. JSDoc comments can be added to improve the generated documentation:

```javascript
/**
 * This description will be used in the documentation.
 * 
 * @param {string} param1 - This description will be used for the parameter
 * @returns {number} This description will be used for the return value
 * @example
 * // This example will be used in the documentation
 * const result = myFunction("test")
 */
export function myFunction(param1) {
  // ...
}
```

## Usage

### For Individual Packages

Each package that needs documentation should include a `generate-docs` script in its `package.json`:

```json
{
  "scripts": {
    "generate-docs": "node ../../docs-generator/generate-docs.js"
  }
}
```

To generate documentation for a single package, run:

```bash
cd packages/<package-name>
npm run generate-docs
```

### For All Packages

To generate documentation for all packages that have a `generate-docs` script:

```bash
npm run generate-docs-all
```

This will:
1. Find all packages with a `generate-docs` script
2. Run the script for each package
3. Generate documentation in the `/docs-generator/output/packages-docs/<package-name>` directory
4. Generate core types documentation in `/docs-generator/output/packages-docs/types/index.md`

## Output Structure

The generated documentation follows this structure:

```
/docs-generator/output/
  └── packages-docs/         # Main folder containing
      ├── package-a/         # Documentation for package-a
      │   ├── index.md       # Main package page with installation instructions and API 
      │   ├── functionName1.md
      │   ├── functionName2.md
      │   └── ...
      ├── package-b/
      ├── types/
      │   └── index.md       # Type definitions page with interfaces, type aliases, and enums
      └── index.md           # List contents of the folder
```

Each package has a main page that includes:
- Package overview 
- Installation instructions
- API reference with links to individual function documentation

### Auto-generation Notes

All generated files are automatically generated from the source code of FCL packages and are ignored by git (except this README).
Do not modify these files directly as they will be overwritten when documentation is regenerated.

Instead:
- Update the JSDoc comments in the source code
- Customize the templates in `docs-generator/templates/`
- Create a `docs-generator.config.js` file in the package root for custom content

## Customizing Templates

You can customize the generated documentation by editing the Handlebars templates in the `templates/` directory.

### Custom Package Documentation

Packages can provide custom documentation content by creating a `docs-generator.config.js` file in the package root directory. The following customizations are supported:

```js
module.exports = {
  customData: {
    displayName: `Custom Package Reference`,   // Used for Docusaurus sidebar title
    sections: {
      overview: ``,                            // Custom overview section
      requirements: ``,                        // Custom requirements section
      importing: ``,                           // Custom importing section
    },
    extra: ``,                                 // Additional content
  },
};
```

All properties in the configuration are optional. If a property is not specified, default values will be used.

## Adding Documentation to a New Package

To add documentation generation to a new package:

1. Add the generate-docs script to the package's `package.json`:

```json
{
  "scripts": {
    "generate-docs": "node ../../docs-generator/generate-docs.js"
  }
}
```

2. Ensure the code has proper JSDoc comments for better documentation.

3. Run the generate-docs script to test it.

This package will now be included when running the `generate-docs-all` command. 

## Core Types Documentation

The generator also creates documentation for all types, interfaces, and enums exported from the `@onflow/typedefs` package. This documentation is generated every time you run the generate-docs script for any package, ensuring that the types documentation is always up-to-date.

The types documentation in the `types` directory includes:

- **Interfaces** - Documented with their properties and methods
- **Types** - Documented with their underlying types
- **Enums** - Documented with all their members and values

All type documentation includes JSDoc descriptions when available.

## Integration with Documentation Projects

After generating documentation, copy the `output/packages-docs` directory to the documentation project. This will maintain the folder structure and allow the documentation build system to process the files.

## Notes

- Avoid relative path linking outside of packages-docs folder to avoid docusaurus linking problems. Use only packages-docs relative links or absolute paths.
- If needed to add '{}' curly braces in jsdoc description be sure to properly escape them with a backslash to avoid docusaurus problems.
