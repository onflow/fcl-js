import {
  AccessAPI,
  Transaction,
  SendTransactionRequest,
} from "@onflow/protobuf"
import {response} from "@onflow/response"
import {
  bufferToHexString,
  scriptToBuffer,
  hashToBuffer,
  addressToBuffer,
  bytes,
} from "@onflow/bytes"
import {unary} from "./unary"

export async function sendTransaction(ix, opts = {}) {
  const tx = new Transaction()
  tx.setScript(scriptToBuffer(ix.payload.code))
  tx.setGasLimit(ix.payload.limit)
  tx.setReferenceBlockId(ix.payload.ref ? hashToBuffer(ix.payload.ref) : null)
  tx.setPayer(addressToBuffer(bytes(ix.payer.acct, 20)))
  ix.authz.forEach(a => tx.addAuthorizers(addressToBuffer(bytes(a.acct, 20))))

  const proposalKey = new Transaction.ProposalKey()
  proposalKey.setAddress(addressToBuffer(bytes(ix.proposer.addr, 20)))
  proposalKey.setKeyId(ix.proposer.keyId)
  proposalKey.setSequenceNumber(ix.proposer.sequenceNum)

  tx.setProposalKey(proposalKey)

  ix.authz.forEach(auth => {
    if (auth.signature === null) return
    const authzSig = new Transaction.Signature()
    authzSig.setAddress(addressToBuffer(bytes(auth.acct, 20)))
    authzSig.setKeyId(auth.keyId)
    authzSig.setSignature(hashToBuffer(auth.signature))

    tx.addPayloadSignatures(authzSig)
  })

  const payerSig = new Transaction.Signature()
  payerSig.setAddress(addressToBuffer(bytes(ix.payer.acct, 20)))
  payerSig.setKeyId(ix.payer.keyId)
  payerSig.setSignature(hashToBuffer(ix.payer.signature))

  tx.addEnvelopeSignatures(payerSig)

  const req = new SendTransactionRequest()
  req.setTransaction(tx)

  const res = await unary(opts.node, AccessAPI.SendTransaction, req)

  let ret = response()
  ret.tag = ix.tag
  ret.transactionHash = bufferToHexString(res.getId_asU8())

  return ret
}
