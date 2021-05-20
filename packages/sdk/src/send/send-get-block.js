import {GetBlockByIDRequest, GetBlockByHeightRequest, GetLatestBlockRequest, AccessAPI} from "@onflow/protobuf"
import {response} from "../response/response.js"
import {unary as defaultUnary} from "./unary"

const u8ToHex = u8 => Buffer.from(u8).toString("hex")
const hexBuffer = hex => Buffer.from(hex, "hex")

export async function sendGetBlock(ix, opts = {}) {
  const unary = opts.unary || defaultUnary

  ix = await ix

  let req
  let res
  if (ix.block.id) {
    req = new GetBlockByIDRequest()
    req.setId(hexBuffer(ix.block.id))

    res = await unary(opts.node, AccessAPI.GetBlockByID, req)
  } else if (ix.block.height) {
    req = new GetBlockByHeightRequest()
    req.setHeight(Number(ix.block.height))
    
    res = await unary(opts.node, AccessAPI.GetBlockByHeight, req)
  } else {
    req = new GetLatestBlockRequest()

    if (ix.block && ix.block.isSealed) {
      req.setIsSealed(ix.block.isSealed)
    }

    res = await unary(opts.node, AccessAPI.GetLatestBlock, req)
  }

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
