function cleanupTypeText(typeText) {
  if (!typeText) return typeText

  // Remove import paths and keep only the type name
  let cleaned = typeText.replace(/import\("([^"]+)"\)\.([^.\s<>,\[\]]+)/g, "$2")
  // Clean up Promise types with imports
  cleaned = cleaned.replace(
    /Promise<import\("([^"]+)"\)\.([^.\s<>,\[\]]+)>/g,
    "Promise<$2>"
  )
  // Remove any remaining file system paths
  cleaned = cleaned.replace(/\/[^"]*\/([^"\/]+)"/g, '"$1"')
  // Clean up array types
  cleaned = cleaned.replace(
    /import\("([^"]+)"\)\.([^.\s<>,\[\]]+)\[\]/g,
    "$2[]"
  )

  return cleaned
}

function toCamelCase(typeName) {
  if (!typeName) return typeName

  // Convert PascalCase to camelCase (e.g., AccountProofData -> accountProofData)
  return typeName.charAt(0).toLowerCase() + typeName.slice(1)
}

function escapeParameterNameForMDX(paramName) {
  // Don't escape curly braces in parameter names as they are part of destructuring syntax
  // and don't need to be escaped in code blocks in MDX
  return paramName
}

function escapeTextForMDX(text) {
  if (!text) return text

  // Escape angle brackets to prevent MDX from interpreting TypeScript generics as HTML/JSX tags
  // For example: "Promise<Interaction>" becomes "Promise&lt;Interaction&gt;"
  return text.replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

module.exports = {
  cleanupTypeText,
  toCamelCase,
  escapeParameterNameForMDX,
  escapeTextForMDX,
}
