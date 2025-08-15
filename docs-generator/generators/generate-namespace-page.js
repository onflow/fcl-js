const path = require("path")
const fs = require("fs")
const {Project} = require("ts-morph")
const {generatePage, getFirstWord} = require("./utils")

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

  // Function types (arrow functions)
  if (typeString.includes("=>")) {
    return true
  }

  // Object types with properties
  if (typeString.includes("{") && typeString.includes(":")) {
    return true
  }

  // Complex union types
  if (typeString.includes("|") && typeString.length > 20) {
    return true
  }

  // If it's not a primitive type and is a single word (likely an interface/type alias name)
  // that starts with uppercase (TypeScript convention), it's probably a custom type
  if (/^[A-Z][a-zA-Z0-9]*(\[\])?$/.test(typeString)) {
    return true
  }

  // Generic types like Promise<SomeType> where SomeType is not primitive
  if (typeString.startsWith("Promise<") && typeString.endsWith(">")) {
    const innerType = typeString.slice(8, -1).trim()
    return isNonPrimitiveType(innerType)
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

    return {
      displayType: extractedType,
      hasLink: false,
      linkedType: null,
      typeDefinition: typeDefinition || extractedType, // Show the type itself if no definition found
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

function processFunction(func, packageName, coreTypes) {
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

  return func
}

function truncateDescription(description, maxLength = 80) {
  if (!description || description.length <= maxLength) {
    // Still normalize whitespace even for short descriptions
    return description ? description.replace(/\s+/g, " ").trim() : description
  }

  // Remove line breaks and normalize whitespace
  const normalizedDescription = description.replace(/\s+/g, " ").trim()

  // Find the last space before the maxLength to avoid cutting words
  let truncateAt = maxLength
  const lastSpace = normalizedDescription.lastIndexOf(" ", maxLength)
  if (lastSpace > maxLength * 0.8) {
    // Only use space if it's not too far back
    truncateAt = lastSpace
  }

  return normalizedDescription.substring(0, truncateAt).trim() + "..."
}

function generateNamespacePage(templates, outputDir, packageName, namespace) {
  const coreTypes = extractCoreTypes()

  // Deduplicate functions with the same name
  const uniqueFunctions = []
  const seenFunctionNames = new Set()
  namespace.functions.forEach(func => {
    if (!seenFunctionNames.has(func.name)) {
      seenFunctionNames.add(func.name)
      uniqueFunctions.push(func)
    }
  })

  // Sort functions alphabetically, case insensitively
  uniqueFunctions.sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  )

  // Process each function to add type definitions and links
  const processedFunctions = uniqueFunctions.map(func => {
    const processedFunc = processFunction(func, packageName, coreTypes)
    // Add lowercase_name property for use in templates
    processedFunc.lowercase_name =
      func.name.charAt(0).toLowerCase() + func.name.slice(1)
    return processedFunc
  })

  // Generate lowercase filename like functions
  const filename =
    namespace.name.charAt(0).toLowerCase() + namespace.name.slice(1)

  generatePage(templates, "namespace", path.join(outputDir, `${filename}.md`), {
    packageName,
    packageFirstWord: getFirstWord(packageName),
    namespaceName: namespace.name,
    namespaceDescription: namespace.description,
    functions: processedFunctions,
  })
}

module.exports = {generateNamespacePage}
