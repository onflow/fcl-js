import {GetLatestBlockRequest, AccessAPI} from "@onflow/protobuf"
import {response} from "@onflow/response"
import {bufferToHexString} from "@onflow/bytes"
import {unary} from "./unary"

export async function sendGetLatestBlock(ix, opts = {}) {
  const req = new GetLatestBlockRequest()
  req.setIsSealed(ix.isSealed)

  const res = await unary(opts.node, AccessAPI.GetLatestBlock, req)

  const latestBlock = res.getBlock()

  const collectionGuarantees = latestBlock.getCollectionGuaranteesList()
  const blockSeals = latestBlock.getBlockSealsList()
  const signatures = latestBlock.getSignaturesList()

  const ret = response()
  ret.tag = ix.tag
  ret.latestBlock = {
    id: bufferToHexString(latestBlock.getId_asU8()),
    parentId: bufferToHexString(latestBlock.getParentId_asU8()),
    height: latestBlock.getHeight(),
    timestamp: latestBlock.getTimestamp(),
    collectionGuarantees: collectionGuarantees.map(collectionGuarantee => ({
      collectionId: bufferToHexString(collectionGuarantee.getCollectionId_asU8()),
      signatures: collectionGuarantee.getSignaturesList()
    })),
    blockSeals: blockSeals.map(blockSeal => ({
      blockId: bufferToHexString(blockSeal.getBlockId_asU8()),
      executionReceiptId: bufferToHexString(blockSeal.getExecutionReceiptId_asU8()),
      executionReceiptSignatures: blockSeal.getExecutionReceiptSignaturesList(),
      resultApprovalSignatures: blockSeal.getResultApprovalSignaturesList(),
    })),
    signatures: signatures,
  }

  return ret
}
