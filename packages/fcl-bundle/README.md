# FCL-Bundle Overview
FCL-Bundle is a module bundler used internally by FCL which aims to be low configuration and consistent across the monorepo.  FCL-Bundle uses [rollup](https://rollupjs.org/) and generates cjs, esm, and umd formats of the bundled modules.

## CLI Usage

Usage: `fcl-bundle [options]` 

Options:  
  -V, --version  output the version number  
  -w, --watch    Run the build in watch mode  
  -h, --help     display help for command  

## Configuration
All of the configuration for FCL-Bundle currently takes place within the `package.json` of the modules which you wish to bundle.  The following configuration options are available:

| Key    | Required | Value Type | Description                                                                                                                                                                                                                                                                                                                                                                                 |
|----------|----------|------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `source` | Yes      | string     | Specify a source file entry point or an dictionary of [Output Configuration](#output-configuration) objects keyed by respective source files (for multiple builds) - see [Source Configuration](#source-configuration) for more details |
| `main`   | No       | string     | Specify cjs bundle output path if not manually specified by [Output Configuration](#output-configuration) (as well as cjs entry point if not overridden by `package.exports`)                                                                                                                                     |
| `module` | No       | string     | Specify esm bundle output path if not manually specified by [Output Configuration](#output-configuration) (as well as esm entry point if not overriden by `package.exports`)                                                                                                                                      |
| `unpkg`  | No       | string     | Specify umd bundle output path if not manually specified by [Output Configuration](#output-configuration) (as well as umd entry point if not overriden by `package.exports`)                                                                                                                                      |

> **Note:** If output paths end in ".min.js", the resulting bundle will be minified


### Output Configuration

An Output Configuration object exists with the following properties:
| Key    | Required | Value Type | Description                                                                                                                |
|----------|----------|------------|----------------------------------------------------------------------------------------------------------------------------|
| `cjs`    | No       | string     | Path of the cjs output bundle                                                                                              |
| `esm`    | No       | string     | Path of the esm output bundle                                                                                              |
| `umd`    | No       | string     | Path of the umd output bundle                                                                                              |
| `banner` | No       | string     | Either a string representing a banner to be prepended to all output bundles for this build or a [Banner Configuration](#banner-configuration) object |

An empty Output Configuration will fallback to the [default outputs](#default-outputs) if none are provided.  However, if at least one output format is provided, the missing outputs will be excluded from the final build.

In practice, these Output Configuration objects will be consumed as shown in the [Source Configuration](#source-configuration) below.

> **Note:** If output paths end in ".min.js", the resulting bundle will be minified

### Source Configuration

A source configuration can be provided in one of three ways:
1. A `string` identifying the path to the entry source file.  Build outputs will be inferred from either the root level `main`, `module`, and `unpkg` fields or from the [default outputs](#default-outputs) if none are provided.
    ```json
    {
      ...
      "source": "./src/index.js",
    }
    ```
2. An array of entry source files.  Build outputs will be inferred from the [default outputs](#default-outputs).
    ```json
    {
      ...
      "source": [
        "./src/indexA.js",
        "./src/indexB.js"
      ]
    }
    ```

3. A dictionary of [Output Configuration](#output-configuration) objects keyed by respective source files.
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
***Note:*** if no output bundles (cjs,esm,umd) are specifified in either the root of package.json (`main`, `module`, `unpkg`) or an Output Configuration object, the bundler will produce the following defaults:
 - `cjs` -> `dist/${basename(entry)}.js`
 - `esm` -> `dist/${basename(entry)}.module.js`
 - `umd` -> `dist/${basename(entry)}.umd.js`

### Banner Configuration

| Key    | Required | Value Type | Description                                                                                                    |
|----------|----------|------------|----------------------------------------------------------------------------------------------------------------|
| `banner` | Yes      | string     | Text to be displayed in banner                                                                                 |
| `raw`    | No       | boolean    | If false, wraps the banner in JS comment, if true no extra formatting is applied to banner **(default false)** |

## Features
 - Replace `PACKAGE_CURRENT_VERSION` in bundled code with the current `version` of the package being bundled from `package.json`
 - Bundles dependencies with UMD builds for use in browser
 - Transpiles output bundles using `@babel/preset-env` and [babel rollup plugin](https://www.npmjs.com/package/@rollup/plugin-babel)