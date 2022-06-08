# FCL-Build Overview
FCL-Build is a module bundler used internally by FCL which aims to be low configuration and consistent across the monorepo.  FCL-Build uses [rollup](https://rollupjs.org/) and generates cjs, esm, and umd formats of the bundled modules.

## CLI Usage

Usage: `fcl-build [options]` 

Options:  
  -V, --version  output the version number  
  -w, --watch    Run the build in watch mode  
  -h, --help     display help for command  

## Configuration
All of the configuration for FCL-Build currently takes place withing the `package.json` of the modules which you wish to bundle.  The following configuration options are available:

 - `build` / `builds` **(required)** - Specify a [BuildConfiguration](https://github.com/onflow/fcl-js/tree/master/packages/fcl-build/README.md#buildconfiguration) object or an array of [BuildConfiguration](https://github.com/onflow/fcl-js/tree/master/packages/fcl-build/README.md#buildconfiguration) objects
 - `main` - Specify cjs bundle output path if not specified by [BuildConfiguration](https://github.com/onflow/fcl-js/tree/master/packages/fcl-build/README.md#buildconfiguration) (as well as cjs entry point if not overriden by `package.exports`)
 - `module` Specify esm bundle output path if not specified by [BuildConfiguration](https://github.com/onflow/fcl-js/tree/master/packages/fcl-build/README.md#buildconfiguration) (as well as esm entry point if not overriden by `package.exports`) 
 - `unpkg` Specify umd bundle output path if not specified by [BuildConfiguration](https://github.com/onflow/fcl-js/tree/master/packages/fcl-build/README.md#buildconfiguration) (as well as umd entry point if not overriden by `package.exports`) 

### BuildConfiguration

A build configuration object is provided as any one of, or an array of (for multiple builds), these three things:
1. A `string` identifying the path to the entry source file: I.e.
    ```json
    {
      ...
      "build": "./src/index.js",
    }
    ```
2. As an object with the following properties
    - `source` **(required)** - Entry source file of the build
    - `cjs` *(optional)* - Path of the cjs output bundle 
    - `esm` *(optional)* - Path of the esm output bundle
    - `umd` *(optional)* - Path of the umd output bundle  
   <br />

   Some examples:  

    ```json
    {
      ...
      "build": {
        "source": "./src/index.js",
        "cjs": "./dist/index.js",
        "esm": "./dist/index.module.js",
        "umd": "./dist/index.umd.js"
      }
    }

    {
      ...
      "builds": [
        {
          "source": "./src/indexA.js",
          "cjs": "./dist/indexA.js"
        },
        {
          "source": "./src/indexB.js",
          "cjs": "./dist/indexB.js",
          "esm": "./dist/indexB.module.js"
        }
      ]
    }

    ```
3. An object containing several builds whose keys are entry source files to the build and whose values are the remaining properties excluding `source` above.  For instance:
    ```json
    {
      ...
      "build": {
        "./src/indexA.js": {
          "cjs": "./dist/indexA.js"
        },
        "./src/indexB.js": {
          "cjs": "./dist/indexB.js",
          "esm": "./dist/indexB.module.js",
        }
      }
    }
    ```
    

***Note:*** if no output bundles (cjs,esm,umd) are specifified in either the root of package.json or the BuildConfiguration, the bundler will produce the following defaults:
 - `cjs` -> `dist/${basename(entry)}.js`
 - `esm` -> `dist/${basename(entry)}.module.js`
 - `umd` -> `dist/${basename(entry)}.umd.js`

## Features
 - Replace `PACKAGE_CURRENT_VERSION` in bundled code with the current `version` of the package being bundled from `package.json`
 - Bundles dependencies with UMD builds for use in browser
 - Source map bundled dependencies (uses [sourcemap plugin for rollup](https://www.npmjs.com/package/rollup-plugin-sourcemaps)).  This is only relevant for UMD builds as dependencies are not bundled in other builds
 - Transpiles output bundles using `@babel/preset-env`