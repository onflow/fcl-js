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
- Package index page listing all available packages
- Core types documentation from the @onflow/typedefs package

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
3. Generate documentation in the `/docs-generator/output/fcl-docs/packages/<package-name>` directory
4. Create a packages index page at `/docs-generator/output/fcl-docs/packages/index.md`
5. Generate core types documentation in `/docs-generator/output/fcl-docs/types/index.md`

## Output Structure

The generated documentation follows this structure:

```
/docs-generator/output/
  └── fcl-docs/                 # Main documentation directory for Docusaurus
      ├── packages/             # All packages documentation
      │   ├── index.md          # Packages index page
      │   ├── package-a/        # Documentation for package-a
      │   │   ├── index.md      # Main package page
      │   │   ├── installation/ # Installation instructions
      │   │   │   └── index.md
      │   │   └── reference/    # API reference documentation
      │   │       ├── index.md  # List of all functions
      │   │       ├── functionName1.md
      │   │       └── ...
      │   ├── package-b/
      │   └── ...
      └── types/                # Core types documentation
          └── index.md          # Types reference page with interfaces, type aliases, and enums
```

This structure makes it easy to copy the entire `fcl-docs` directory into your Docusaurus project.

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

2. Ensure your code has proper JSDoc comments for better documentation.

3. Run the generate-docs script to test it.

This package will now be included when running the `generate-docs-all` command. 

## Core Types Documentation

The generator also creates documentation for all types, interfaces, and enums exported from the `@onflow/typedefs` package. This documentation is generated every time you run the generate-docs script for any package, ensuring that the types documentation is always up-to-date.

The types documentation includes:

- Interfaces with their properties and methods
- Type aliases with their underlying types
- Enums with all their members and values

All type documentation includes JSDoc descriptions when available.

## Integration with Docusaurus

After generating documentation, you can copy the entire `fcl-docs` directory to your Docusaurus project's `docs` directory. This will maintain the folder structure and allow Docusaurus to build the complete documentation site. 

## Automated Documentation Generation

The repository includes a GitHub Actions workflow that automatically generates and publishes documentation when changes are merged to the master branch. This ensures that the documentation is always up-to-date with the latest code.

### Workflow Overview

The workflow (`/.github/workflows/generate-docs.yml`) performs the following steps:

1. Checks out the FCL JS repository
2. Sets up Node.js and installs dependencies
3. Runs the documentation generation script
4. Checks out the onflow/docs repository
5. Creates a new branch in the docs repository
6. Copies the generated documentation to the appropriate location
7. Commits and pushes the changes
8. Creates a pull request in the onflow/docs repository

The generated branch name and PR will include the commit hash from the FCL JS master branch for easy tracking.

### Required Setup

For the documentation workflow to function correctly, you need to set up the following GitHub repository secret:

- **DOCS_REPO_TOKEN**: A GitHub personal access token with permissions to create branches and pull requests in the `onflow/docs` repository.
