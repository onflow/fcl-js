import {AccessAPI, Transaction, SendTransactionRequest} from "@onflow/protobuf"
import {response} from "@onflow/response"
import {unary} from "./unary"

const u8ToHex = u8 => Buffer.from(u8).toString("hex")
const paddedHexBuffer = (hex, pad) =>
  Buffer.from(hex.padStart(pad * 2, 0), "hex")
const scriptBuffer = script => Buffer.from(script, "utf8")
const hexBuffer = hex => Buffer.from(hex, "hex")
const addressBuffer = addr => paddedHexBuffer(addr, 8)
const argumentBuffer = arg => Buffer.from(JSON.stringify(arg), "utf8")

export async function sendTransaction(ix, opts = {}) {
  const tx = new Transaction()
  tx.setScript(scriptBuffer(ix.message.cadence))
  tx.setGasLimit(ix.message.computeLimit)
  tx.setReferenceBlockId(ix.message.refBlock ? hexBuffer(ix.message.refBlock) : null)
  tx.setPayer(addressBuffer(ix.accounts[ix.payer].addr))
  ix.message.arguments.forEach(arg => tx.addArguments(argumentBuffer(ix.arguments[arg].asArgument)))
  ix.authorizations.forEach(tempId => tx.addAuthorizers(addressBuffer(ix.accounts[tempId].addr)))

  const proposalKey = new Transaction.ProposalKey()
  proposalKey.setAddress(addressBuffer(ix.accounts[ix.proposer].addr))
  proposalKey.setKeyId(ix.accounts[ix.proposer].keyId)
  proposalKey.setSequenceNumber(ix.accounts[ix.proposer].sequenceNum)

  tx.setProposalKey(proposalKey)

  ix.authorizations.forEach(tempId => {
    if (ix.accounts[tempId].signature === null || ix.accounts[tempId].role.payer) return
    const authzSig = new Transaction.Signature()
    authzSig.setAddress(addressBuffer(ix.accounts[tempId].addr))
    authzSig.setKeyId(ix.accounts[tempId].keyId)
    authzSig.setSignature(hexBuffer(ix.accounts[tempId].signature))

    tx.addPayloadSignatures(authzSig)
  })

  const payerSig = new Transaction.Signature()
  payerSig.setAddress(addressBuffer(ix.accounts[ix.payer].addr))
  payerSig.setKeyId(ix.accounts[ix.payer].keyId)
  payerSig.setSignature(hexBuffer(ix.accounts[ix.payer].signature))

  tx.addEnvelopeSignatures(payerSig)

  const req = new SendTransactionRequest()
  req.setTransaction(tx)

  const res = await unary(opts.node, AccessAPI.SendTransaction, req)

  let ret = response()
  ret.tag = ix.tag
  ret.transactionId = u8ToHex(res.getId_asU8())

  return ret
}
