import {invariant} from "@onflow/util-invariant"

/**
 * Parses a Cadence transaction to extract function arguments.
 *
 * @param {string} cadenceCode - The Cadence transaction code.
 * @returns {Array<object>} An array of objects each containing 'name' and 'type' of each argument in the transaction.
 * Each object has the format: { name: string, type: string }. If no valid arguments are found, or if the Cadence
 * transaction is not properly formatted, the function will return an empty array.
 *
 * @example
 * const cadenceCode = 'transaction(name: String, age: Int)'
 * parseArguments(cadenceCode)
 * // Returns: [{ name: 'name', type: 'String' }, { name: 'age', type: 'Int' }]
 *
 * @example
 * const cadenceCode = 'transaction()'
 * parseArguments(cadenceCode)
 * // Returns: []
 */
export const parseArguments = cadenceCode => {
  const start = cadenceCode.indexOf('(') + 1
  const end = cadenceCode.indexOf(')')

  invariant(start !== 0 && end !== -1, "Invalid cadence code")

  const argString = cadenceCode.slice(start, end)

  return argString
    .split(',')
    .map(arg => arg.trim())
    .filter(Boolean) // filter out empty strings
    .map(argumentString => {
      const [name, type] = argumentString.split(':')
      invariant(name && type, `Invalid argument: ${argumentString}`)

      return { name: name.trim(), type: type.trim() }
    })
    .filter(Boolean) // Remove any null values resulting from invalid argument formats
}