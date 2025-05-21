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
    payloadSigs: signable.voucher.payloadSigs.map(ps => ({
      ...ps,
      address: sansPrefix(ps.address),
    })),
  }

  return isPayloadSigner
    ? encodeTransactionPayload(message)
    : encodeTransactionEnvelope(message)
}
