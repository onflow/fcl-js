import {TransactionRole} from "@onflow/typedefs"
import {AccountAuthorization, prepAccount} from "../interaction/interaction"

/**
 * A builder function that adds the proposer to a transaction.
 *
 * The proposer is responsible for providing the proposal key and paying the network fee for the transaction.
 * The proposer key is used to specify the sequence number and prevent replay attacks.
 *
 * Every transaction requires exactly one proposer.
 *
 * Read more about [transaction roles](https://docs.onflow.org/concepts/transaction-signing/#proposer) and [signing transactions](https://docs.onflow.org/concepts/accounts-and-keys/).
 *
 * @param authz The authorization object for the proposer
 * @returns A function that takes an interaction object and returns a new interaction object with the proposer added
 *
 * @example
 * import * as fcl from "@onflow/fcl";
 *
 * // Using the current user as proposer
 * await fcl.mutate({
 *   cadence: `
 *     transaction {
 *       prepare(account: AuthAccount) {
 *         log("Hello from proposer!")
 *       }
 *     }
 *   `,
 *   proposer: fcl.authz
 * });
 *
 * // Using builder pattern
 * await fcl.send([
 *   fcl.transaction`
 *     transaction {
 *       prepare(account: AuthAccount) {
 *         log("Transaction executed")
 *       }
 *     }
 *   `,
 *   fcl.proposer(proposerAuthz),
 *   fcl.payer(payerAuthz),
 *   fcl.authorizations([authorizerAuthz]),
 *   fcl.limit(100)
 * ]);
 */
export function proposer(authz: AccountAuthorization) {
  return prepAccount(authz, {
    role: TransactionRole.PROPOSER,
  })
}
