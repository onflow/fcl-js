function formatTypeScript(typeText) {
  if (!typeText || typeof typeText !== "string") {
    return typeText
  }

  let formatted = typeText
    // Add newlines after semicolons in object types
    .replace(/;\s*/g, ";\n  ")
    // Add newlines after opening braces
    .replace(/\{\s*/g, "{\n  ")
    // Add newlines before closing braces
    .replace(/\s*\}/g, "\n}")
    // Add proper spacing around colons
    .replace(/\s*:\s*/g, ": ")
    // Add proper spacing around arrows
    .replace(/\s*=>\s*/g, " => ")
    // Add proper spacing around pipes
    .replace(/\s*\|\s*/g, " | ")
    // Add proper spacing around ampersands
    .replace(/\s*&\s*/g, " & ")

  // Clean up excessive whitespace and newlines
  formatted = formatted
    .replace(/\n\s*\n/g, "\n")
    .replace(/^\s+|\s+$/g, "")
    .replace(/\n\s*;/g, ";")

  return formatted
}

module.exports = {
  formatTypeScript,
}
