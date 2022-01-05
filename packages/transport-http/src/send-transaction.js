import {invariant} from "@onflow/util-invariant"
import {sansPrefix} from "@onflow/util-address"
import {httpRequest as defaultHttpRequest} from "./http-request.js"

export async function sendTransaction(ix, context = {}, opts = {}) {
  invariant(opts.node, `SDK Send Transaction Error: opts.node must be defined.`)
  invariant(context.response, `SDK Send Transaction Error: context.response must be defined.`)

  const httpRequest = opts.httpRequest || defaultHttpRequest

  ix = await ix

  // Apply Non Payer Signatures to Payload Signatures
  let payloadSignatures = []
  var i = 0
  for (let acct of Object.values(ix.accounts)) {
    try {
      if (!acct.role.payer && acct.signature != null) {
        payloadSignatures.push({
          address: sansPrefix(acct.addr),
          signer_index: i,
          key_index: acct.keyId,
          signature: acct.signature
        })
        i = i + 1
      }
    } catch (error) {
      console.error("SDK HTTP Send Error: Trouble applying payload signature", {acct, ix})
      throw error
    }
  }

  // Apply Payer Signatures to Envelope Signatures

  // TODO: NEED TO DEDUPE ENVELOPE SIGNATURES. Look into impact on grpc send-transaction as well.
  let envelopeSignatures = []
  var j = 0
  for (let acct of Object.values(ix.accounts)) {
    try {
      if (acct.role.payer && acct.signature != null) {
        envelopeSignatures.push({
          address: sansPrefix(acct.addr),
          signer_index: j,
          key_index: acct.keyId,
          signature: acct.signature
        })
        j = j + 1
      }
    } catch (error) {
      console.error("SDK HTTP Send Error: Trouble applying envelope signature", {acct, ix})
      throw error
    }
  }

  var t1 = Date.now()
  const res = await httpRequest({
    hostname: opts.node,
    path: `/transactions`,
    method: "POST",
    body: {
      script: ix.message.cadence,
      arguments: [...ix.message.arguments.map(arg => ix.arguments[arg].asArgument)],
      reference_block_id: ix.message.refBlock ? ix.message.refBlock : null,
      gas_limit: ix.message.computeLimit,
      payer: sansPrefix(ix.accounts[ix.payer].addr),
      proposal_key: {
        address: sansPrefix(ix.accounts[ix.proposer].addr),
        key_index: ix.accounts[ix.proposer].keyId,
        sequence_number: ix.accounts[ix.proposer].sequenceNum,
      },
      authorizers: ix.authorizations
        .map(tempId => ix.accounts[tempId].addr)
        .reduce((prev, current) => {
          return prev.find(item => item === current) ? prev : [...prev, current]
        }, [])
        .map(sansPrefix),
      payload_signatures: payloadSignatures,
      envelope_signatures: envelopeSignatures
    }
  })
  var t2 = Date.now()

  let ret = context.response()
  ret.tag = ix.tag 
  ret.transactionId = res.id

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("FLOW::TX", {
        detail: {txId: ret.transactionId, delta: t2 - t1},
      })
    )
  }

  return ret
}
