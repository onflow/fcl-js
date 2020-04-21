import {AccessAPI, Transaction, SendTransactionRequest} from "@onflow/protobuf"
import {response} from "@onflow/response"
import {unary} from "./unary"

const u8ToHex = u8 => Buffer.from(u8).toString("hex")
const paddedHexBuffer = (hex, pad) =>
  Buffer.from(hex.padStart(pad * 2, 0), "hex")
const scriptBuffer = script => Buffer.from(script, "utf8")
const hexBuffer = hex => Buffer.from(hex, "hex")
const addressBuffer = addr => paddedHexBuffer(addr, 20)

export async function sendTransaction(ix, opts = {}) {
  const tx = new Transaction()
  tx.setScript(scriptBuffer(ix.payload.code))
  tx.setGasLimit(ix.payload.limit)
  tx.setReferenceBlockId(ix.payload.ref ? hexBuffer(ix.payload.ref) : null)
  tx.setPayer(addressBuffer(ix.payer.acct))
  ix.authz.forEach(a => tx.addAuthorizers(addressBuffer(a.acct)))

  const proposalKey = new Transaction.ProposalKey()
  proposalKey.setAddress(addressBuffer(ix.proposer.addr))
  proposalKey.setKeyId(ix.proposer.keyId)
  proposalKey.setSequenceNumber(ix.proposer.sequenceNum)

  tx.setProposalKey(proposalKey)

  ix.authz.forEach(auth => {
    if (auth.signature === null) return
    const authzSig = new Transaction.Signature()
    authzSig.setAddress(addressBuffer(auth.acct))
    authzSig.setKeyId(auth.keyId)
    authzSig.setSignature(hexBuffer(auth.signature))

    tx.addPayloadSignatures(authzSig)
  })

  const payerSig = new Transaction.Signature()
  payerSig.setAddress(addressBuffer(ix.payer.acct))
  payerSig.setKeyId(ix.payer.keyId)
  payerSig.setSignature(hexBuffer(ix.payer.signature))

  tx.addEnvelopeSignatures(payerSig)

  const req = new SendTransactionRequest()
  req.setTransaction(tx)

  const res = await unary(opts.node, AccessAPI.SendTransaction, req)

  let ret = response()
  ret.tag = ix.tag
  ret.transactionId = u8ToHex(res.getId_asU8())

  return ret
}
