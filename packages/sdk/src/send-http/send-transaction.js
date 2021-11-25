import {invariant} from "@onflow/util-invariant"
import {response} from "../response/response.js"
import {sansPrefix} from "@onflow/util-address"
import {httpRequest as defaultHttpRequest} from "./http-request.js"

export async function sendTransaction(ix, opts = {}) {
  invariant(opts.node, `SDK Send Transaction Error: opts.node must be defined.`)

  const httpRequest = opts.httpRequest || defaultHttpRequest

  ix = await ix

  // Apply Non Payer Signatures to Payload Signatures
  let payloadSignatures = []
  for (let acct of Object.values(ix.accounts)) {
    try {
      if (!acct.role.payer && acct.signature != null) {
        payloadSignatures.push({
          address: sansPrefix(acct.addr),
          signer_index: null, // WHAT IS THIS?
          key_index: acct.keyId,
          signature: acct.signature
        })
      }
    } catch (error) {
      console.error("Trouble applying payload signature", {acct, ix})
      throw error
    }
  }

  // Apply Payer Signatures to Envelope Signatures
  let envelopeSignatures = []
  for (let acct of Object.values(ix.accounts)) {
    try {
      if (acct.role.payer && acct.signature != null) {
        envelopeSignatures.push({
          address: sansPrefix(acct.addr),
          signer_index: null, // WHAT IS THIS???
          key_index: acct.keyId,
          signature: acct.signature
        })
      }
    } catch (error) {
      console.error("Trouble applying envelope signature", {acct, ix})
      throw error
    }
  }

  var t1 = Date.now()
  const res = await httpRequest({
    hostname: opts.node,
    port: 443,
    path: `/transactions`,
    method: "POST",
    body: {
      script: ix.message.cadence,
      arguments: ix.message.arguments.map(arg => ix.arguments[arg].asArgument),
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

  // SHOULD WE RETURN THE FULL TRANSACTION OBJECT HERE?
  let ret = response()
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
