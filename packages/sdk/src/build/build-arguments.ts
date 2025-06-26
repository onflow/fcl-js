import {pipe, makeArgument, CadenceArgument} from "../interaction/interaction"
import {TypeDescriptorInput, TypeDescriptor} from "@onflow/types"

/**
 * A utility builder to be used with other builders to pass in arguments with a value and supported type.
 *
 * A transaction can accept zero or more arguments that are passed into the Cadence script. The arguments on the transaction must match the number and order declared in the Cadence script.
 * This function returns a Partial Interaction that contains the arguments and types passed in. This alone is a partial and incomplete interaction.
 *
 * @param ax An array of argument objects created with fcl.arg()
 * @returns A Partial Interaction object containing the arguments and types passed in
 *
 * @example
 * import * as fcl from "@onflow/fcl"
 *
 * await fcl.mutate({
 *   cadence: `
 *     transaction(amount: UFix64, to: Address) {
 *       prepare(signer: AuthAccount) {
 *         // transaction logic
 *       }
 *     }
 *   `,
 *   args: (arg, t) => [
 *     arg("10.0", t.UFix64), // Will be the first argument `amount: UFix64`
 *     arg("0xba1132bc08f82fe2", t.Address), // Will be the second argument `to: Address`
 *   ],
 * })
 */
export function args(ax: CadenceArgument<any>[]) {
  return pipe(ax.map(makeArgument))
}

/**
 * A utility builder to be used with fcl.args[...] to create FCL supported arguments for interactions.
 *
 * Arguments are used to pass data to Cadence scripts and transactions. The arguments must match the number and order declared in the Cadence script.
 * This function creates an ArgumentObject that holds the value and type passed in.
 *
 * @param value Any value that you are looking to pass to other builders
 * @param xform A type supported by Flow (FType descriptor)
 * @returns An ArgumentObject that holds the value and type passed in
 *
 * @example
 * import * as fcl from "@onflow/fcl"
 *
 * const result = await fcl.query({
 *   cadence: `
 *     access(all) fun main(a: Int, b: Int, addr: Address): Int {
 *       log(addr)
 *       return a + b
 *     }
 *   `,
 *   args: (arg, t) => [
 *     arg(7, t.Int), // a: Int
 *     arg(6, t.Int), // b: Int
 *     arg("0xba1132bc08f82fe2", t.Address), // addr: Address
 *   ],
 * });
 */
export function arg<T extends TypeDescriptor<any, any>>(
  value: TypeDescriptorInput<T>,
  xform: T
) {
  return {value, xform} as CadenceArgument<T>
}
