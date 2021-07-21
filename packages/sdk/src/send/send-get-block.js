import {GetBlockByIDRequest, GetBlockByHeightRequest, GetLatestBlockRequest, AccessAPI} from "@onflow/protobuf"
import {response} from "../response/response.js"
import {unary as defaultUnary} from "./unary"

const u8ToHex = u8 => Buffer.from(u8).toString("hex")
const hexBuffer = hex => Buffer.from(hex, "hex")

async function sendGetBlockByIDRequest(ix, opts) {
  const unary = opts.unary || defaultUnary

  const req = new GetBlockByIDRequest()
  req.setId(hexBuffer(ix.block.id))

  const res = await unary(opts.node, AccessAPI.GetBlockByID, req)

  return constructResponse(ix, res)
}

async function sendGetBlockByHeightRequest(ix, opts) {
  const unary = opts.unary || defaultUnary

  const req = new GetBlockByHeightRequest()
  req.setHeight(Number(ix.block.height))
    
  const res = await unary(opts.node, AccessAPI.GetBlockByHeight, req)

  return constructResponse(ix, res)
}

async function sendGetBlockRequest(ix, opts) {
  const unary = opts.unary || defaultUnary

  const req = new GetLatestBlockRequest()

  if (ix.block?.isSealed) {
    req.setIsSealed(ix.block.isSealed)
  }

  const res = await unary(opts.node, AccessAPI.GetLatestBlock, req)

  return constructResponse(ix, res)
}

function constructResponse(ix, res) {
  const block = res.getBlock()

  const collectionGuarantees = block.getCollectionGuaranteesList()
  const blockSeals = block.getBlockSealsList()
  const signatures = (block.getSignaturesList()).map(u8ToHex)

  const ret = response()
  ret.tag = ix.tag
  ret.block = {
    id: u8ToHex(block.getId_asU8()),
    parentId: u8ToHex(block.getParentId_asU8()),
    height: block.getHeight(),
    timestamp: block.getTimestamp().toDate().toISOString(),
    collectionGuarantees: collectionGuarantees.map(collectionGuarantee => ({
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
