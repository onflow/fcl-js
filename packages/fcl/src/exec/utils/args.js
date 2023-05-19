import {invariant} from "@onflow/sdk"
import {isFunc, isObject} from "./is"

// array can be recursive

const COMPOSITE_TYPES = ["Struct", "Resource", "Event", "Contract", "StructInterface", "ResourceInterface", "ContractInterface"]

/**
 * @description Checks if a value is a Cadence composite type
 * @param {string} value - the value to check
 * @returns {boolean}
 * @example
 * isCompositeType("Struct") // true
 * isCompositeType("String") // false
 */
const isCompositeType = value => COMPOSITE_TYPES.includes(value)

/**
 * @description If object format, validates and converts args to proper format, otherwise if normal format it continues on
 * @param {object | function} argsValue - the args value to format
 * @param {object} cadence - the cadence object
 * @returns {function} - the formatted args function
 */
export function formatArgs(argsValue, cadence) {
  // If it's not an object or function, it's not a valid args function
  invariant(isObject(argsValue) || isFunc(argsValue), "Invalid args function")

  // If it's a function, it's already formatted
  if (isFunc(argsValue)) {
    return argsValue
  }

  // Parse args from Cadence
  const parsedCadenceArgs = parseArguments(cadence)

  // If any of the cadence args are composite types, we cannot support them
  invariant(
    parsedCadenceArgs.every(arg => !isCompositeType(arg.type)),
    "Composite types are not supported in object format, please use the sargs function format"
  )

  // If it's an object, we need to validate and convert it
  const formattedArgs = (arg, t) => {
    // If the arg is not in the cadence args, it's invalid
    invariant(
      parsedCadenceArgs.some(parsedArg => parsedArg.name === arg),
      `Invalid argument: ${arg}`
    )

    // If the arg is not a valid type, it's invalid
    invariant(
      parsedCadenceArgs.some(parsedArg => parsedArg.type === t),
      `Invalid argument type: ${t}`
    )

    // Return the arg in the proper format
    return arg(argsValue[arg], t[parsedArg.type])
  }

  return formattedArgs
}