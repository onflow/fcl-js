import {TransactionRole} from "@onflow/typedefs"
import {
  AccountAuthorization,
  pipe,
  prepAccount,
} from "../interaction/interaction"

/**
 * A builder function that adds payer account(s) to a transaction.
 *
 * Every transaction requires at least one payer.
 *
 * The payer is the account that pays the transaction fee for executing the transaction on the network.
 * The payer account must have sufficient Flow tokens to cover the transaction fees.
 *
 * Read more about [transaction roles](https://docs.onflow.org/concepts/transaction-signing/#payer) and [transaction fees](https://docs.onflow.org/concepts/fees/).
 *
 * @param ax An account address or an array of account addresses
 * @returns A function that takes an interaction object and returns a new interaction object with the payer(s) added
 *
 * @example
 * ```typescript
 * import * as fcl from "@onflow/fcl";
 *
 * // Using current user as payer (most common case)
 * await fcl.mutate({
 *   cadence: `
 *     transaction {
 *       prepare(acct: AuthAccount) {
 *         log("Transaction fees paid by: ".concat(acct.address.toString()))
 *       }
 *     }
 *   `,
 *   payer: fcl.authz // Current user as payer
 * });
 *
 * // Using custom payer with builder pattern
 * await fcl.send([
 *   fcl.transaction`
 *     transaction {
 *       prepare(acct: AuthAccount) {
 *         // Transaction logic
 *       }
 *     }
 *   `,
 *   fcl.proposer(fcl.authz),        // Current user as proposer
 *   fcl.authorizations([fcl.authz]), // Current user as authorizer
 *   fcl.payer(customPayerAuthz)     // Custom payer pays fees
 * ]);
 *
 * // Multiple payers (advanced use case)
 * await fcl.send([
 *   fcl.transaction`
 *     transaction {
 *       prepare(acct: AuthAccount) {
 *         // Transaction logic
 *       }
 *     }
 *   `,
 *   fcl.payer([payerAuthz1, payerAuthz2]) // Multiple payers split fees
 * ]);
 * ```
 */
export function payer(ax: AccountAuthorization[] = []) {
  if (!Array.isArray(ax)) ax = [ax]
  return pipe(
    ax.map(authz => {
      return prepAccount(authz, {
        role: TransactionRole.PAYER,
      })
    })
  )
}
