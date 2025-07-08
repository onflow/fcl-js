const is =
  <T>(type: string) =>
  (d: any): d is T =>
    typeof d === type

/**
 * @description Checks if a value is required (not null or undefined). This is a type guard that
 * ensures the value is not null or undefined, useful for validation and filtering operations.
 *
 * @param d The value to check for null or undefined
 * @returns True if the value is not null or undefined, false otherwise
 *
 * @example
 * // Filter out null/undefined values from an array
 * import * as fcl from "@onflow/fcl"
 *
 * const values = [1, null, "hello", undefined, true]
 * const requiredValues = values.filter(fcl.isRequired)
 * console.log(requiredValues) // [1, "hello", true]
 */
export const isRequired = (d: any): d is NonNullable<any> => d != null

/**
 * @description Type guard that checks if a value is an object. This is useful for runtime type checking
 * and ensuring type safety when working with dynamic data.
 *
 * @param d The value to check
 * @returns True if the value is an object, false otherwise
 *
 * @example
 * // Check if a value is an object
 * import * as fcl from "@onflow/fcl"
 *
 * const obj = { name: "Flow" }
 * const notObj = "string"
 * console.log(fcl.isObject(obj)) // true
 * console.log(fcl.isObject(notObj)) // false
 */
export const isObject = is<object>("object")

/**
 * @description Type guard that checks if a value is a string. Useful for validating input types
 * and ensuring type safety in your applications.
 *
 * @param d The value to check
 * @returns True if the value is a string, false otherwise
 *
 * @example
 * // Validate string input
 * import * as fcl from "@onflow/fcl"
 *
 * const text = "Hello, Flow!"
 * const notText = 123
 * console.log(fcl.isString(text)) // true
 * console.log(fcl.isString(notText)) // false
 */
export const isString = is<string>("string")

/**
 * @description Type guard that checks if a value is a function. This is particularly useful
 * when working with callbacks, event handlers, or optional function parameters.
 *
 * @param d The value to check
 * @returns True if the value is a function, false otherwise
 *
 * @example
 * // Check if a callback is provided
 * import * as fcl from "@onflow/fcl"
 *
 * const callback = () => console.log("Hello")
 * const notCallback = "string"
 * console.log(fcl.isFunc(callback)) // true
 * console.log(fcl.isFunc(notCallback)) // false
 */
export const isFunc = is<Function>("function")

/**
 * @description Type guard that checks if a value is a number. This includes both integers
 * and floating-point numbers, but excludes NaN and Infinity.
 *
 * @param d The value to check
 * @returns True if the value is a number, false otherwise
 *
 * @example
 * // Validate numeric input
 * import * as fcl from "@onflow/fcl"
 *
 * const num = 42
 * const notNum = "42"
 * console.log(fcl.isNumber(num)) // true
 * console.log(fcl.isNumber(notNum)) // false
 */
export const isNumber = is<number>("number")
