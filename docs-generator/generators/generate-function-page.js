const path = require("path")
const {Project} = require("ts-morph")
const fs = require("fs")
const {generatePage} = require("./utils")

// Basic types that don't need definitions
const BASIC_TYPES = new Set([
  "string",
  "number",
  "boolean",
  "object",
  "any",
  "void",
  "function",
  "unknown",
  "never",
  "null",
  "undefined",
])

// Cache for type definitions and core types to avoid repeated lookups
const typeCache = new Map()
const coreTypesCache = new Set()
let hasLoadedCoreTypes = false

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

  // For arrays with union types, preserve the original type structure
  if (
    fullType.includes("|") &&
    fullType.includes("[") &&
    fullType.includes("]")
  ) {
    // Clean up import references but maintain the union structure
    return fullType
      .replace(/import\([^)]+\)\./g, "")
      .replace(/\/\*[\s\S]*?\*\//g, "")
  }
  // For union types, preserve the structure but clean up imports
  if (fullType.includes("|")) {
    return fullType
      .replace(/import\([^)]+\)\./g, "")
      .replace(/\/\*[\s\S]*?\*\//g, "")
  }

  // For simple types
  if (!fullType.includes("import(") && !fullType.includes("Promise<")) {
    return fullType.startsWith("{") && fullType.includes(":")
      ? "object"
      : fullType
  }
  // Handle Promise types
  if (fullType.startsWith("Promise<")) {
    const innerType = fullType.match(/Promise<(.+)>/)
    if (innerType && innerType[1])
      return `Promise<${extractTypeName(innerType[1])}>`
  }
  // Handle function types
  if (fullType.includes("=>")) {
    if (fullType.length > 100) return "function"
    return fullType
      .replace(/import\([^)]+\)\.[^.\s]+/g, match => {
        const typeMatch = match.match(/\.([^.\s]+)$/)
        return typeMatch ? typeMatch[1] : "any"
      })
      .replace(/Promise<import\([^)]+\)\.[^.\s]+>/g, match => {
        const typeMatch = match.match(/\.([^.\s]+)>$/)
        return typeMatch ? `Promise<${typeMatch[1]}>` : "Promise<any>"
      })
  }
  // Handle import types
  if (fullType.includes("import(")) {
    const matches = fullType.match(/import\([^)]+\)\.([^.\s<>,]+)/)
    if (matches && matches[1]) return matches[1]

    const lastDotMatch = fullType.match(/\.([^.\s<>,]+)(>|\s|$|,|\|)/)
    if (lastDotMatch && lastDotMatch[1]) return lastDotMatch[1]
  }
  // Handle array types
  if (fullType.endsWith("[]")) {
    return `${extractTypeName(fullType.slice(0, -2))}[]`
  }
  // Handle complex objects
  if (fullType.includes("{") && fullType.includes("}")) return "object"

  return fullType
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
  if (!typeName || BASIC_TYPES.has(typeName) || typeName.includes("=>")) {
    return null
  }

  // Handle Promise and array types
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
    // First check source file if provided
    if (sourceFilePath) {
      const fullSourcePath = path.resolve(process.cwd(), "../", sourceFilePath)
      if (fs.existsSync(fullSourcePath)) {
        const project = new Project({skipAddingFilesFromTsConfig: true})
        const sourceFile = project.addSourceFileAtPath(fullSourcePath)
        definition = findTypeInFile(sourceFile, baseTypeName)
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
        const project = new Project({skipAddingFilesFromTsConfig: true})
        project.addSourceFilesAtPaths(`${packageSrcDir}/**/*.ts`)

        for (const sourceFile of project.getSourceFiles()) {
          definition = findTypeInFile(sourceFile, baseTypeName)
          if (definition) break
        }
      }
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

function generateFunctionPage(templates, outputDir, packageName, func) {
  const coreTypes = extractCoreTypes()

  // Process parameters
  func.parameters = func.parameters.map(param => {
    const extractedType = extractTypeName(param.type)
    const paramName =
      param.name.includes("{") || param.name.includes("}")
        ? "options"
        : param.name

    // Check if it's a core type or Promise<CoreType>
    let hasLink = false
    let linkedType = null
    let baseType = extractedType

    // Handle Promise<CoreType> case
    if (baseType.startsWith("Promise<")) {
      const match = baseType.match(/Promise<(.+)>/)
      if (match && match[1]) {
        const innerType = match[1]
        if (coreTypes.has(innerType)) {
          hasLink = true
          linkedType = `[\`${baseType}\`](../types#${innerType.toLowerCase()})`
        }
      }
    }
    // Handle regular core type
    else if (coreTypes.has(baseType)) {
      hasLink = true
      linkedType = `[\`${baseType}\`](../types#${baseType.toLowerCase()})`
    }

    // Get type definition if not a core type or Promise<CoreType>
    const typeDefinition = !hasLink
      ? getTypeDefinition(extractedType, packageName, func.sourceFilePath)
      : null

    return {
      ...param,
      name: paramName,
      type: extractedType,
      linkedType,
      hasLink,
      typeDefinition,
    }
  })

  // Process return type
  const extractedReturnType = extractTypeName(func.returnType)
  let returnHasLink = false
  let linkedType = null

  // Handle Promise<CoreType> in return type
  if (extractedReturnType.startsWith("Promise<")) {
    const match = extractedReturnType.match(/Promise<(.+)>/)
    if (match && match[1]) {
      const innerType = match[1]
      if (coreTypes.has(innerType)) {
        returnHasLink = true
        linkedType = `[\`${extractedReturnType}\`](../types#${innerType.toLowerCase()})`
      }
    }
  }
  // Handle regular core type in return type
  else if (coreTypes.has(extractedReturnType)) {
    returnHasLink = true
    linkedType = `[\`${extractedReturnType}\`](../types#${extractedReturnType.toLowerCase()})`
  }

  func.returnType = extractedReturnType
  func.returnHasLink = returnHasLink
  func.linkedType = linkedType

  // Only get return type definition if it's not a core type or Promise<CoreType>
  if (!returnHasLink) {
    func.returnTypeDefinition = getTypeDefinition(
      extractedReturnType,
      packageName,
      func.sourceFilePath
    )
  } else {
    func.returnTypeDefinition = null
  }

  // Generate the page directly in the package folder instead of in a reference subfolder
  const filename = func.name.charAt(0).toLowerCase() + func.name.slice(1)
  generatePage(templates, "function", path.join(outputDir, `${filename}.md`), {
    ...func,
    packageName,
  })
}

module.exports = {generateFunctionPage}
