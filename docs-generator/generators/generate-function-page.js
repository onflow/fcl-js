const path = require("path")
const {generatePage} = require("./utils")

function extractTypeName(fullType) {
  // Simple type just return as is
  if (!fullType.includes("import(") && !fullType.includes("Promise<")) {
    // For complex objects with multiple properties, return 'object'
    if (fullType.startsWith("{") && fullType.includes(":")) {
      return "object"
    }
    return fullType
  }

  // Handle Promise types
  if (fullType.startsWith("Promise<")) {
    const innerType = fullType.match(/Promise<(.+)>/)
    if (innerType && innerType[1]) {
      return `Promise<${extractTypeName(innerType[1])}>`
    }
  }

  // Handle function types
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

// Function to escape curly braces in parameter names for Docusaurus MDX compatibility
function escapeParameterName(name) {
  // If the parameter name contains curly braces (object pattern), replace with a simpler name
  if (name.includes("{") || name.includes("}")) {
    return "options"
  }
  return name
}

function generateUsageExample(functionName, parameters) {
  const paramAssignments = parameters
    .map(param => {
      const {name, type} = param
      if (type.includes("string")) return `const ${name} = "example"`
      if (type.includes("number")) return `const ${name} = 123`
      if (type.includes("boolean")) return `const ${name} = true`
      if (type.includes("object") || type.includes("{}"))
        return `const ${name} = {}`
      if (type.includes("[]")) return `const ${name} = []`
      if (type.includes("=>") || type.includes("function"))
        return `const ${name} = () => {}`
      return `const ${name} = null // Replace with appropriate value`
    })
    .join("\n")

  const paramsList = parameters.map(param => param.name).join(", ")

  return `${paramAssignments}
  ${paramAssignments ? "\n" : ""}const result = ${functionName}(${paramsList})`
}

function generateFunctionPage(templates, outputDir, packageName, func) {
  // Generate usage example if custom example is not provided
  if (!func.customExample) {
    func.usageExample = generateUsageExample(func.name, func.parameters)
  }

  // Clean up parameter types
  func.parameters = func.parameters.map(param => ({
    ...param,
    name: escapeParameterName(param.name),
    type: extractTypeName(param.type),
  }))

  // Clean up return type
  func.returnType = extractTypeName(func.returnType)

  const context = {
    ...func,
    packageName,
  }

  generatePage(
    templates,
    "function",
    path.join(outputDir, "reference", `${func.name}.md`),
    context
  )
}

module.exports = {generateFunctionPage}
