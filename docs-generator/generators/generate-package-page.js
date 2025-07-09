const path = require("path")
const {generatePage, parseConfigCustomData, getFirstWord} = require("./utils")
const fs = require("fs")

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

function getPackageDescription(packageName) {
  try {
    const packageJsonPath = path.resolve(process.cwd(), "package.json")
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"))
      return packageJson.description || ""
    }
  } catch (error) {
    console.warn(
      `Error reading package.json for ${packageName}: ${error.message}`
    )
  }
  return ""
}

function generatePackagePage(
  templates,
  outputDir,
  packageName,
  functions,
  namespaces = [],
  allNamespaceFunctions = []
) {
  const configPath = path.resolve(process.cwd(), "docs-generator.config.js")
  const {displayName, sections, extra} = parseConfigCustomData(configPath)
  const packageDescription = getPackageDescription(packageName)

  // Combine regular functions with namespace functions for the API reference
  const allFunctions = [...functions, ...allNamespaceFunctions]

  // Deduplicate functions with the same name
  const uniqueFunctions = []
  const seenFunctionNames = new Set()
  allFunctions.forEach(func => {
    if (!seenFunctionNames.has(func.name)) {
      seenFunctionNames.add(func.name)
      uniqueFunctions.push(func)
    }
  })

  // Process namespaces for display
  const processedNamespaces = namespaces.map(namespace => ({
    ...namespace,
    displayDescription: truncateDescription(namespace.description), // Only truncate for display
    type: "namespace", // Mark as namespace for sorting
    isNamespace: true, // Add boolean flag for template
    displayName: namespace.name,
    filePath: `./${namespace.name.charAt(0).toLowerCase() + namespace.name.slice(1)}.md`,
  }))

  // Process functions for display
  const processedFunctions = uniqueFunctions.map(func => ({
    ...func,
    lowercase_name: func.name.charAt(0).toLowerCase() + func.name.slice(1),
    displayDescription: truncateDescription(func.description), // Only truncate for display
    type: "function", // Mark as function for sorting
    isNamespace: false, // Add boolean flag for template
    displayName: func.namespace ? `${func.namespace}.${func.name}` : func.name,
    filePath: func.namespace
      ? `./${func.namespace.charAt(0).toLowerCase() + func.namespace.slice(1)}.md#${func.name}`
      : `./${func.name.charAt(0).toLowerCase() + func.name.slice(1)}.md`,
  }))

  // Combine functions and namespaces for unified sorting
  const allApiItems = [...processedFunctions, ...processedNamespaces]

  // Sort all items alphabetically, case insensitively
  allApiItems.sort((a, b) =>
    a.displayName.toLowerCase().localeCompare(b.displayName.toLowerCase())
  )

  generatePage(templates, "package", path.join(outputDir, "index.md"), {
    packageName,
    packageFirstWord: getFirstWord(packageName),
    displayName: displayName || `@onflow/${packageName}`,
    displayDescription:
      packageDescription || `${packageName} package documentation.`,
    customOverview: sections.overview,
    customRequirements: sections.requirements,
    customImporting: sections.importing,
    extra,
    functions: uniqueFunctions, // Keep original functions with full descriptions for individual pages
    namespaces: processedNamespaces,
    allApiItems, // Use processed items with truncated descriptions for the index
  })
}

module.exports = {generatePackagePage}
