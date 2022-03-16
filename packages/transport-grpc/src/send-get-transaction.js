import {invariant} from "@onflow/util-invariant"
import {AccessAPI, GetTransactionRequest} from "@onflow/protobuf"
import {unary as defaultUnary} from "./unary"

const u8ToHex = (u8, context) => context.Buffer.from(u8).toString("hex")
const hexBuffer = (hex, context) => context.Buffer.from(hex, "hex")

export async function sendGetTransaction(ix, context = {}, opts = {}) {
  invariant(opts.node, `SDK Send Get Transaction Error: opts.node must be defined.`)
  invariant(context.response, `SDK Send Get Transaction Error: context.response must be defined.`)
  invariant(context.Buffer, `SDK Send Get Transaction Error: context.Buffer must be defined.`)
  
  const unary = opts.unary || defaultUnary

  ix = await ix

  const req = new GetTransactionRequest()
  req.setId(hexBuffer(ix.transaction.id, context))

  const res = await unary(opts.node, AccessAPI.GetTransaction, req, context)

  let ret = context.response()
  ret.tag = ix.tag

  const unwrapKey = key => ({
    address: u8ToHex(key.getAddress_asU8(), context),
    keyId: key.getKeyId(),
    sequenceNumber: key.getSequenceNumber()
  })

  const unwrapSignature = sig => ({
    address: u8ToHex(sig.getAddress_asU8(), context),
    keyId: sig.getKeyId(),
    signature: u8ToHex(sig.getSignature_asU8(), context)
  })

  let transaction = res.getTransaction()
  ret.transaction = {
      script: context.Buffer.from(transaction.getScript_asU8()).toString("utf8"),
      args: (transaction.getArgumentsList()).map(arg => JSON.parse(context.Buffer.from(arg).toString("utf8"))),
      referenceBlockId: u8ToHex(transaction.getReferenceBlockId_asU8(), context),
      gasLimit: transaction.getGasLimit(),
      proposalKey: unwrapKey(transaction.getProposalKey()),
      payer: u8ToHex(transaction.getPayer_asU8(), context),
      authorizers: (transaction.getAuthorizersList()).map(x => u8ToHex(x, context)),
      payloadSignatures: (transaction.getPayloadSignaturesList()).map(unwrapSignature),
      envelopeSignatures: (transaction.getEnvelopeSignaturesList()).map(unwrapSignature)
  }

  return ret
}
