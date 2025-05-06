const path = require("path")
const {Project} = require("ts-morph")
const {generatePage} = require("./utils")

function getCoreTypes() {
  try {
    // Path to the typedefs package
    const typedefsDir = path.resolve(__dirname, "../../packages/typedefs")
    const typedefsSrcDir = path.join(typedefsDir, "src")

    // Initialize ts-morph project
    const project = new Project({
      skipAddingFilesFromTsConfig: true,
    })
    // Add source files from typedefs package
    project.addSourceFilesAtPaths(`${typedefsSrcDir}/**/*.ts`)
    const sourceFiles = project.getSourceFiles()

    // Extract types, interfaces, and enums names
    const coreTypes = new Set()
    sourceFiles.forEach(sourceFile => {
      sourceFile.getInterfaces().forEach(iface => {
        if (iface.isExported()) {
          coreTypes.add(iface.getName())
        }
      })
      sourceFile.getTypeAliases().forEach(typeAlias => {
        if (typeAlias.isExported()) {
          coreTypes.add(typeAlias.getName())
        }
      })
      sourceFile.getEnums().forEach(enumDef => {
        if (enumDef.isExported()) {
          coreTypes.add(enumDef.getName())
        }
      })
    })
    return coreTypes
  } catch (error) {
    console.warn(`Error extracting core types: ${error.message}`)
    return new Set()
  }
}

function extractTypeName(fullType) {
  // Simple type just return as is
  if (!fullType.includes("import(") && !fullType.includes("Promise<")) {
    // For complex objects with multiple properties, return 'object'
    if (fullType.startsWith("{") && fullType.includes(":")) {
      return "object"
    }
    return fullType
  }
  if (fullType.startsWith("Promise<")) {
    const innerType = fullType.match(/Promise<(.+)>/)
    if (innerType && innerType[1]) {
      return `Promise<${extractTypeName(innerType[1])}>`
    }
  }
  if (fullType.includes("=>")) {
    // For function types, simplify but keep the basic structure
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
  // If it's an import, extract just the type name
  if (fullType.includes("import(")) {
    // Extract the type name after the last dot or closing quote
    const matches = fullType.match(/import\([^)]+\)\.([^.\s<>,]+)/)
    if (matches && matches[1]) {
      return matches[1]
    }

    // If we can't extract using the above pattern, try a more general one
    const lastDotMatch = fullType.match(/\.([^.\s<>,]+)(>|\s|$|,|\|)/)
    if (lastDotMatch && lastDotMatch[1]) {
      return lastDotMatch[1]
    }
  }

  // For complex objects, just return 'object'
  if (fullType.includes("{") && fullType.includes("}")) {
    return "object"
  }
  // For array types, extract the inner type
  if (fullType.endsWith("[]")) {
    const innerType = fullType.slice(0, -2)
    return `${extractTypeName(innerType)}[]`
  }
  // For very complex function types, simplify to "function"
  if (fullType.length > 100 && fullType.includes("=>")) {
    return "function"
  }
  // Otherwise return the original type
  return fullType
}

function addCoreTypeLinks(type, coreTypes) {
  if (!type || !coreTypes.size) return {type, hasLink: false}

  let hasLink = false
  let linkedType = type

  // Check for core types in different patterns
  const findCoreType = typeStr => {
    // For exact matches like "Account"
    for (const coreType of coreTypes) {
      if (typeStr === coreType) {
        return {
          found: true,
          coreType,
          fullType: typeStr,
        }
      }
    }

    // For Promise<CoreType>
    if (typeStr.startsWith("Promise<")) {
      const innerTypeMatch = typeStr.match(/Promise<(.+)>/)
      if (innerTypeMatch && innerTypeMatch[1]) {
        const innerType = innerTypeMatch[1]
        for (const coreType of coreTypes) {
          if (innerType === coreType) {
            return {
              found: true,
              coreType,
              fullType: typeStr,
            }
          }
        }
      }
    }
    // For array types (CoreType[])
    if (typeStr.endsWith("[]")) {
      const baseType = typeStr.slice(0, -2)
      for (const coreType of coreTypes) {
        if (baseType === coreType) {
          return {
            found: true,
            coreType,
            fullType: typeStr,
          }
        }
      }
    }
    return {
      found: false,
    }
  }

  const result = findCoreType(type)
  if (result.found) {
    hasLink = true
    linkedType = `[\`${type}\`](../../../types#${result.coreType.toLowerCase()})`
  }

  return {type, hasLink, linkedType}
}

function escapeParameterName(name) {
  // If the parameter name contains curly braces (object pattern) replace with a simpler name
  if (name.includes("{") || name.includes("}")) {
    return "options"
  }
  return name
}

function generateFunctionPage(templates, outputDir, packageName, func) {
  // Get all core types from typedefs
  const coreTypes = getCoreTypes()

  // Clean up parameter types and add links for core types
  func.parameters = func.parameters.map(param => {
    const extractedType = extractTypeName(param.type)
    const {type, hasLink, linkedType} = addCoreTypeLinks(
      extractedType,
      coreTypes
    )

    return {
      ...param,
      name: escapeParameterName(param.name),
      type: extractedType,
      linkedType,
      hasLink,
    }
  })

  // Clean up return type and add links for core types
  const extractedReturnType = extractTypeName(func.returnType)
  const {
    type,
    hasLink: returnHasLink,
    linkedType,
  } = addCoreTypeLinks(extractedReturnType, coreTypes)

  func.returnType = extractedReturnType
  func.linkedType = linkedType
  func.returnHasLink = returnHasLink

  const context = {
    ...func,
    packageName,
  }

  // Create a filename with lowercase first letter
  const filename = func.name.charAt(0).toLowerCase() + func.name.slice(1)

  generatePage(
    templates,
    "function",
    path.join(outputDir, "reference", `${filename}.md`),
    context
  )
}

module.exports = {generateFunctionPage}
