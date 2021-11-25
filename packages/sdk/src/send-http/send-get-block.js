import {invariant} from "@onflow/util-invariant"
import {response} from "../response/response.js"
import {httpRequest as defaultHttpRequest} from "./http-request.js"

async function sendGetBlockByIDRequest(ix, opts) {
  const httpRequest = opts.httpRequest || defaultHttpRequest

  const res = await httpRequest({
    hostname: opts.node,
    port: 443,
    path: `/blocks/${ix.block.id}`,
    method: "GET",
    body: null
  })

  return constructResponse(ix, res)
}

async function sendGetBlockByHeightRequest(ix, opts) {
  const httpRequest = opts.httpRequest || defaultHttpRequest

  const res = await httpRequest({
    hostname: opts.node,
    port: 443,
    path: `/blocks?height=${ix.block.height}`,
    method: "GET",
    body: null
  })

  return constructResponse(ix, res)
}

async function sendGetBlockRequest(ix, opts) {
  const httpRequest = opts.httpRequest || defaultHttpRequest

  const res = await httpRequest({
    hostname: opts.node,
    port: 443,
    path: `/blocks`,
    method: "GET",
    body: null
  })

  return constructResponse(ix, res)
}

function constructResponse(ix, res) {
  const ret = response()
  ret.tag = ix.tag
  ret.block = res.map(block => ({ // Multiple Blocks now are to be returned by the REST API, we'll need to account for that in how we return blocks back
    id: block.header.id,
    parentId: block.header.parent_id,
    height: block.header.height,
    timestamp: block.header.timestamp,
    parentVoterSignature: block.header.parent_voter_signature, // NEW IN REST API!
    collectionGuarantees: block.payload.collection_guarantees.map(collectionGuarantee => ({
      collectionId: collectionGuarantee.collection_id,
      signerIds: collectionGuarantee.signer_ids,
      signatures: collectionGuarantee.signatures, // SCHEMA HAS THIS IS SINGULAR "SIGNATURE", CHECK ON THIS
    })),
    blockSeals:  block.payload.block_seals.map(blockSeal => ({ // LOTS OF ISSUES HERE, CHECK ON THIS
      blockId: blockSeal.block_id,
      executionReceiptId: null, // REMOVED IN SCHEMA, CHECK ON THIS
      executionReceiptSignatures: null, // REMOVED IN SCHEMA, CHECK ON THIS
      resultApprovalSignatures: null, // REMOVED IN SCHEMA, CHECK ON THIS
    })),
    signatures: null, // REMOVED IN SCHEMA, CHECK ON THIS
  }))

  return ret
}

export async function sendGetBlock(ix, opts = {}) {
  invariant(opts.node, `SDK Send Get Block Error: opts.node must be defined.`)

  ix = await ix

  const interactionHasBlockID = ix.block.id !== null
  const interactionHasBlockHeight = ix.block.height !== null

  if (interactionHasBlockID) {
    return await sendGetBlockByIDRequest(ix, opts)
  } else if (interactionHasBlockHeight) {
    return await sendGetBlockByHeightRequest(ix, opts)
  } else {
    return await sendGetBlockRequest(ix, opts)
  }
}
