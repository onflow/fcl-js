import {withPrefix, sansPrefix} from "@onflow/util-address"
import {
  encodeTransactionPayload,
  encodeTransactionEnvelope,
} from "../encode/encode"

export interface PayloadSig {
  address: string
  keyId: number | string
  sig: string
  [key: string]: any
}

export interface Voucher {
  authorizers: string[]
  proposalKey: {
    address: string
    keyId?: number | string
    sequenceNum?: number
    [key: string]: any
  }
  payer: string
  cadence: string
  refBlock: string
  computeLimit: number
  arguments: any[]
  payloadSigs: PayloadSig[]
}

export interface Signable {
  message: string
  addr?: string
  keyId?: number
  signature?: string
  roles: Record<string, boolean>
  voucher: Voucher
  [key: string]: any
}

const findPayloadSigners = (voucher: Voucher): string[] => {
  // Payload Signers Are: (authorizers + proposer) - payer
  const payload: Set<string> = new Set(voucher.authorizers)
  payload.add(voucher.proposalKey.address)
  payload.delete(voucher.payer)
  return Array.from(payload).map(addr => withPrefix(addr))
}

const findEnvelopeSigners = (voucher: Voucher): string[] => {
  // Envelope Signers Are: (payer)
  const envelope: Set<string> = new Set([voucher.payer])
  return Array.from(envelope).map(addr => withPrefix(addr))
}

export class UnableToDetermineMessageEncodingTypeForSignerAddress extends Error {
  constructor(signerAddress: string) {
    const msg = `
        Encode Message From Signable Error: Unable to determine message encoding for signer addresss: ${signerAddress}. 
        Please ensure the address: ${signerAddress} is intended to sign the given transaction as specified by the transaction signable.
      `.trim()
    super(msg)
    this.name = "Unable To Determine Message Encoding For Signer Addresss"
  }
}

/**
 * Encodes a message from a signable object for a specific signer address.
 *
 * This function determines whether the signer should sign the transaction payload or envelope
 * based on their role in the transaction (authorizer, proposer, or payer), then encodes the
 * appropriate message for signing.
 *
 * Payload signers include authorizers and proposers (but not payers)
 * Envelope signers include only payers
 *
 * The encoded message is what gets signed by the account's private key to create the transaction signature.
 *
 * @param signable The signable object containing transaction data and voucher
 * @param signerAddress The address of the signer to encode the message for
 * @returns An encoded message string suitable for signing with the account's private key
 *
 * @throws {UnableToDetermineMessageEncodingTypeForSignerAddress} When the signer address is not found in authorizers, proposer, or payer roles
 *
 * @example
 * import * as fcl from "@onflow/fcl";
 *
 * // This function is typically used internally by authorization functions
 * // when implementing custom wallet connectors or signing flows
 *
 * const signable = {
 *   voucher: {
 *     cadence: "transaction { prepare(acct: AuthAccount) {} }",
 *     authorizers: ["0x01"],
 *     proposalKey: { address: "0x01", keyId: 0, sequenceNum: 42 },
 *     payer: "0x02",
 *     refBlock: "a1b2c3",
 *     computeLimit: 100,
 *     arguments: [],
 *     payloadSigs: []
 *   }
 * };
 *
 * // For an authorizer (payload signer)
 * const authorizerMessage = fcl.encodeMessageFromSignable(signable, "0x01");
 * console.log("Authorizer signs:", authorizerMessage);
 *
 * // For a payer (envelope signer)
 * const payerMessage = fcl.encodeMessageFromSignable(signable, "0x02");
 * console.log("Payer signs:", payerMessage);
 */
export const encodeMessageFromSignable = (
  signable: Signable,
  signerAddress: string
): string => {
  let payloadSigners = findPayloadSigners(signable.voucher)
  let envelopeSigners = findEnvelopeSigners(signable.voucher)

  const isPayloadSigner = payloadSigners.includes(withPrefix(signerAddress))
  const isEnvelopeSigner = envelopeSigners.includes(withPrefix(signerAddress))

  if (!isPayloadSigner && !isEnvelopeSigner) {
    throw new UnableToDetermineMessageEncodingTypeForSignerAddress(
      signerAddress
    )
  }

  const message: any = {
    cadence: signable.voucher.cadence,
    refBlock: signable.voucher.refBlock,
    computeLimit: signable.voucher.computeLimit,
    arguments: signable.voucher.arguments,
    proposalKey: {
      ...signable.voucher.proposalKey,
      address: sansPrefix(signable.voucher.proposalKey.address),
    },
    payer: sansPrefix(signable.voucher.payer),
    authorizers: signable.voucher.authorizers.map(sansPrefix),
    payloadSigs: signable.voucher.payloadSigs.map(ps => {
      const base: any = {
        ...ps,
        address: sansPrefix(ps.address),
      }
      if ((ps as any).signatureExtension != null) {
        base.signatureExtension = (ps as any).signatureExtension
      }
      return base
    }),
  }

  return isPayloadSigner
    ? encodeTransactionPayload(message)
    : encodeTransactionEnvelope(message)
}
