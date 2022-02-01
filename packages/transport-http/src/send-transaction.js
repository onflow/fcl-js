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
  for (let acct of Object.values(ix.accounts)) {
    try {
      if (!acct.role.payer && acct.signature != null) {
        payloadSignatures.push({
          address: sansPrefix(acct.addr),
          key_index: String(acct.keyId),
          signature: Buffer.from(acct.signature, "hex").toString("base64")
        })
      }
    } catch (error) {
      console.error("SDK HTTP Send Error: Trouble applying payload signature", {acct, ix})
      throw error
    }
  }

  // Apply Payer Signatures to Envelope Signatures
  let envelopeSignatures = {}
  for (let acct of Object.values(ix.accounts)) {
    try {
      if (acct.role.payer && acct.signature != null) {
        let id = acct.tempId || `${acct.addr}-${acct.keyId}`
        envelopeSignatures[id] = envelopeSignatures[id] || {
          address: sansPrefix(acct.addr),
          key_index: String(acct.keyId),
          signature: Buffer.from(acct.signature, "hex").toString("base64")
        }
      }
    } catch (error) {
      console.error("SDK HTTP Send Error: Trouble applying envelope signature", {acct, ix})
      throw error
    }
  }
  envelopeSignatures = Object.values(envelopeSignatures)

  var t1 = Date.now()
  const res = await httpRequest({
    hostname: opts.node,
    path: `/v1/transactions`,
    method: "POST",
    body: {
      script: Buffer.from(ix.message.cadence).toString("base64"),
      "arguments": [...ix.message.arguments.map(arg => Buffer.from(JSON.stringify(ix.arguments[arg].asArgument)).toString("base64"))],
      reference_block_id: ix.message.refBlock ? ix.message.refBlock : null,
      gas_limit: String(ix.message.computeLimit),
      payer: sansPrefix(ix.accounts[ix.payer].addr),
      proposal_key: {
        address: sansPrefix(ix.accounts[ix.proposer].addr),
        key_index: String(ix.accounts[ix.proposer].keyId),
        sequence_number: String(ix.accounts[ix.proposer].sequenceNum),
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
