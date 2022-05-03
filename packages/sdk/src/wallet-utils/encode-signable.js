import {withPrefix, sansPrefix} from "@onflow/util-address"
import {
    encodeTransactionPayload,
    encodeTransactionEnvelope,
} from "../encode/encode.js"

const findPayloadSigners = (voucher) => {
    // Payload Signers Are: (authorizers + proposer) - payer
    let payload = new Set(voucher.authorizers)
    payload.add(voucher.proposalKey.address)
    payload.delete(voucher.payer)
    return Array.from(payload).map(withPrefix)
}

const findEnvelopeSigners = (voucher) => {
    // Envelope Signers Are: (payer)
    let envelope = new Set([voucher.payer])
    return Array.from(envelope).map(withPrefix)
}

export class UnableToDetermineMessageEncodingTypeForSignerAddress extends Error {
    constructor(signerAddress) {
      const msg = `
        Encode Message From Signable Error: Unable to determine message encoding for signer addresss: ${signerAddress}. 
        Please ensure the address: ${signerAddress} is intended to sign the given transaction as specified by the transaction signable.
      `.trim()
      super(msg)
      this.name = "Unable To Determine Message Encoding For Signer Addresss"
    }
}

export const encodeMessageFromSignable = (signable, signerAddress) => {
    let payloadSigners = findPayloadSigners(signable.voucher)
    let envelopeSigners = findEnvelopeSigners(signable.voucher)

    const isPayloadSigner = payloadSigners.includes(withPrefix(signerAddress))
    const isEnvelopeSigner = envelopeSigners.includes(withPrefix(signerAddress))

    if (!isPayloadSigner && !isEnvelopeSigner) {
        throw new UnableToDetermineMessageEncodingTypeForSignerAddress(signerAddress)
    }

    const message = {
        cadence: signable.voucher.cadence,
        refBlock: signable.voucher.refBlock,
        computeLimit: signable.voucher.computeLimit,
        arguments: signable.voucher.arguments,
        proposalKey: {
            ...signable.voucher.proposalKey,
            address: sansPrefix(signable.voucher.proposalKey.address)
        },
        payer: sansPrefix(signable.voucher.payer),
        authorizers: signable.voucher.authorizers.map(sansPrefix),
        payloadSigs: signable.voucher.payloadSigs.map(ps => ({
            ...ps,
            address: sansPrefix(ps.address)
        }))
    }

    return isPayloadSigner ? encodeTransactionPayload(message) : encodeTransactionEnvelope(message)
}

