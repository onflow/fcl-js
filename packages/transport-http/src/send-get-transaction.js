import {invariant} from "@onflow/util-invariant"
import {httpRequest as defaultHttpRequest} from "./http-request.js"

export async function sendGetTransaction(ix, context = {}, opts = {}) {
  invariant(opts.node, `SDK Send Get Transaction Error: opts.node must be defined.`)
  invariant(context.response, `SDK Send Get Transaction Error: context.response must be defined.`)

  const httpRequest = opts.httpRequest || defaultHttpRequest

  ix = await ix

  const res = await httpRequest({
    hostname: opts.node,
    path: `/transactions/${ix.transaction.id}`,
    method: "GET",
    body: null,
  })

  const unwrapKey = key => ({
    address: key.address,
    keyId: key.key_id,
    sequenceNumber: key.sequence_number
  })

  const unwrapSignature = sig => ({
    address: sig.address,
    keyId: sig.key_index,
    signerIndex: sig.signer_index, // WHAT IS THIS? THIS IS NEW
    signature: sig.signature
  })

  let ret = context.response()
  ret.tag = ix.tag
  ret.transaction = {
    id: res.id,
    script: res.script,
    args: res.script.arguments,
    referenceBlockId: res.reference_block_id,
    gasLimit: res.gas_limit,
    payer: res.payer,
    proposalKey: unwrapKey(res.proposal_key),
    authorizers: res.proposal_key.authorizers,
    payloadSignatures: res.payload_signatures.map(unwrapSignature),
    envelopeSignatures: res.envelope_signatures.map(unwrapSignature) 
  }

  return ret
}
