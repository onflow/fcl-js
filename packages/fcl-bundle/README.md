# FCL-Build Overview
FCL-Build is a module bundler used internally by FCL which aims to be low configuration and consistent across the monorepo.  FCL-Build uses [rollup](https://rollupjs.org/) and generates cjs, esm, and umd formats of the bundled modules.

## CLI Usage

Usage: `fcl-build [options]` 

Options:  
  -V, --version  output the version number  
  -w, --watch    Run the build in watch mode  
  -h, --help     display help for command  

## Configuration
All of the configuration for FCL-Build currently takes place within the `package.json` of the modules which you wish to bundle.  The following configuration options are available:

 - `source` **(required)** - Specify a source file entry point or an dictionary of [Output Configuration](https://github.com/onflow/fcl-js/tree/master/packages/fcl-build/README.md#output-configuration) objects keyed by respective source files (for multiple builds) - see [Source Configuration](https://github.com/onflow/fcl-js/tree/master/packages/fcl-build/README.md#source-configuration) for more details
 - `main` - Specify cjs bundle output path if not manually specified by [Output Configuration](https://github.com/onflow/fcl-js/tree/master/packages/fcl-build/README.md#output-configuration) (as well as cjs entry point if not overriden by `package.exports`)
 - `module` Specify esm bundle output path if not manually specified by [Output Configuration](https://github.com/onflow/fcl-js/tree/master/packages/fcl-build/README.md#output-configuration) (as well as esm entry point if not overriden by `package.exports`) 
 - `unpkg` Specify umd bundle output path if not manually specified by [Output Configuration](https://github.com/onflow/fcl-js/tree/master/packages/fcl-build/README.md#output-configuration) (as well as umd entry point if not overriden by `package.exports`) 

### Output Configuration

An Output Configuration object exists with the following properties:
  - `cjs` *(optional)* - Path of the cjs output bundle 
  - `esm` *(optional)* - Path of the esm output bundle
  - `umd` *(optional)* - Path of the umd output bundle

An empty Output Configuration will fallback to the [default outputs](https://github.com/onflow/fcl-js/tree/master/packages/fcl-build/README.md#default-outputs) if none are provided.  However, if at least one output format is provided, the missing outputs will be excluded from the final build.

In practice, these Output Configuration objects will be consumed as shown in the [Source Configuration](https://github.com/onflow/fcl-js/tree/master/packages/fcl-build/README.md#source-configuration) below.

### Source Configuration

A source configuration can be provided in one of three ways:
1. A `string` identifying the path to the entry source file.  Build outputs will be inferred from either the root level 
    ```json
    {
      ...
      "source": "./src/index.js",
    }
    ```
2. An array of entry source files.  Build outputs will be inferred from [default outputs](https://github.com/onflow/fcl-js/tree/master/packages/fcl-build/README.md#default-outputs).
    ```json
    {
      ...
      "source": [
        "./src/indexA.js",
        "./src/indexB.js"
      ]
    }
    ```

3. A dictionary of [Output Configuration](https://github.com/onflow/fcl-js/tree/master/packages/fcl-build/README.md#output-configuration) objects keyed by respective source files.
    ```json
    {
      ...
      "source": {
        "./src/indexA.js": {
          "cjs": "./dist/indexA.js"
        },
        "./src/indexB.js": {
          "cjs": "./dist/indexB.js",
          "esm": "./dist/indexB.module.js"
        },
        "./src/indexC.js": {
          "cjs": "./dist/indexC.js",
          "esm": "./dist/indexC.module.js",
          "umd": "./dist/indexC.umd.js"
        }
      }
    }
    ```
    
### Default Outputs
***Note:*** if no output bundles (cjs,esm,umd) are specifified in either the root of package.json or an Output Configuration, the bundler will produce the following defaults:
 - `cjs` -> `dist/${basename(entry)}.js`
 - `esm` -> `dist/${basename(entry)}.module.js`
 - `umd` -> `dist/${basename(entry)}.umd.js`

## Features
 - Replace `PACKAGE_CURRENT_VERSION` in bundled code with the current `version` of the package being bundled from `package.json`
 - Bundles dependencies with UMD builds for use in browser
 - Source map bundled dependencies (uses [sourcemap plugin for rollup](https://www.npmjs.com/package/rollup-plugin-sourcemaps)).  This is only relevant for UMD builds as dependencies are not bundled in other builds
 - Transpiles output bundles using `@babel/preset-env` and [babel rollup plugin](https://www.npmjs.com/package/@rollup/plugin-babel)