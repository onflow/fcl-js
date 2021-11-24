import {invariant} from "@onflow/util-invariant"
import {response} from "../response/response.js"
import {httpRequest as defaultHttpRequest} from "./http-request.js"

const u8ToHex = u8 => Buffer.from(u8).toString("hex")
const hexBuffer = hex => Buffer.from(hex, "hex")

async function sendGetBlockByIDRequest(ix, opts) {
  const httpRequest = opts.httpRequest || defaultHttpRequest

  const res = await httpRequest({
    hostname: opts.node,
    port: 443,
    path: `/blocks/${ix.block.id}`,
    method: "GET",
    body: {}
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
    body: {}
  })

  return constructResponse(ix, res)
}

async function sendGetBlockRequest(ix, opts) {
 
}

function constructResponse(ix, res) {
  const block = res.getBlock()

  const collectionGuarantees = block.getCollectionGuaranteesList()
  const blockSeals = block.getBlockSealsList()
  const signatures = (block.getSignaturesList()).map(u8ToHex)

  const ret = response()
  ret.tag = ix.tag
  ret.block = {
    id: block.header.id,
    parentId: block.header.parent_id,
    height: block.header.height,
    timestamp: block.header.timestamp,
    collectionGuarantees: block.payload.map(collectionGuarantee => ({
      collectionId: u8ToHex(collectionGuarantee.getCollectionId_asU8()),
      signatures: (collectionGuarantee.getSignaturesList()).map(u8ToHex),
    })),
    blockSeals: blockSeals.map(blockSeal => ({
      blockId: u8ToHex(blockSeal.getBlockId_asU8()),
      executionReceiptId: u8ToHex(blockSeal.getExecutionReceiptId_asU8()),
      executionReceiptSignatures: (blockSeal.getExecutionReceiptSignaturesList()).map(u8ToHex),
      resultApprovalSignatures: (blockSeal.getResultApprovalSignaturesList()).map(u8ToHex),
    })),
    signatures: signatures,
  }

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
