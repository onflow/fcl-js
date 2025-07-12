import {InteractionBuilderFn} from "../interaction/interaction"

/**
 * A utility builder to set the compute limit on a transaction.
 *
 * The compute limit is the maximum amount of computation that can be performed during transaction execution.
 * Setting an appropriate compute limit helps prevent infinite loops and ensures predictable transaction costs.
 *
 * Read more about [computation cost](https://docs.onflow.org/concepts/fees/#computation-cost) and [transaction fees](https://docs.onflow.org/concepts/fees/).
 *
 * @param limit The maximum amount of computation for the transaction
 * @returns A function that processes an interaction object
 *
 * @example
 * import * as fcl from "@onflow/fcl";
 *
 * await fcl.mutate({
 *   cadence: `
 *     transaction {
 *       prepare(account: AuthAccount) {
 *         // Complex transaction logic here
 *       }
 *     }
 *   `,
 *   limit: 1000 // Set compute limit to 1000
 * });
 *
 * // Using builder pattern
 * await fcl.send([
 *   fcl.transaction`
 *     transaction {
 *       prepare(account: AuthAccount) {
 *         // Transaction logic
 *       }
 *     }
 *   `,
 *   fcl.limit(9999) // Set higher limit for complex operations
 * ]);
 */
export function limit(limit: number): InteractionBuilderFn {
  return ix => {
    ix.message.computeLimit = limit
    return ix
  }
}
