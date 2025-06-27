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

function escapeParameterNameForMDX(paramName) {
  // Escape curly braces for MDX compatibility
  // MDX interprets curly braces as JSX expressions, so we need to escape them
  return paramName.replace(/[{}]/g, "\\$&")
}

module.exports = {
  cleanupTypeText,
  escapeParameterNameForMDX,
}
