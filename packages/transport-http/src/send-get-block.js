import {invariant} from "@onflow/util-invariant"
import {httpRequest as defaultHttpRequest} from "./http-request.js"

async function sendGetBlockByIDRequest(ix, context, opts) {
  const httpRequest = opts.httpRequest || defaultHttpRequest

  const res = await httpRequest({
    hostname: opts.node,
    path: `/v1/blocks/${ix.block.id}?expand=payload`,
    method: "GET",
    body: null
  })

  return constructResponse(ix, context, res)
}

async function sendGetBlockByHeightRequest(ix, context, opts) {
  const httpRequest = opts.httpRequest || defaultHttpRequest

  const res = await httpRequest({
    hostname: opts.node,
    path: `/v1/blocks?height=${ix.block.height}&expand=payload`,
    method: "GET",
    body: null
  })

  return constructResponse(ix, context, res)
}

async function sendGetBlockRequest(ix, context, opts) {
  const httpRequest = opts.httpRequest || defaultHttpRequest

  const height = ix.block?.isSealed
    ? "sealed"
    : "final"

  const res = await httpRequest({
    hostname: opts.node,
    path: `/v1/blocks?height=${height}&expand=payload`,
    method: "GET",
    body: null
  })

  return constructResponse(ix, context, res)
}

function constructResponse(ix, context, res) {
  const block = res.length ? res[0] : null

  const ret = context.response()
  ret.tag = ix.tag
  ret.block = {
    id: block.header.id,
    parentId: block.header.parent_id,
    height: Number(block.header.height),
    timestamp: block.header.timestamp,
    collectionGuarantees: block.payload.collection_guarantees.map(collectionGuarantee => ({
      collectionId: collectionGuarantee.collection_id,
      signerIds: collectionGuarantee.signer_ids,
      signatures: collectionGuarantee.signature ? [collectionGuarantee.signature] : [],
    })),
    blockSeals:  block.payload.block_seals.map(blockSeal => ({
      blockId: blockSeal.block_id,
      executionReceiptId: blockSeal.result_id, 
      executionReceiptSignatures: [], 
      resultApprovalSignatures: [],
    })),
    signatures: []
  }

  return ret
}

export async function sendGetBlock(ix, context = {}, opts = {}) {
  invariant(opts.node, `SDK Send Get Block Error: opts.node must be defined.`)
  invariant(context.response, `SDK Send Get Block Error: context.response must be defined.`)

  ix = await ix

  const interactionHasBlockID = ix.block.id !== null
  const interactionHasBlockHeight = ix.block.height !== null

  if (interactionHasBlockID) {
    return await sendGetBlockByIDRequest(ix, context, opts)
  } else if (interactionHasBlockHeight) {
    return await sendGetBlockByHeightRequest(ix, context, opts)
  } else {
    return await sendGetBlockRequest(ix, context, opts)
  }
}
