import {GetBlockByIDRequest, AccessAPI} from "@onflow/protobuf"
import {response} from "../response/response.js"
import {unary} from "./unary"

const u8ToHex = u8 => Buffer.from(u8).toString("hex")
const hexBuffer = hex => Buffer.from(hex, "hex")

export async function sendGetBlockById(ix, opts = {}) {
  ix = await ix

  const req = new GetBlockByIDRequest()
  req.setId(hexBuffer(ix.block.id))

  const res = await unary(opts.node, AccessAPI.GetBlockByID, req)

  const block = res.getBlock()

  const collectionGuarantees = block.getCollectionGuaranteesList()
  const blockSeals = block.getBlockSealsList()
  const signatures = block.getSignaturesList()

  const ret = response()
  ret.tag = ix.tag
  ret.block = {
    id: u8ToHex(block.getId_asU8()),
    parentId: u8ToHex(block.getParentId_asU8()),
    height: block.getHeight(),
    timestamp: block.getTimestamp(),
    collectionGuarantees: collectionGuarantees.map(collectionGuarantee => ({
      collectionId: u8ToHex(collectionGuarantee.getCollectionId_asU8()),
      signatures: collectionGuarantee.getSignaturesList(),
    })),
    blockSeals: blockSeals.map(blockSeal => ({
      blockId: u8ToHex(blockSeal.getBlockId_asU8()),
      executionReceiptId: u8ToHex(blockSeal.getExecutionReceiptId_asU8()),
      executionReceiptSignatures: blockSeal.getExecutionReceiptSignaturesList(),
      resultApprovalSignatures: blockSeal.getResultApprovalSignaturesList(),
    })),
    signatures: signatures,
  }

  return ret
}
