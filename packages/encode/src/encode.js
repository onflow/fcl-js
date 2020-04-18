const rlp = require("rlp")

import { 
  addressToBuffer,
  scriptToBuffer,
  bytesToBuffer,
  hashToBuffer,
  bytesToHex,
  bytes,
} from "@onflow/bytes"

export const encodeTransactionPayload = (tx) => rlpEncode(preparePayload(tx))
export const encodeTransactionEnvelope = (tx) => rlpEncode(prepareEnvelope(tx))

const rlpEncode = (v) => {
  const buf = rlp.encode(v)
  return bytesToHex(bytes(buf))
}

const preparePayload = (tx) => {
  return [
    scriptToBuffer(tx.script),
    hashToBuffer(tx.refBlock),
    tx.gasLimit,
    addressToBuffer(bytes(tx.proposalKey.address, 20)),
    tx.proposalKey.key,
    tx.proposalKey.sequenceNum,
    addressToBuffer(bytes(tx.payer, 20)),
    tx.authorizers.map((addr) => addressToBuffer(bytes(addr, 20)))
  ]
}

const prepareEnvelope = (tx) => {
  return [
    preparePayload(tx),
    preparePayloadSignatures(tx),
  ] 
}

const preparePayloadSignatures = (tx) => {
  const signers = collectSigners(tx)

  return tx.payloadSigs.
    map((sig) => {
      return {
        signerIndex: signers.get(sig.address),
        keyIndex: sig.key,
        sig: sig.sig,
      }
    }).
    sort((a, b) => {
      if (a.signerIndex > b.signerIndex) return -1
      if (a.signerIndex < b.signerIndex) return 1

      if (a.keyIndex > b.keyIndex) return -1
      if (a.keyIndex < b.keyIndex) return 1
    }).
    map((sig) => {
      return [
        sig.signerIndex,
        sig.keyIndex,
        bytesToBuffer(bytes(sig.sig)),
      ]
    })
}

const collectSigners = (tx) => {
  const signers = new Map()
  let i = 0

  const addSigner = (addr) => {
    if (!signers.has(addr)) {
      signers.set(addr, i)
      i++
    }
  }
  
  addSigner(tx.proposalKey.address)
  addSigner(tx.payer)
  tx.authorizers.forEach(addSigner)

  return signers
}
