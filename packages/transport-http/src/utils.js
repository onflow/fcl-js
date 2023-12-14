export function safeParseJSON(data) {
  try {
    return JSON.parse(data)
  } catch {
    return null
  }
}
