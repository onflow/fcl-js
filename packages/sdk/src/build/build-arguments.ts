import {pipe, makeArgument} from "../interaction/interaction"
import {TypeDescriptorInput, TypeDescriptor} from "@onflow/types"

/**
 * @description - A utility builder to be used with other builders to pass in arguments with a value and supported type
 * @param {Array.<*>} ax - An array of arguments
 * @returns {Function} - An interaction object
 */
export function args(ax = []) {
  return pipe(ax.map(makeArgument))
}

/**
 * @description - A utility builder to be used with fcl.args[...] to create FCL supported arguments for interactions
 * @param {any} value - The value of the argument
 * @param {Function} xform - A function to transform the value
 * @returns {object} - An argument object
 */
export function arg<T extends TypeDescriptor<any, {
  type: string;
  value: string;
}>>(value: TypeDescriptorInput<T>, xform: T) {
  return {value, xform}
}
