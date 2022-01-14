import {invariant} from "@onflow/util-invariant"

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

export async function sendGetLatestBlock(ix, context = {}, opts = {}) {
  invariant(opts.node, `SDK Send Get Latest Block Error: opts.node must be defined.`)
  invariant(context.response, `SDK Send Get Latest Block Error: context.response must be defined.`)

  ix = await ix

  if (ix.latestBlock && ix.latestBlock.isSealed) {
    latestBlockDeprecationNotice()
  }

  const height = ix.latestBlock?.isSealed || ix.block?.isSealed
    ? "sealed"
    : "final"

  const res = await httpRequest({
    hostname: opts.node,
    path: `/v1/blocks?height=${height}&expand=payload`,
    method: "GET",
    body: null
  })

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
