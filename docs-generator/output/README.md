# Flow Client Library (FCL) Generated Documentation

This directory contains auto-generated documentation for FCL packages in a format compatible with Docusaurus v2.

> **Note:** All generated files in this directory (except this README.md) are git-ignored. This is intentional to avoid committing auto-generated files to the repository.

## Structure

Each package has its own directory with the following structure:

```
/docs-generator/output/[package-name]/
  ├── index.md                  # Main package page
  ├── installation/             # Installation instructions
  │   └── index.md
  └── reference/                # API reference documentation
      ├── index.md              # List of all functions
      ├── functionName1.md      # Individual function documentation
      ├── functionName2.md
      └── ...
```

## Using with Docusaurus

To use these documentation files with your Docusaurus v2 website:

1. Copy the package directories to your Docusaurus project's `docs` directory:

   ```bash
   cp -r ./docs-generator/output/* /path/to/your-docusaurus-site/docs/
   ```

2. Update your Docusaurus `sidebars.js` file to include the new documentation sections:

   ```javascript
   module.exports = {
     docs: [
       {
         type: 'category',
         label: 'SDK',
         items: [
           'sdk/index',
           {
             type: 'category',
             label: 'Installation',
             items: ['sdk/installation/index'],
           },
           {
             type: 'category',
             label: 'Reference',
             items: ['sdk/reference/index', ...], // Add all function references here
           },
         ],
       },
       // Add other packages here
     ],
   };
   ```

## Regenerating Documentation

To generate documentation for all packages with the generate-docs script:

```bash
npm run generate-docs-all
```

To generate documentation for a specific package:

```bash
cd packages/[package-name]
npm run generate-docs
```

The documentation will be generated in the `docs-generator/output/[package-name]` directory.
