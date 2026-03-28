import {TransactionId} from "@onflow/typedefs"

/**
 * A Cadence transaction argument builder function.
 * Used to build transaction arguments via `fcl.args` and `fcl.arg`.
 */
export type ArgsFn = (...args: any[]) => any[]

/**
 * A Cadence interaction builder function or an array of builder functions.
 * These are used to construct the transaction interaction sent to the Flow blockchain.
 */
export type CadenceInteractionBuilder = ((ix: any) => Promise<any>) | ((ix: any) => any)

/**
 * Optional configuration for the `fcl.mutate` function.
 */
export interface MutateOptions {
  /**
   * The Cadence transaction code to execute.
   */
  cadence: string

  /**
   * A function that returns the arguments to pass to the Cadence transaction.
   * Use `fcl.args` and `fcl.arg` to build the arguments.
   *
   * @example
   * args: (arg, t) => [arg("Hello", t.String)]
   */
  args?: ArgsFn

  /**
   * Additional interaction builder functions applied to the transaction.
   * Can be used to set the payer, proposer, authorizers, and other transaction properties.
   */
  limit?: number

  /**
   * The compute (gas) limit for the transaction.
   * Defaults to the value set in FCL config (`fcl.limit`).
   */
  authz?: CadenceInteractionBuilder

  /**
   * The authorizer(s) for the transaction.
   * Defaults to the current user.
   */
  proposer?: CadenceInteractionBuilder

  /**
   * The proposer for the transaction.
   * Defaults to the current user.
   */
  payer?: CadenceInteractionBuilder

  /**
   * The payer for the transaction.
   * Defaults to the current user.
   */
  authorizations?: CadenceInteractionBuilder[]
}

/**
 * Sends a Cadence transaction to the Flow blockchain.
 *
 * This function is used to mutate on-chain state by submitting a Cadence
 * transaction. It handles building, signing, and sending the transaction,
 * then returns the transaction ID.
 *
 * @param opts - The mutation options including Cadence code, arguments, and signer configuration.
 * @returns A Promise that resolves to the transaction ID string.
 *
 * @example
 * ```typescript
 * import * as fcl from "@onflow/fcl";
 *
 * const txId = await fcl.mutate({
 *   cadence: `
 *     transaction(greeting: String) {
 *       execute {
 *         log(greeting)
 *       }
 *     }
 *   `,
 *   args: (arg, t) => [arg("Hello, Flow!", t.String)],
 *   limit: 999,
 * });
 *
 * await fcl.tx(txId).onceSealed();
 * ```
 */
export type MutateFn = (opts: MutateOptions) => Promise<TransactionId>
