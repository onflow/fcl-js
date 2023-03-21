/**
 * Asserts fact is true, otherwise throw an error with invariant message
 * @param {boolean} fact
 * @param {string} msg
 * @param {Array} rest
 * @returns {void}
 */
export function invariant(fact, msg, ...rest) {
  if (!fact) {
    const error = new Error(`INVARIANT ${msg}`)
    error.stack = error.stack
      .split("\n")
      .filter(d => !/at invariant/.test(d))
      .join("\n")
    console.error("\n\n---\n\n", error, "\n\n", ...rest, "\n\n---\n\n")
    throw error
  }
}
