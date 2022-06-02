const {rollup} = require("rollup")
const {resolve} = require("path")
const {existsSync, mkdirSync} = require("fs")
const {nodeResolve} = require("@rollup/plugin-node-resolve")
const commonjs = require("@rollup/plugin-commonjs")
const replace = require("@rollup/plugin-replace")

module.exports = async (build, package) => {
  const inputOptions = {
    input: build.source,
    plugins: [
      nodeResolve(),
      commonjs(),
      replace({
        MICROBUNDLE_CURRENT_VERSION: JSON.stringify(package.version),
      }),
    ],
  }

  let bundle, buildError
  try {
    bundle = await rollup(inputOptions)

    await generateOutputs(bundle, build.outputs)
  } catch (error) {
    buildError = error
  } finally {
    if (bundle) {
      await bundle.close()
    }
  }

  if (buildError) {
    throw new Error(buildError)
  }
}

function generateOutputs(bundle, outputs) {
  return Promise.all(
    outputs.map(async build => {
      if (!existsSync(build.dir)) mkdirSync(build.dir)

      let outputOptions = {
        file: resolve(build.dir, build.entry),
        format: build.type,
        preserveModules: false,
        sourcemap: true,
      }

      switch (build.type) {
        case "umd":
          outputOptions = {
            ...outputOptions,
            preserveModules: false,
            name: "umdtest",
          }
      }

      // generate output specific code in-memory
      // you can call this function multiple times on the same bundle object
      // replace bundle.generate with bundle.write to directly write to disk
      const {output} = await bundle.write(outputOptions)

      for (const chunkOrAsset of output) {
        if (chunkOrAsset.type === "asset") {
          // For assets, this contains
          // {
          //   fileName: string,              // the asset file name
          //   source: string | Uint8Array    // the asset source
          //   type: 'asset'                  // signifies that this is an asset
          // }
          //console.log("Asset", chunkOrAsset)
        } else {
          // For chunks, this contains
          // {
          //   code: string,                  // the generated JS code
          //   dynamicImports: string[],      // external modules imported dynamically by the chunk
          //   exports: string[],             // exported variable names
          //   facadeModuleId: string | null, // the id of a module that this chunk corresponds to
          //   fileName: string,              // the chunk file name
          //   implicitlyLoadedBefore: string[]; // entries that should only be loaded after this chunk
          //   imports: string[],             // external modules imported statically by the chunk
          //   importedBindings: {[imported: string]: string[]} // imported bindings per dependency
          //   isDynamicEntry: boolean,       // is this chunk a dynamic entry point
          //   isEntry: boolean,              // is this chunk a static entry point
          //   isImplicitEntry: boolean,      // should this chunk only be loaded after other chunks
          //   map: string | null,            // sourcemaps if present
          //   modules: {                     // information about the modules in this chunk
          //     [id: string]: {
          //       renderedExports: string[]; // exported variable names that were included
          //       removedExports: string[];  // exported variable names that were removed
          //       renderedLength: number;    // the length of the remaining code in this module
          //       originalLength: number;    // the original length of the code in this module
          //       code: string | null;       // remaining code in this module
          //     };
          //   },
          //   name: string                   // the name of this chunk as used in naming patterns
          //   referencedFiles: string[]      // files referenced via import.meta.ROLLUP_FILE_URL_<id>
          //   type: 'chunk',                 // signifies that this is a chunk
          // }
          //console.log("Chunk", chunkOrAsset.modules)
        }
      }
    })
  )
}
