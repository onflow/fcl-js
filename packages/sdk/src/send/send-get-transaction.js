import {AccessAPI, GetTransactionRequest} from "@onflow/protobuf"
import {response} from "../response/response.js"
import {unary as defaultUnary} from "./unary"

const u8ToHex = u8 => Buffer.from(u8).toString("hex")
const hexBuffer = hex => Buffer.from(hex, "hex")

export async function sendGetTransaction(ix, opts = {}) {
  const unary = opts.unary || defaultUnary

  ix = await ix

  const req = new GetTransactionRequest()
  req.setId(hexBuffer(ix.transaction.id))

  const res = await unary(opts.node, AccessAPI.GetTransaction, req)

  let ret = response()
  ret.tag = ix.tag

  const unwrapKey = key => ({
    address: u8ToHex(key.getAddress_asU8()),
    keyId: key.getKeyId(),
    sequenceNumber: key.getSequenceNumber()
  })

  const unwrapSignature = sig => ({
    address: u8ToHex(sig.getAddress_asU8()),
    keyId: sig.getKeyId(),
    signature: u8ToHex(sig.getSignature_asU8())
  })

  let transaction = res.getTransaction()
  ret.transaction = {
      script: Buffer.from(transaction.getScript_asU8()).toString("utf8"),
      args: (transaction.getArgumentsList()).map(arg => JSON.parse(Buffer.from(arg).toString("utf8"))),
      referenceBlockId: u8ToHex(transaction.getReferenceBlockId_asU8()),
      gasLimit: transaction.getGasLimit(),
      proposalKey: unwrapKey(transaction.getProposalKey()),
      payer: u8ToHex(transaction.getPayer_asU8()),
      authorizers: (transaction.getAuthorizersList()).map(u8ToHex),
      payloadSignatures: (transaction.getPayloadSignaturesList()).map(unwrapSignature),
      envelopeSignatures: (transaction.getEnvelopeSignaturesList()).map(unwrapSignature)
  }

  return ret
}
