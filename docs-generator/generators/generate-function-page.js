const path = require("path")
const {generatePage} = require("./utils")

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
