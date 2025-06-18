import {withPrefix} from "@onflow/util-address"
import {Voucher, encodeTxIdFromVoucher} from "../encode/encode"
import {Interaction} from "@onflow/typedefs"

/**
 * Identifies signers for the transaction payload (authorizers + proposer, excluding payer).
 *
 * This function determines which accounts need to sign the transaction payload. Payload signers include
 * all authorizers and the proposer, but exclude the payer (who signs the envelope).
 *
 * @param ix The interaction object
 * @returns Array of account tempIds that need to sign the payload
 *
 * @example
 * import { findInsideSigners, initInteraction } from "@onflow/sdk"
 *
 * const interaction = initInteraction();
 * // Assume we have account tempIds: "proposer-123", "auth-456", "payer-789"
 * interaction.proposer = "proposer-123";
 * interaction.authorizations = ["auth-456"];
 * interaction.payer = "payer-789";
 *
 * const insideSigners = findInsideSigners(interaction);
 * console.log(insideSigners); // ["auth-456", "proposer-123"]
 * // Note: payer is excluded from payload signers
 */
export function findInsideSigners(ix: Interaction) {
  // Inside Signers Are: (authorizers + proposer) - payer
  let inside = new Set(ix.authorizations)
  if (ix.proposer) {
    inside.add(ix.proposer)
  }
  if (Array.isArray(ix.payer)) {
    ix.payer.forEach(p => inside.delete(p))
  } else {
    inside.delete(ix.payer)
  }
  return Array.from(inside)
}

/**
 * Identifies signers for the transaction envelope (payer accounts only).
 *
 * This function determines which accounts need to sign the transaction envelope. Envelope signers
 * are only the payer accounts, who are responsible for transaction fees.
 *
 * @param ix The interaction object
 * @returns Array of account tempIds that need to sign the envelope
 *
 * @example
 * import { findOutsideSigners, initInteraction } from "@onflow/sdk"
 *
 * const interaction = initInteraction();
 * interaction.proposer = "proposer-123";
 * interaction.authorizations = ["auth-456"];
 * interaction.payer = "payer-789";
 *
 * const outsideSigners = findOutsideSigners(interaction);
 * console.log(outsideSigners); // ["payer-789"]
 * // Only the payer signs the envelope
 *
 * // Multiple payers example
 * interaction.payer = ["payer-789", "payer-abc"];
 * const multiplePayerSigners = findOutsideSigners(interaction);
 * console.log(multiplePayerSigners); // ["payer-789", "payer-abc"]
 */
export function findOutsideSigners(ix: Interaction) {
  // Outside Signers Are: (payer)
  let outside = new Set(Array.isArray(ix.payer) ? ix.payer : [ix.payer])
  return Array.from(outside)
}

/**
 * Creates a signable voucher object from an interaction for signing purposes.
 *
 * A voucher is a standardized representation of a transaction that contains all the necessary
 * information for signing and submitting to the Flow network. This function transforms an
 * interaction object into a voucher format.
 *
 * @param ix The interaction object containing transaction details
 * @returns A voucher object containing all transaction data and signatures
 *
 * @example
 * import * as fcl from "@onflow/fcl";
 * import { createSignableVoucher } from "@onflow/sdk"
 *
 * // Build a transaction interaction
 * const interaction = await fcl.build([
 *   fcl.transaction`
 *     transaction(amount: UFix64) {
 *       prepare(account: AuthAccount) {
 *         log(amount)
 *       }
 *     }
 *   `,
 *   fcl.args([fcl.arg("10.0", fcl.t.UFix64)]),
 *   fcl.proposer(proposerAuthz),
 *   fcl.payer(payerAuthz),
 *   fcl.authorizations([authorizerAuthz]),
 *   fcl.limit(100)
 * ]);
 *
 * // Create a voucher for signing
 * const voucher = createSignableVoucher(interaction);
 * console.log(voucher.cadence); // The Cadence script
 * console.log(voucher.arguments); // The transaction arguments
 * console.log(voucher.proposalKey); // Proposer account details
 * console.log(voucher.authorizers); // List of authorizer addresses
 *
 * // The voucher can now be signed and submitted
 */
export const createSignableVoucher = (ix: Interaction) => {
  const buildAuthorizers = () => {
    const authorizations = ix.authorizations
      .map(cid => withPrefix(ix.accounts[cid].addr))
      .reduce((prev: (string | null)[], current) => {
        return prev.find(item => item === current) ? prev : [...prev, current]
      }, [])
    return authorizations
  }

  const buildInsideSigners = () =>
    findInsideSigners(ix).map(id => ({
      address: withPrefix(ix.accounts[id].addr),
      keyId: ix.accounts[id].keyId,
      sig: ix.accounts[id].signature,
    }))

  const buildOutsideSigners = () =>
    findOutsideSigners(ix).map(id => ({
      address: withPrefix(ix.accounts[id].addr),
      keyId: ix.accounts[id].keyId,
      sig: ix.accounts[id].signature,
    }))

  const proposalKey = ix.proposer
    ? {
        address: withPrefix(ix.accounts[ix.proposer].addr),
        keyId: ix.accounts[ix.proposer].keyId,
        sequenceNum: ix.accounts[ix.proposer].sequenceNum,
      }
    : {}

  return {
    cadence: ix.message.cadence,
    refBlock: ix.message.refBlock || null,
    computeLimit: ix.message.computeLimit,
    arguments: ix.message.arguments.map(id => ix.arguments[id].asArgument),
    proposalKey,
    payer: withPrefix(
      ix.accounts[Array.isArray(ix.payer) ? ix.payer[0] : ix.payer].addr
    ),
    authorizers: buildAuthorizers(),
    payloadSigs: buildInsideSigners(),
    envelopeSigs: buildOutsideSigners(),
  }
}

/**
 * Converts a voucher object to a transaction ID.
 *
 * This function computes the transaction ID by encoding and hashing the voucher.
 * The transaction ID can be used to track the transaction status on the Flow network.
 *
 * @param voucher The voucher object to convert
 * @returns A transaction ID string
 *
 * @example
 * import { voucherToTxId, createSignableVoucher } from "@onflow/sdk"
 * import * as fcl from "@onflow/fcl";
 *
 * // Create a voucher from an interaction
 * const interaction = await fcl.build([
 *   fcl.transaction`
 *     transaction {
 *       prepare(account: AuthAccount) {
 *         log("Hello, Flow!")
 *       }
 *     }
 *   `,
 *   fcl.proposer(authz),
 *   fcl.payer(authz),
 *   fcl.authorizations([authz])
 * ]);
 *
 * const voucher = createSignableVoucher(interaction);
 *
 * // Calculate the transaction ID
 * const txId = voucherToTxId(voucher);
 * console.log("Transaction ID:", txId);
 * // Returns something like: "a1b2c3d4e5f6789..."
 *
 * // You can use this ID to track the transaction
 * const txStatus = await fcl.tx(txId).onceSealed();
 * console.log("Transaction status:", txStatus);
 */
export const voucherToTxId = (voucher: Voucher) => {
  return encodeTxIdFromVoucher(voucher)
}
