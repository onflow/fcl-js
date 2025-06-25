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
 * const values = [1, null, "hello", undefined, true]
 * const requiredValues = values.filter(fcl.isRequired)
 */
export const isRequired = (d: any): d is NonNullable<any> => d != null
/**
 * @description Type guard that checks if a value is an object.
 *
 * @param d The value to check
 * @returns True if the value is an object, false otherwise
 */
export const isObject = is<object>("object")
/**
 * @description Type guard that checks if a value is a string.
 *
 * @param d The value to check
 * @returns True if the value is a string, false otherwise
 */
export const isString = is<string>("string")
/**
 * @description Type guard that checks if a value is a function.
 *
 * @param d The value to check
 * @returns True if the value is a function, false otherwise
 */
export const isFunc = is<Function>("function")
/**
 * @description Type guard that checks if a value is a number.
 *
 * @param d The value to check
 * @returns True if the value is a number, false otherwise
 */
export const isNumber = is<number>("number")
