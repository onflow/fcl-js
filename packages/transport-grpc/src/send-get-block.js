import {invariant} from "@onflow/util-invariant"
import {
  GetBlockByIDRequest,
  GetBlockByHeightRequest,
  GetLatestBlockRequest,
  AccessAPI,
} from "@onflow/protobuf"
import {unary as defaultUnary} from "./unary"

const u8ToHex = (u8, context) => context.Buffer.from(u8).toString("hex")
const hexBuffer = (hex, context) => context.Buffer.from(hex, "hex")

async function sendGetBlockByIDRequest(ix, context, opts) {
  const unary = opts.unary || defaultUnary

  const req = new GetBlockByIDRequest()
  req.setId(hexBuffer(ix.block.id, context))

  const res = await unary(opts.node, AccessAPI.GetBlockByID, req, context)

  return constructResponse(ix, context, res)
}

async function sendGetBlockByHeightRequest(ix, context, opts) {
  const unary = opts.unary || defaultUnary

  const req = new GetBlockByHeightRequest()
  req.setHeight(Number(ix.block.height))

  const res = await unary(opts.node, AccessAPI.GetBlockByHeight, req, context)

  return constructResponse(ix, context, res)
}

async function sendGetBlockRequest(ix, context, opts) {
  const unary = opts.unary || defaultUnary

  const req = new GetLatestBlockRequest()

  if (ix.block?.isSealed) {
    req.setIsSealed(ix.block.isSealed)
  }

  const res = await unary(opts.node, AccessAPI.GetLatestBlock, req, context)

  return constructResponse(ix, context, res)
}

function constructResponse(ix, context, res) {
  const block = res.getBlock()

  const collectionGuarantees = block.getCollectionGuaranteesList()
  const blockSeals = block.getBlockSealsList()

  const ret = context.response()
  ret.tag = ix.tag
  ret.block = {
    id: u8ToHex(block.getId_asU8(), context),
    parentId: u8ToHex(block.getParentId_asU8(), context),
    height: block.getHeight(),
    timestamp: block.getTimestamp().toDate().toISOString(),
    collectionGuarantees: collectionGuarantees.map(collectionGuarantee => ({
      collectionId: u8ToHex(
        collectionGuarantee.getCollectionId_asU8(),
        context
      ),
      signerIds: collectionGuarantee
        .getSignerIdsList_asU8()
        .map(id => u8ToHex(id, context)),
    })),
    blockSeals: blockSeals.map(blockSeal => ({
      blockId: u8ToHex(blockSeal.getBlockId_asU8(), context),
      executionReceiptId: u8ToHex(
        blockSeal.getExecutionReceiptId_asU8(),
        context
      ),
    })),
  }

  return ret
}

export async function sendGetBlock(ix, context = {}, opts = {}) {
  invariant(opts.node, `SDK Send Get Block Error: opts.node must be defined.`)
  invariant(
    context.response,
    `SDK Send Get Block Error: context.response must be defined.`
  )
  invariant(
    context.Buffer,
    `SDK Send Get Block Error: context.Buffer must be defined.`
  )

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
