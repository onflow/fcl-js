import {
  encodeTransactionPayload as encodeInsideMessage,
  encodeTransactionEnvelope as encodeOutsideMessage,
} from "../encode/encode"
import {invariant} from "@onflow/util-invariant"

interface Signable {
  roles: {
    payer: boolean
  }
  voucher: any
  message: string
}

const isPayer = (signable: Signable): boolean => {
  return signable.roles.payer
}

const getVoucher = (signable: Signable): any => {
  return signable.voucher
}

const getMessage = (signable: Signable): string => {
  return signable.message
}

const isExpectedMessage = (signable: Signable): boolean => {
  return isPayer(signable)
    ? encodeOutsideMessage(getVoucher(signable)) === getMessage(signable)
    : encodeInsideMessage(getVoucher(signable)) === getMessage(signable)
}

/**
 * Validates that a signable transaction is properly formed and contains the expected message.
 *
 * This function verifies that the message in a signable object matches the expected encoded message
 * based on the signer's role (payer or non-payer). It ensures the integrity of the signing process
 * by confirming that the message to be signed corresponds correctly to the transaction data.
 *
 * For payers: Validates against the transaction envelope encoding
 * For non-payers (proposers/authorizers): Validates against the transaction payload encoding
 *
 * @param signable The signable object to validate
 * @param signable.roles Object indicating the signer's roles (payer, proposer, authorizer)
 * @param signable.voucher The voucher containing transaction data
 * @param signable.message The encoded message that should be signed
 * @returns True if the signable is valid and ready for signing
 *
 * @throws {Error} When the signable payload doesn't match the expected transaction encoding
 *
 * @example
 * import * as fcl from "@onflow/fcl";
 *
 * // This function is typically used internally by wallet connectors
 * // and authorization functions to ensure transaction integrity
 *
 * const signable = {
 *   roles: { payer: true, proposer: false, authorizer: false },
 *   voucher: {
 *     cadence: "transaction { prepare(acct: AuthAccount) {} }",
 *     proposalKey: { address: "0x01", keyId: 0, sequenceNum: 42 },
 *     payer: "0x02",
 *     authorizers: ["0x01"],
 *     // ... other voucher data
 *   },
 *   message: "encoded_transaction_envelope_here"
 * };
 *
 * try {
 *   const isValid = fcl.validateSignableTransaction(signable);
 *   console.log("Signable is valid:", isValid);
 *   // Proceed with signing
 * } catch (error) {
 *   console.error("Invalid signable:", error.message);
 *   // Handle validation failure
 * }
 */
export const validateSignableTransaction = (signable: Signable): boolean => {
  invariant(isExpectedMessage(signable), "Signable payload must be transaction")

  return true
}
