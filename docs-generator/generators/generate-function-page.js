const path = require("path")
const {Project} = require("ts-morph")
const fs = require("fs")
const {generatePage, getFirstWord} = require("./utils")
const {stripGenericParams} = require("../utils/type-utils")

// Cache for type structures to avoid repeated processing
const typeStructureCache = new Map()

function getGenericTypeStructure(baseTypeName, packageName, sourceFilePath) {
  // Input validation
  if (!baseTypeName || typeof baseTypeName !== "string") {
    return null
  }

  // Check cache first
  const cacheKey = `${packageName}:${baseTypeName}`
  if (typeStructureCache.has(cacheKey)) {
    return typeStructureCache.get(cacheKey)
  }

  let result = null
  try {
    const project = new Project({skipAddingFilesFromTsConfig: true})

    // Only add necessary source files
    const sourcePaths = []
    if (sourceFilePath) {
      const fullSourcePath = path.resolve(process.cwd(), "../", sourceFilePath)
      if (fs.existsSync(fullSourcePath)) {
        sourcePaths.push(fullSourcePath)
      }
    }

    if (packageName) {
      const packageSrcDir = path.resolve(
        process.cwd(),
        "../",
        packageName,
        "src"
      )
      if (fs.existsSync(packageSrcDir)) {
        sourcePaths.push(`${packageSrcDir}/**/*.ts`)
      }
    }

    // Add source files in batch
    if (sourcePaths.length > 0) {
      try {
        project.addSourceFilesAtPaths(sourcePaths)
      } catch (e) {
        // If batch add fails, try individually
        sourcePaths.forEach(sourcePath => {
          try {
            if (!sourcePath.includes("*")) {
              project.addSourceFileAtPath(sourcePath)
            } else {
              project.addSourceFilesAtPaths(sourcePath)
            }
          } catch (e) {
            // Skip problematic source paths
          }
        })
      }
    }

    // Find the type definition efficiently
    const sourceFiles = project.getSourceFiles()
    for (const sourceFile of sourceFiles) {
      const typeAlias = sourceFile.getTypeAlias(baseTypeName)
      if (typeAlias) {
        result = extractTypeStructure(typeAlias)
        if (result) break // Stop on first successful extraction
      }
    }
  } catch (e) {
    // Fail silently to avoid breaking the docs generation
  }

  // Cache the result (including null results to avoid repeated failures)
  typeStructureCache.set(cacheKey, result)
  return result
}

function extractTypeStructure(typeAlias) {
  try {
    const typeNode = typeAlias.getTypeNode()
    if (!typeNode || typeof typeNode.getProperties !== "function") {
      return null
    }

    const properties = typeNode.getProperties()
    if (properties.length === 0) {
      return null
    }

    const structure = {}

    for (const prop of properties) {
      try {
        const propName = prop.getName()
        if (!propName) continue

        const propType = prop.getType()
        const cleanPropType = propType
          ? extractTypeName(propType.getText())
          : "unknown"

        // Get JSDoc comments efficiently
        let propDescription = ""
        const jsDocComments = prop.getJsDocs()
        if (jsDocComments?.length > 0) {
          propDescription = jsDocComments[0].getDescription()?.trim() || ""
        }

        structure[propName] = {
          type: cleanPropType,
          description: propDescription,
          optional: prop.hasQuestionToken?.() || false,
        }
      } catch (e) {
        // Skip problematic properties but continue processing others
        continue
      }
    }

    return Object.keys(structure).length > 0 ? structure : null
  } catch (e) {
    return null
  }
}

// Basic primitive types that don't need definitions
const PRIMITIVE_TYPES = new Set([
  "string",
  "number",
  "boolean",
  "object",
  "any",
  "void",
  "unknown",
  "never",
  "null",
  "undefined",
])

// Cache for type definitions and core types to avoid repeated lookups
const typeCache = new Map()
const coreTypesCache = new Set()
let hasLoadedCoreTypes = false

// Function to escape MDX-sensitive characters in example code
function escapeMDXCharacters(text) {
  if (!text) return text

  // Handle already escaped curly braces by converting them to inline code
  // This pattern matches things like A.\{AccountAddress\}.\{ContractName\}.\{EventName\}
  text = text.replace(/A\.\\{[^}]+\\}\.\\{[^}]+\\}\.\\{[^}]+\\}/g, match => {
    // Remove the backslashes and wrap in backticks
    const cleanMatch = match.replace(/\\/g, "")
    return `\`${cleanMatch}\``
  })

  // Handle other patterns of escaped curly braces by converting to inline code
  text = text.replace(/\\{[^}]+\\}/g, match => {
    // Remove the backslashes and wrap in backticks
    const cleanMatch = match.replace(/\\/g, "")
    return `\`${cleanMatch}\``
  })

  // Split text by both multi-line code blocks (triple backticks) and inline code (single backticks)
  // This regex captures both patterns while preserving them
  const parts = text.split(/(```[\s\S]*?```|`[^`\n]*`)/g)

  return parts
    .map((part, index) => {
      // Check if this part is a code block (either multi-line or inline)
      const isCodeBlock =
        part.startsWith("```") ||
        (part.startsWith("`") && part.endsWith("`") && !part.includes("\n"))

      if (isCodeBlock) {
        // Don't escape anything inside code blocks (both multi-line and inline)
        return part
      } else {
        // Escape curly braces only outside code blocks
        return part.replace(/(?<!\\)\{/g, "\\{").replace(/(?<!\\)\}/g, "\\}")
      }
    })
    .join("")
}

function extractCoreTypes() {
  if (hasLoadedCoreTypes) return coreTypesCache

  try {
    const typedefsSrcDir = path.join(
      path.resolve(process.cwd(), "../typedefs"),
      "src"
    )
    const project = new Project({skipAddingFilesFromTsConfig: true})
    project.addSourceFilesAtPaths(`${typedefsSrcDir}/**/*.ts`)

    project.getSourceFiles().forEach(sourceFile => {
      sourceFile.getInterfaces().forEach(iface => {
        if (iface.isExported()) coreTypesCache.add(iface.getName())
      })
      sourceFile.getTypeAliases().forEach(typeAlias => {
        if (typeAlias.isExported()) coreTypesCache.add(typeAlias.getName())
      })
      sourceFile.getEnums().forEach(enumDef => {
        if (enumDef.isExported()) coreTypesCache.add(enumDef.getName())
      })
    })

    hasLoadedCoreTypes = true
    return coreTypesCache
  } catch (error) {
    console.warn(`Error extracting core types: ${error.message}`)
    return new Set()
  }
}

function extractTypeName(fullType) {
  if (!fullType) return fullType

  // Clean up import references and comments
  let cleanType = fullType
    .replace(/import\([^)]+\)\./g, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .trim()

  // For union types, preserve the structure
  if (cleanType.includes("|")) {
    return cleanType
  }

  // For simple types without complex structures
  if (
    !cleanType.includes("Promise<") &&
    !cleanType.includes("=>") &&
    !cleanType.includes("{")
  ) {
    return cleanType
  }

  // Handle Promise types
  if (cleanType.startsWith("Promise<")) {
    const innerType = cleanType.match(/Promise<(.+)>/)
    if (innerType && innerType[1]) {
      return `Promise<${extractTypeName(innerType[1])}>`
    }
  }

  // Handle function types
  if (cleanType.includes("=>")) {
    return cleanType
  }

  // Handle array types
  if (cleanType.endsWith("[]")) {
    return `${extractTypeName(cleanType.slice(0, -2))}[]`
  }

  // Handle complex objects - return as is for now
  if (cleanType.includes("{") && cleanType.includes("}")) {
    return cleanType
  }

  return cleanType
}

// Check if a type name exists in the typedefs package
function isTypeInTypedefs(typeName, coreTypes) {
  // Handle Promise<Type> - extract the inner type
  if (typeName.startsWith("Promise<") && typeName.endsWith(">")) {
    const innerType = typeName.slice(8, -1).trim() // Remove Promise< and >
    return coreTypes.has(innerType)
  }

  // Handle Array types - extract the base type
  if (typeName.endsWith("[]")) {
    const baseType = typeName.slice(0, -2).trim()
    return coreTypes.has(baseType)
  }

  // Handle union types - check if any part is in typedefs
  if (typeName.includes("|")) {
    const types = typeName.split("|").map(t => t.trim())
    return types.some(t => coreTypes.has(t))
  }

  return coreTypes.has(typeName)
}

// Check if a type is non-primitive (interface, type alias, or arrow function)
function isNonPrimitiveType(typeString) {
  if (!typeString || PRIMITIVE_TYPES.has(typeString)) {
    return false
  }

  // Remove whitespace for better pattern matching
  const cleanType = typeString.trim()

  // Function types (arrow functions)
  if (cleanType.includes("=>")) {
    return true
  }

  // Object types with properties (inline object types)
  if (cleanType.includes("{") && cleanType.includes(":")) {
    return true
  }

  // Complex union types (more than just primitive types)
  if (cleanType.includes("|")) {
    const unionTypes = cleanType.split("|").map(t => t.trim())
    // If any part of the union is not primitive, show definition
    const hasNonPrimitive = unionTypes.some(
      t =>
        !PRIMITIVE_TYPES.has(t) &&
        !t.match(/^(null|undefined)$/) &&
        (t.match(/^[A-Z][a-zA-Z0-9]*$/) || t.includes("=>") || t.includes("{"))
    )
    if (hasNonPrimitive) return true
  }

  // Generic types like Promise<SomeType>, Array<CustomType>, etc.
  if (cleanType.includes("<") && cleanType.includes(">")) {
    // Extract the inner type from generics
    const genericMatch = cleanType.match(
      /^([A-Za-z][a-zA-Z0-9]*)<(.+)>(\[\])?$/
    )
    if (genericMatch) {
      const [, outerType, innerType] = genericMatch

      // If outer type is Promise, Array, etc., check if inner type is non-primitive
      if (["Promise", "Array"].includes(outerType)) {
        return isNonPrimitiveType(innerType.trim())
      }

      // For other generic types, if the outer type starts with uppercase, it's likely custom
      if (/^[A-Z]/.test(outerType)) {
        return true
      }
    }
    return true // Any other generic type is likely non-primitive
  }

  // Tuple types
  if (
    cleanType.startsWith("[") &&
    cleanType.endsWith("]") &&
    cleanType.includes(",")
  ) {
    return true
  }

  // Mapped types or conditional types
  if (
    cleanType.includes("keyof") ||
    cleanType.includes("extends") ||
    cleanType.includes("infer")
  ) {
    return true
  }

  // Array types with custom base types
  if (cleanType.endsWith("[]")) {
    const baseType = cleanType.slice(0, -2).trim()
    return isNonPrimitiveType(baseType)
  }

  // Custom type names (PascalCase starting with uppercase)
  if (/^[A-Z][a-zA-Z0-9]*$/.test(cleanType)) {
    return true
  }

  // Type names with namespaces (e.g., FCL.SomeType)
  if (/^[A-Z][a-zA-Z0-9]*\.[A-Z][a-zA-Z0-9]*$/.test(cleanType)) {
    return true
  }

  // Function types in different formats
  if (cleanType.match(/^\(.+\)\s*=>/)) {
    return true
  }

  // Constructor types
  if (cleanType.startsWith("new ") && cleanType.includes("=>")) {
    return true
  }

  return false
}

function extractTypeDefinition(sourceFile, node) {
  if (!node) return null

  const text = sourceFile.getFullText().substring(node.getPos(), node.getEnd())

  // Remove comments and extra whitespace
  return text
    .replace(/^[\r\n\s]+/, "") // Trim leading whitespace
    .replace(/[\r\n\s]+$/, "") // Trim trailing whitespace
    .replace(/\/\*\*[\s\S]*?\*\//g, "") // Remove JSDoc comments
    .replace(/\/\*[\s\S]*?\*\//g, "") // Remove multi-line comments
    .replace(/\/\/.*$/gm, "") // Remove single-line comments
    .replace(/\n\s*\n+/g, "\n") // Replace multiple blank lines with a single one
    .trim()
}

function findTypeInFile(sourceFile, typeName) {
  // Check for interface
  const iface = sourceFile.getInterface(typeName)
  if (iface) return extractTypeDefinition(sourceFile, iface)
  // Check for type alias
  const typeAlias = sourceFile.getTypeAlias(typeName)
  if (typeAlias) return extractTypeDefinition(sourceFile, typeAlias)
  // Check for enum
  const enumDef = sourceFile.getEnum(typeName)
  if (enumDef) return extractTypeDefinition(sourceFile, enumDef)

  return null
}

function getTypeDefinition(typeName, packageName, sourceFilePath) {
  if (!typeName || PRIMITIVE_TYPES.has(typeName)) {
    return null
  }

  // Handle Promise and array types - extract base type
  let baseTypeName = typeName
  if (baseTypeName.startsWith("Promise<")) {
    const match = baseTypeName.match(/Promise<(.+)>/)
    if (match) baseTypeName = match[1]
  }
  if (baseTypeName.endsWith("[]")) {
    baseTypeName = baseTypeName.slice(0, -2)
  }

  // Check cache first
  const cacheKey = `${packageName}:${baseTypeName}`
  if (typeCache.has(cacheKey)) {
    return typeCache.get(cacheKey)
  }

  let definition = null

  try {
    // Create a new project for type searching to avoid conflicts
    const project = new Project({skipAddingFilesFromTsConfig: true})

    // First check source file if provided
    if (sourceFilePath) {
      const fullSourcePath = path.resolve(process.cwd(), "../", sourceFilePath)
      if (fs.existsSync(fullSourcePath)) {
        const sourceFile = project.addSourceFileAtPath(fullSourcePath)
        definition = findTypeInFile(sourceFile, baseTypeName)

        // If not found in the source file, check its imports and re-exports
        if (!definition) {
          definition = searchTypeInImports(sourceFile, baseTypeName, project)
        }
      }
    }

    // If not found, search package src directory
    if (!definition) {
      const packageSrcDir = path.resolve(
        process.cwd(),
        "../",
        packageName,
        "src"
      )
      if (fs.existsSync(packageSrcDir)) {
        // Add all TypeScript files in the package
        project.addSourceFilesAtPaths(`${packageSrcDir}/**/*.ts`)

        // Search through all source files in the package
        for (const sourceFile of project.getSourceFiles()) {
          definition = findTypeInFile(sourceFile, baseTypeName)
          if (definition) break
        }
      }
    }

    // If still not found, search in common Flow workspace packages
    if (!definition) {
      definition = searchTypeInWorkspacePackages(baseTypeName, project)
    }

    // Cache the result
    typeCache.set(cacheKey, definition)
    return definition
  } catch (error) {
    console.warn(
      `Error getting type definition for ${typeName}: ${error.message}`
    )
    return null
  }
}

// Helper function to search for types in imports and re-exports
function searchTypeInImports(sourceFile, typeName, project) {
  try {
    // Check import declarations
    const importDeclarations = sourceFile.getImportDeclarations()
    for (const importDecl of importDeclarations) {
      const namedImports = importDecl.getNamedImports()
      const hasImport = namedImports.some(
        namedImport => namedImport.getName() === typeName
      )

      if (hasImport) {
        const moduleSpecifier = importDecl.getModuleSpecifier()
        if (moduleSpecifier) {
          const moduleSpecValue = moduleSpecifier.getLiteralValue()
          const resolvedFile = resolveImportPath(
            sourceFile,
            moduleSpecValue,
            project
          )
          if (resolvedFile) {
            const definition = findTypeInFile(resolvedFile, typeName)
            if (definition) return definition
          }
        }
      }
    }

    // Check export declarations (re-exports)
    const exportDeclarations = sourceFile.getExportDeclarations()
    for (const exportDecl of exportDeclarations) {
      const namedExports = exportDecl.getNamedExports()
      const hasExport = namedExports.some(
        namedExport => namedExport.getName() === typeName
      )

      if (hasExport) {
        const moduleSpecifier = exportDecl.getModuleSpecifier()
        if (moduleSpecifier) {
          const moduleSpecValue = moduleSpecifier.getLiteralValue()
          const resolvedFile = resolveImportPath(
            sourceFile,
            moduleSpecValue,
            project
          )
          if (resolvedFile) {
            const definition = findTypeInFile(resolvedFile, typeName)
            if (definition) return definition
            // Recursively search in the resolved file's imports
            const recursiveDefinition = searchTypeInImports(
              resolvedFile,
              typeName,
              project
            )
            if (recursiveDefinition) return recursiveDefinition
          }
        }
      }
    }

    return null
  } catch (error) {
    console.warn(`Error searching type in imports: ${error.message}`)
    return null
  }
}

// Helper function to resolve import paths
function resolveImportPath(sourceFile, moduleSpecifier, project) {
  try {
    // Handle @onflow/ package imports
    if (moduleSpecifier.startsWith("@onflow/")) {
      const packageName = moduleSpecifier.replace("@onflow/", "")
      const packageDir = path.resolve(process.cwd(), "../", packageName)
      const packageJsonPath = path.join(packageDir, "package.json")

      if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"))
        const entryFile =
          packageJson.source || packageJson.main || "src/index.ts"
        const entryFilePath = path.resolve(packageDir, entryFile)

        if (fs.existsSync(entryFilePath)) {
          let targetFile = project.getSourceFile(entryFilePath)
          if (!targetFile) {
            targetFile = project.addSourceFileAtPath(entryFilePath)
          }
          return targetFile
        }
      }
    }

    // Handle relative imports
    else if (
      moduleSpecifier.startsWith("./") ||
      moduleSpecifier.startsWith("../")
    ) {
      const sourceDir = path.dirname(sourceFile.getFilePath())
      const resolvedPath = path.resolve(sourceDir, moduleSpecifier)

      // Try different extensions
      const possiblePaths = [
        resolvedPath + ".ts",
        resolvedPath + ".d.ts",
        resolvedPath + "/index.ts",
        resolvedPath + "/index.d.ts",
      ]

      for (const possiblePath of possiblePaths) {
        if (fs.existsSync(possiblePath)) {
          let targetFile = project.getSourceFile(possiblePath)
          if (!targetFile) {
            targetFile = project.addSourceFileAtPath(possiblePath)
          }
          return targetFile
        }
      }
    }

    return null
  } catch (error) {
    console.warn(
      `Error resolving import path ${moduleSpecifier}: ${error.message}`
    )
    return null
  }
}

// Helper function to search for types in common workspace packages
function searchTypeInWorkspacePackages(typeName, project) {
  try {
    const workspacePackages = ["sdk", "typedefs", "fcl-core", "types"]

    for (const packageName of workspacePackages) {
      const packageSrcDir = path.resolve(
        process.cwd(),
        "../",
        packageName,
        "src"
      )
      if (fs.existsSync(packageSrcDir)) {
        try {
          project.addSourceFilesAtPaths(`${packageSrcDir}/**/*.ts`)

          for (const sourceFile of project.getSourceFiles()) {
            if (sourceFile.getFilePath().includes(packageName)) {
              const definition = findTypeInFile(sourceFile, typeName)
              if (definition) return definition
            }
          }
        } catch (e) {
          // Continue to next package if this one fails
          console.warn(
            `Could not search in package ${packageName}: ${e.message}`
          )
        }
      }
    }

    return null
  } catch (error) {
    console.warn(`Error searching workspace packages: ${error.message}`)
    return null
  }
}

function processTypeForDisplay(
  typeString,
  coreTypes,
  packageName,
  sourceFilePath
) {
  if (!typeString) {
    return {
      displayType: typeString,
      hasLink: false,
      linkedType: null,
      typeDefinition: null,
    }
  }

  const extractedType = extractTypeName(typeString)

  // Handle union types specially
  if (extractedType.includes("|")) {
    const unionTypes = extractedType.split("|").map(t => t.trim())
    let hasAnyLink = false

    const processedTypes = unionTypes.map(type => {
      if (isTypeInTypedefs(type, coreTypes)) {
        hasAnyLink = true
        let linkType = type
        let linkFragment = type.toLowerCase()

        // Handle Promise<Type> - link to the inner type
        if (type.startsWith("Promise<") && type.endsWith(">")) {
          const innerType = type.slice(8, -1).trim()
          linkFragment = innerType.toLowerCase()
        }

        // Handle Array types
        if (type.endsWith("[]")) {
          const baseType = type.slice(0, -2).trim()
          linkFragment = baseType.toLowerCase()
        }

        return `[\`${type}\`](../types#${linkFragment})`
      } else {
        return `\`${type}\``
      }
    })

    if (hasAnyLink) {
      return {
        displayType: extractedType,
        hasLink: true,
        linkedType: processedTypes.join(" | "),
        typeDefinition: null,
      }
    }
  }

  // Check if type exists in typedefs package
  if (isTypeInTypedefs(extractedType, coreTypes)) {
    let linkType = extractedType
    let linkFragment = extractedType.toLowerCase()

    // Handle Promise<Type> - link to the inner type
    if (extractedType.startsWith("Promise<") && extractedType.endsWith(">")) {
      const innerType = extractedType.slice(8, -1).trim()
      linkFragment = innerType.toLowerCase()
    }

    // Handle Array types
    if (extractedType.endsWith("[]")) {
      const baseType = extractedType.slice(0, -2).trim()
      linkFragment = baseType.toLowerCase()
    }

    // Handle TypeScript utility types - link to the inner type
    const utilityTypeMatch = extractedType.match(
      /^(Partial|Required|Omit|Pick|Record|Exclude|Extract|NonNullable|ReturnType|Parameters|ConstructorParameters|InstanceType|ThisParameterType|OmitThisParameter|ThisType)<(.+)>$/
    )
    if (utilityTypeMatch) {
      const [, utilityType, innerType] = utilityTypeMatch
      const firstTypeParam = innerType.split(",")[0].trim()
      linkFragment = firstTypeParam.toLowerCase()
    }

    return {
      displayType: extractedType,
      hasLink: true,
      linkedType: `[\`${extractedType}\`](../types#${linkFragment})`,
      typeDefinition: null,
    }
  }

  // Check if it's a non-primitive type that should have a definition shown
  if (isNonPrimitiveType(extractedType)) {
    const typeDefinition = getTypeDefinition(
      extractedType,
      packageName,
      sourceFilePath
    )

    // If we found a definition, use it
    if (typeDefinition) {
      return {
        displayType: extractedType,
        hasLink: false,
        linkedType: null,
        typeDefinition: typeDefinition,
      }
    }

    // If no definition found but it's clearly a function type, show it anyway
    if (extractedType.includes("=>")) {
      return {
        displayType: extractedType,
        hasLink: false,
        linkedType: null,
        typeDefinition: extractedType,
      }
    }

    // If no definition found but it looks like an interface/type name,
    // don't show a fallback message - just show nothing
    if (/^[A-Z][a-zA-Z0-9]*$/.test(extractedType)) {
      return {
        displayType: extractedType,
        hasLink: false,
        linkedType: null,
        typeDefinition: null,
      }
    }

    // For other complex types, show them as type definitions
    return {
      displayType: extractedType,
      hasLink: false,
      linkedType: null,
      typeDefinition: extractedType,
    }
  }

  // For primitive types or simple types, just show the type name
  return {
    displayType: extractedType,
    hasLink: false,
    linkedType: null,
    typeDefinition: null,
  }
}

function generateFunctionPage(templates, outputDir, packageName, func) {
  const coreTypes = extractCoreTypes()

  // Escape MDX characters in description
  if (func.description) {
    func.description = escapeMDXCharacters(func.description)
  }

  // Process parameters
  func.parameters = func.parameters.map(param => {
    const typeInfo = processTypeForDisplay(
      param.type,
      coreTypes,
      packageName,
      func.sourceFilePath
    )

    // Check if this is a generic type and try to expand it
    let expandedType = null
    if (param.type.includes("<") && param.type.includes(">")) {
      const baseTypeName = stripGenericParams(param.type)
      // Try to get the structure - if the type doesn't exist, it will return null
      expandedType = getGenericTypeStructure(
        baseTypeName,
        packageName,
        func.sourceFilePath
      )
    }

    // Escape MDX characters in parameter description
    const description = param.description
      ? escapeMDXCharacters(param.description)
      : param.description

    return {
      ...param,
      type: typeInfo.displayType,
      description,
      linkedType: typeInfo.linkedType,
      hasLink: typeInfo.hasLink,
      typeDefinition: typeInfo.typeDefinition,
      expandedType: expandedType,
    }
  })

  // Process return type
  const returnTypeInfo = processTypeForDisplay(
    func.returnType,
    coreTypes,
    packageName,
    func.sourceFilePath
  )

  func.returnType = returnTypeInfo.displayType
  func.returnHasLink = returnTypeInfo.hasLink
  func.linkedType = returnTypeInfo.linkedType
  func.returnTypeDefinition = returnTypeInfo.typeDefinition

  // Generate the page directly in the package folder instead of in a reference subfolder
  const filename = func.name.charAt(0).toLowerCase() + func.name.slice(1)
  generatePage(templates, "function", path.join(outputDir, `${filename}.md`), {
    ...func,
    packageName,
    packageFirstWord: getFirstWord(packageName),
  })
}

module.exports = {generateFunctionPage}
