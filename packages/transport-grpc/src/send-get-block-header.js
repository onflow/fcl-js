import {invariant} from "@onflow/util-invariant"
import {GetLatestBlockHeaderRequest, GetBlockHeaderByIDRequest, GetBlockHeaderByHeightRequest, AccessAPI} from "@onflow/protobuf"
import {unary as defaultUnary} from "./unary"

const u8ToHex = u8 => Buffer.from(u8).toString("hex")
const hexBuffer = hex => Buffer.from(hex, "hex")

async function sendGetBlockHeaderByIDRequest(ix, context, opts) {
  const unary = opts.unary || defaultUnary

  const req = new GetBlockHeaderByIDRequest()
  req.setId(hexBuffer(ix.block.id))

  const res = await unary(opts.node, AccessAPI.GetBlockHeaderByID, req, context)

  return constructResponse(ix, context, res)
}

async function sendGetBlockHeaderByHeightRequest(ix, context, opts) {
  const unary = opts.unary || defaultUnary

  const req = new GetBlockHeaderByHeightRequest()
  req.setHeight(Number(ix.block.height))

  const res = await unary(opts.node, AccessAPI.GetBlockHeaderByHeight, req, context)

  return constructResponse(ix, context, res)
}

async function sendGetLatestBlockHeaderRequest(ix, context, opts) {
  const unary = opts.unary || defaultUnary

  const req = new GetLatestBlockHeaderRequest()

  if (ix.block?.isSealed) {
    req.setIsSealed(ix.block.isSealed)
  }

  const res = await unary(opts.node, AccessAPI.GetLatestBlockHeader, req, context)

  return constructResponse(ix, context, res)
}

function constructResponse(ix, context, res) {
  const blockHeader = res.getBlock()

  const ret = context.response()
  ret.tag = ix.tag
  ret.blockHeader = {
    id: u8ToHex(blockHeader.getId_asU8()),
    parentId: u8ToHex(blockHeader.getParentId_asU8()),
    height: blockHeader.getHeight(),
    timestamp: blockHeader.getTimestamp().toDate().toISOString(),
  }

  return ret
}

export async function sendGetBlockHeader(ix, context = {}, opts = {}) {
  invariant(opts.node, `SDK Send Get Block Header Error: opts.node must be defined.`)
  invariant(context.response, `SDK Send Get Block Header Error: context.response must be defined.`)

  ix = await ix

  const interactionHasBlockID = ix.block.id !== null
  const interactionHasBlockHeight = ix.block.height !== null

  if (interactionHasBlockID) {
    return await sendGetBlockHeaderByIDRequest(ix, context, opts)
  } else if (interactionHasBlockHeight) {
    return await sendGetBlockHeaderByHeightRequest(ix, context, opts)
  } else {
    return await sendGetLatestBlockHeaderRequest(ix, context, opts)
  }
}
