import {GetLatestBlockRequest, AccessAPI} from "@onflow/protobuf"
import {response} from "../response/response.js"
import {unary} from "./unary"

const u8ToHex = u8 => Buffer.from(u8).toString("hex")

const latestBlockDeprecationNotice = () => {
  console.error(
    `
          %c@onflow/send Deprecation Notice
          ========================

          Operating upon data of the latestBlock field of the interaction object is deprecated and will no longer be recognized in future releases of @onflow/send.
          Find out more here: https://github.com/onflow/flow-js-sdk/blob/master/packages/send/WARNINGS.md#0001-Deprecating-latestBlock-field

          =======================
        `
      .replace(/\n\s+/g, "\n")
      .trim(),
    "font-weight:bold;font-family:monospace;"
  )
}

export async function sendGetLatestBlock(ix, opts = {}) {
  ix = await ix

  const req = new GetLatestBlockRequest()

  if (ix.latestBlock && ix.latestBlock.isSealed) {
    req.setIsSealed(ix.latestBlock.isSealed)
    latestBlockDeprecationNotice()
  }

  if (ix.block && ix.block.isSealed) {
    req.setIsSealed(ix.block.isSealed)
  }

  const res = await unary(opts.node, AccessAPI.GetLatestBlock, req)

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
