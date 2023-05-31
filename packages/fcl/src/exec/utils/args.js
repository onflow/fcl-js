import {invariant} from "@onflow/util-invariant"
import {isFunc, isObject} from "./is"
import {parseArguments} from "@onflow/util-cadence"

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
 * @returns {function} - the formatted args function e.g. (arg, t) => [ arg("0xABC123", t.Address), arg("1.0", t.UFix64) ]
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
  const hasCompositeTypes = parsedCadenceArgs.some(cadenceArg => isCompositeType(cadenceArg.type))

  invariant(Object.keys(argsValue).length === parsedCadenceArgs.length, "Invalid number of arguments")

  // If any of the cadence args are composite types, we cannot support them
  invariant(
    !hasCompositeTypes,
    "Composite types are not supported in object format, please use the args function format"
  )

  // Format arguments into FCL types
  const formattedArgs = parsedCadenceArgs.map(({ name, type }) => {
    invariant(argsValue.hasOwnProperty(name), `Missing argument: ${name}`)
    return (arg, t) => {
      invariant(Boolean(t[type]), `Unsupported type: ${type}`)
      return arg(argsValue[name], t[type])
    }
  })

  // Return a function that, when invoked, returns the array of formatted args
  return (arg, t) => formattedArgs.map(fn => fn(arg, t))
}