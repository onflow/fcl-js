const path = require("path")
const {Node} = require("ts-morph")
const {parseJsDoc} = require("./jsdoc-parser")
const {cleanupTypeText, escapeParameterNameForMDX} = require("./type-utils")

function extractFunctionInfo(
  declaration,
  functionName,
  sourceFile,
  namespace = null
) {
  try {
    let funcInfo = null

    // Handle function declarations
    if (Node.isFunctionDeclaration(declaration)) {
      const jsDocInfo = parseJsDoc(declaration)
      const parameters = declaration.getParameters().map(param => {
        const paramName = param.getName()
        const paramType = cleanupTypeText(param.getType().getText())
        const paramJsDoc = jsDocInfo.params && jsDocInfo.params[paramName]

        return {
          name: escapeParameterNameForMDX(paramName),
          type: paramType,
          required: !param.isOptional(),
          description: paramJsDoc || "",
        }
      })

      const returnType = cleanupTypeText(declaration.getReturnType().getText())
      const filePath = sourceFile.getFilePath()
      const relativeFilePath = path.relative(process.cwd(), filePath)

      funcInfo = {
        name: functionName,
        returnType,
        parameters,
        description: jsDocInfo.description || "",
        customExample: jsDocInfo.example || "",
        sourceFilePath: relativeFilePath,
      }
    }
    // Handle variable declarations with function values
    else if (Node.isVariableDeclaration(declaration)) {
      let jsDocInfo = parseJsDoc(declaration)

      // If no JSDoc found on the declaration, try the parent VariableStatement
      if (!jsDocInfo.description) {
        const parentList = declaration.getParent()
        if (parentList) {
          const parentStatement = parentList.getParent()
          if (parentStatement) {
            jsDocInfo = parseJsDoc(parentStatement)
          }
        }
      }

      const initializer = declaration.getInitializer()

      if (
        initializer &&
        (Node.isFunctionExpression(initializer) ||
          Node.isArrowFunction(initializer))
      ) {
        const parameters = initializer.getParameters().map(param => {
          const paramName = param.getName()
          const paramType = cleanupTypeText(param.getType().getText())
          const paramJsDoc = jsDocInfo.params && jsDocInfo.params[paramName]

          return {
            name: escapeParameterNameForMDX(paramName),
            type: paramType,
            required: !param.isOptional(),
            description: paramJsDoc || "",
          }
        })

        const returnType = cleanupTypeText(
          initializer.getReturnType().getText()
        )
        const filePath = sourceFile.getFilePath()
        const relativeFilePath = path.relative(process.cwd(), filePath)

        funcInfo = {
          name: functionName,
          returnType,
          parameters,
          description: jsDocInfo.description || "",
          customExample: jsDocInfo.example || "",
          sourceFilePath: relativeFilePath,
        }
      }
    }

    // Add namespace if provided
    if (funcInfo && namespace) {
      funcInfo.namespace = namespace
    }

    return funcInfo
  } catch (e) {
    console.warn(
      `Error extracting function info for ${functionName}: ${e.message}`
    )
    return null
  }
}

function findFunctionInSourceFile(sourceFile, functionName) {
  try {
    const exportedDeclarations = sourceFile.getExportedDeclarations()
    if (exportedDeclarations.has(functionName)) {
      const declarations = exportedDeclarations.get(functionName)

      for (const declaration of declarations) {
        const funcInfo = extractFunctionInfo(
          declaration,
          functionName,
          sourceFile
        )
        if (funcInfo) {
          return funcInfo
        }
      }
    }

    return null
  } catch (e) {
    console.warn(
      `Error finding function ${functionName} in source file: ${e.message}`
    )
    return null
  }
}

function resolveReExportedFunction(sourceFile, exportName, moduleSpecifier) {
  try {
    // First try to find the module specifier among imported files
    const referencedSourceFiles = sourceFile.getReferencedSourceFiles()
    let referencedSourceFile = null

    // Find the source file that matches the module specifier
    for (const sf of referencedSourceFiles) {
      const fileName = path.basename(sf.getFilePath(), ".ts")
      const moduleFileName = path.basename(moduleSpecifier, ".ts")

      if (
        fileName === moduleFileName ||
        sf.getFilePath().includes(moduleSpecifier) ||
        sf.getFilePath().includes(moduleSpecifier.replace("./", ""))
      ) {
        referencedSourceFile = sf
        break
      }
    }

    if (referencedSourceFile) {
      return findFunctionInSourceFile(referencedSourceFile, exportName)
    }
    return null
  } catch (e) {
    console.warn(
      `Error resolving re-exported function ${exportName} from ${moduleSpecifier}: ${e.message}`
    )
    return null
  }
}

module.exports = {
  extractFunctionInfo,
  findFunctionInSourceFile,
  resolveReExportedFunction,
}
