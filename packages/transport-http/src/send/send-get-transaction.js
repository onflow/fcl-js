import {invariant} from "@onflow/util-invariant"
import {httpRequest as defaultHttpRequest} from "./http-request.js"

export async function sendGetTransaction(ix, context = {}, opts = {}) {
  invariant(
    opts.node,
    `SDK Send Get Transaction Error: opts.node must be defined.`
  )
  invariant(
    context.response,
    `SDK Send Get Transaction Error: context.response must be defined.`
  )
  invariant(
    context.Buffer,
    `SDK Send Get Transaction Error: context.Buffer must be defined.`
  )

  const httpRequest = opts.httpRequest || defaultHttpRequest

  ix = await ix

  const res = await httpRequest({
    hostname: opts.node,
    path: `/v1/transactions/${ix.transaction.id}`,
    method: "GET",
    body: null,
  })

  const unwrapKey = key => ({
    address: key.address,
    keyId: Number(key.key_id),
    sequenceNumber: Number(key.sequence_number),
  })

  const unwrapSignature = sig => ({
    address: sig.address,
    keyId: Number(sig.key_index),
    signature: sig.signature,
  })

  const unwrapArg = arg =>
    JSON.parse(context.Buffer.from(arg, "base64").toString())

  let ret = context.response()
  ret.tag = ix.tag
  ret.transaction = {
    script: context.Buffer.from(res.script, "base64").toString(),
    args: [...res.arguments.map(unwrapArg)],
    referenceBlockId: res.reference_block_id,
    gasLimit: Number(res.gas_limit),
    payer: res.payer,
    proposalKey: res.proposal_key
      ? unwrapKey(res.proposal_key)
      : res.proposal_key,
    authorizers: res.authorizers,
    payloadSignatures: [...res.payload_signatures.map(unwrapSignature)],
    envelopeSignatures: [...res.envelope_signatures.map(unwrapSignature)],
  }

  return ret
}
