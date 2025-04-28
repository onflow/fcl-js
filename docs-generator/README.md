# Documentation Generator

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

### JSDoc Support

The documentation generator extracts information from JSDoc comments in your code. You can add JSDoc comments to improve the generated documentation:

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
    "generate-docs": "node ../../docs-generator/generate-docs.js <packageName>"
  }
}
```

Where `<packageName>` is the name of the package (e.g., "sdk")

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
3. Generate documentation in the `/docs-generator/output/<package-name>` directory

## Output Structure

The generated documentation follows this structure for each package:

```
/docs-generator/output/<package-name>/
  ├── index.md                  # Main package page
  ├── installation/             # Installation instructions
  │   └── index.md
  └── reference/                # API reference documentation
      ├── index.md              # List of all functions
      ├── functionName1.md      # Individual function documentation
      ├── functionName2.md
      └── ...
```

All generated files (except README.md) are ignored by git.

## Customizing Templates

You can customize the generated documentation by editing the Handlebars templates in the `templates/` directory.

### Custom Package Documentation

Packages can provide custom documentation content by creating a `docs-generator.config.js` file in the package root directory. The following customizations are supported:

```js
module.exports = {
  customData: {
    packageIndex: {
      overview: ``,
    },
    installation: {
      requirements: ``,
      importing: ``,
      extra: ``,
    },
  },
};
```

## Adding Documentation to a New Package

To add documentation generation to a new package:

1. Add the generate-docs script to the package's `package.json`:

```json
{
  "scripts": {
    "generate-docs": "node ../../docs-generator/generate-docs.js your-package-name"
  }
}
```

2. Ensure your code has proper JSDoc comments for better documentation.

3. Run the generate-docs script to test it.

This package will now be included when running the `generate-docs-all` command. 