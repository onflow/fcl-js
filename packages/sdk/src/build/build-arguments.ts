import {pipe, makeArgument, CadenceArgument} from "../interaction/interaction"
import {TypeDescriptorInput, TypeDescriptor} from "@onflow/types"

/**
 * @description A utility builder to be used with other builders to pass in arguments with a value and supported type
 * @param ax An array of arguments
 * @returns An interaction object
 */
export function args(ax: CadenceArgument<any>[]) {
  return pipe(ax.map(makeArgument))
}

/**
 * @description A utility builder to be used with fcl.args[...] to create FCL supported arguments for interactions
 * @param value The value of the argument
 * @param xform A function to transform the value
 * @returns An argument object
 */
export function arg<T extends TypeDescriptor<any, any>>(
  value: TypeDescriptorInput<T>,
  xform: T
) {
  return {value, xform} as CadenceArgument<T>
}
