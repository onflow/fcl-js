import {InteractionAccount, TransactionRole} from "@onflow/typedefs"
import {
  AccountAuthorization,
  pipe,
  prepAccount,
} from "../interaction/interaction"
import {Voucher} from "../encode/encode"

/**
 * An object that contains all the information needed for FCL to sign a message with the user's signature.
 * Note: These values are destructed from the payload object in the first argument of a signing function.
 */
interface SignableMessage {
  /**
   * The encoded string which needs to be used to produce the signature.
   */
  message: string
  /**
   * The encoded string which needs to be used to produce the signature.
   */
  addr: string
  /**
   * The encoded string which needs to be used to produce the signature.
   */
  keyId: number | string
  /**
   * The encoded string which needs to be used to produce the signature.
   */
  roles: {
    /**
     * A Boolean representing if this signature to be produced for a proposer.
     */
    proposer: boolean
    /**
     * A Boolean representing if this signature to be produced for a authorizer.
     */
    authorizer: boolean
    /**
     * A Boolean representing if this signature to be produced for a payer.
     */
    payer: boolean
  }
  /**
   * The raw transactions information, can be used to create the message for additional safety and lack of trust in the supplied message.
   */
  voucher: Voucher
}

/**
 * The object that contains all the information needed by FCL to authorize a user's transaction.
 */
interface SigningResult {
  /**
   * The address of the Flow Account this signature was produced for.
   */
  addr?: string
  /**
   * The keyId for which key was used to produce the signature.
   */
  keyId?: number | string
  /**
   * The hex encoded string representing the signature of the message.
   */
  signature: string
}

/**
 * A signing function consumes a payload and produces a signature for a transaction.
 * This function is always async.
 * Only write your own signing function if you are writing your own custom authorization function.
 */
type SigningFn = (
  signable?: SignableMessage
) => SigningResult | Promise<SigningResult>

/**
 * A utility builder to set the authorizations on a transaction.
 *
 * Authorizations define the accounts that are responsible for paying the transaction fees and providing signatures for the transaction.
 * You can have multiple authorizers in a single transaction (multi-signature transactions).
 *
 * Read more about [transaction roles](https://docs.onflow.org/concepts/transaction-signing/) and [signing transactions](https://docs.onflow.org/concepts/accounts-and-keys/).
 *
 * @param ax An array of authorization functions that produce account authorization details
 * @returns A function that processes an interaction object
 *
 * @example
 * import * as fcl from "@onflow/fcl";
 *
 * // Single authorizer (most common case)
 * await fcl.mutate({
 *   cadence: `
 *     transaction {
 *       prepare(acct: AuthAccount) {
 *         log("Hello from: ".concat(acct.address.toString()))
 *       }
 *     }
 *   `,
 *   authorizations: [fcl.authz] // Current user authorization
 * });
 *
 * // Multiple authorizers - both accounts must approve
 * await fcl.mutate({
 *   cadence: `
 *     transaction {
 *       prepare(acct1: AuthAccount, acct2: AuthAccount) {
 *         log("Transaction signed by both accounts")
 *       }
 *     }
 *   `,
 *   authorizations: [userOneAuthz, userTwoAuthz]
 * });
 *
 * // Using builder pattern
 * await fcl.send([
 *   fcl.transaction`
 *     transaction {
 *       prepare(acct: AuthAccount) {
 *         acct.save("Hello, World!", to: /storage/greeting)
 *       }
 *     }
 *   `,
 *   fcl.authorizations([fcl.authz]),
 *   fcl.proposer(fcl.authz),
 *   fcl.payer(fcl.authz),
 *   fcl.limit(100)
 * ]);
 */
export function authorizations(ax: Array<AccountAuthorization> = []) {
  return pipe(
    ax.map(authz => {
      return prepAccount(authz, {
        role: TransactionRole.AUTHORIZER,
      })
    })
  )
}

/**
 * Creates an authorization function for use in transactions.
 *
 * An authorization function must produce the information of the user that is going to sign and a signing function to use the information to produce a signature.
 *
 * Read more about [authorization functions](https://docs.onflow.org/fcl/reference/authorization-function/) and [transaction roles](https://docs.onflow.org/concepts/transaction-signing/).
 *
 * @param addr The address of the account that will sign the transaction
 * @param signingFunction A function that produces signatures for the account
 * @param keyId The index of the key to use for signing (optional)
 * @param sequenceNum The sequence number for the account key (optional)
 * @returns A partial interaction account object
 *
 * @example
 * import * as fcl from "@onflow/fcl";
 * import { ec as EC } from "elliptic";
 *
 * // Create a signing function
 * const signingFunction = ({ message }) => {
 *   // Your signing logic here
 *   return {
 *     addr: "0x123456789abcdef0",
 *     keyId: 0,
 *     signature: "your_signature_here"
 *   };
 * };
 *
 * // Create authorization
 * const authz = fcl.authorization(
 *   "0x123456789abcdef0", // account address
 *   signingFunction,     // signing function
 *   0,                   // key ID
 *   42                   // sequence number
 * );
 *
 * // Use in transaction
 * await fcl.mutate({
 *   cadence: `transaction { prepare(acct: AuthAccount) {} }`,
 *   proposer: authz,
 *   payer: authz,
 *   authorizations: [authz]
 * });
 */
export function authorization(
  addr: string,
  signingFunction: SigningFn,
  keyId?: number | string,
  sequenceNum?: number
): Partial<InteractionAccount> {
  return {addr, signingFunction, keyId, sequenceNum}
}
