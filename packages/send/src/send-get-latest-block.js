import {GetLatestBlockRequest, AccessAPI} from "@onflow/protobuf"
import {response} from "@onflow/response"
import {unary} from "./unary"

const u8ToHex = u8 => Buffer.from(u8).toString("hex")

export async function sendGetLatestBlock(ix, opts = {}) {
  const req = new GetLatestBlockRequest()
  req.setIsSealed(ix.latestBlock.isSealed)

  const res = await unary(opts.node, AccessAPI.GetLatestBlock, req)

  const latestBlock = res.getBlock()

  const collectionGuarantees = latestBlock.getCollectionGuaranteesList()
  const blockSeals = latestBlock.getBlockSealsList()
  const signatures = latestBlock.getSignaturesList()

  const ret = response()
  ret.tag = ix.tag
  ret.latestBlock = {
    id: u8ToHex(latestBlock.getId_asU8()),
    parentId: u8ToHex(latestBlock.getParentId_asU8()),
    height: latestBlock.getHeight(),
    timestamp: latestBlock.getTimestamp(),
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
