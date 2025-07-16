import {pipe, Ok, InteractionBuilderFn} from "../interaction/interaction"

/**
 * A builder function that sets the reference block for a transaction.
 *
 * The reference block specifies an expiration window (measured in blocks) during which a transaction is considered valid by the network.
 * A transaction will be rejected if it is submitted past its expiry block. Flow calculates transaction expiry using the reference block field.
 *
 * @param refBlock The reference block ID
 * @returns A function that processes an interaction object
 *
 * @example
 * import * as fcl from "@onflow/fcl";
 *
 * // Set specific reference block for transaction
 * await fcl.send([
 *   fcl.transaction`
 *     transaction {
 *       prepare(account: AuthAccount) {
 *         log("Transaction with custom reference block")
 *       }
 *     }
 *   `,
 *   fcl.ref("a1b2c3d4e5f6789..."), // Custom reference block ID
 *   fcl.proposer(fcl.authz),
 *   fcl.payer(fcl.authz),
 *   fcl.authorizations([fcl.authz]),
 *   fcl.limit(100)
 * ]);
 *
 * // Usually, you don't need to set reference block manually
 * // as FCL will automatically set it to the latest block
 */
export function ref(refBlock: string): InteractionBuilderFn {
  return pipe([
    ix => {
      ix.message.refBlock = refBlock
      return Ok(ix)
    },
  ])
}
