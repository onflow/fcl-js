import {build} from "../build/build"
import {resolve} from "../resolve/resolve"
import {ref} from "../build/build-ref"
import {Interaction} from "@onflow/typedefs"

/**
 * Runs a set of functions on an interaction
 *
 * This is a utility function for testing that builds and resolves an interaction with the provided builder functions.
 * It automatically adds a reference block and then resolves the interaction for testing purposes.
 *
 * @param fns An array of functions to run on the interaction
 * @returns A promise that resolves to the resolved interaction
 *
 * @example
 * import { run } from "@onflow/sdk"
 * import * as fcl from "@onflow/fcl";
 *
 * // Test a simple script interaction
 * const result = await run([
 *   fcl.script`
 *     access(all) fun main(): Int {
 *       return 42
 *     }
 *   `
 * ]);
 *
 * console.log(result.cadence); // The Cadence script
 * console.log(result.tag); // "SCRIPT"
 *
 * // Test a transaction with arguments
 * const txResult = await run([
 *   fcl.transaction`
 *     transaction(amount: UFix64) {
 *       prepare(account: AuthAccount) {
 *         log(amount)
 *       }
 *     }
 *   `,
 *   fcl.args([fcl.arg("10.0", fcl.t.UFix64)])
 * ]);
 *
 * console.log(txResult.message.arguments); // The resolved arguments
 */
export const run = (
  fns: Array<(ix: Interaction) => Interaction | Promise<Interaction>> = []
) => build([ref("123"), ...fns]).then(resolve)
