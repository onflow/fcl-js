/**
 * Asserts fact is true, otherwise throw an error with invariant message
 * @param fact
 * @param msg
 * @param rest
 */
export function invariant(
  fact: boolean,
  msg: string,
  ...rest: any[]
): asserts fact {
  if (!fact) {
    const error = new Error(`INVARIANT ${msg}`)
    error.stack = error.stack
      ?.split("\n")
      ?.filter(d => !/at invariant/.test(d))
      ?.join("\n")
    console.error("\n\n---\n\n", error, "\n\n", ...rest, "\n\n---\n\n")
    throw error
  }
}
