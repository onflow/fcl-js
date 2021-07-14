import {GetLatestBlockHeaderRequest, GetBlockHeaderByIDRequest, GetBlockHeaderByHeightRequest, AccessAPI} from "@onflow/protobuf"
import {response} from "../response/response.js"
import {unary as defaultUnary} from "./unary"

const u8ToHex = u8 => Buffer.from(u8).toString("hex")
const hexBuffer = hex => Buffer.from(hex, "hex")

async function sendGetBlockHeaderByIDRequest(ix, opts) {
  const unary = opts.unary || defaultUnary

  let req = new GetBlockHeaderByIDRequest()
  req.setId(hexBuffer(ix.block.id))

  let res = await unary(opts.node, AccessAPI.GetBlockHeaderByID, req)

  return constructResponse(ix, res)
}

async function sendGetBlockHeaderByHeightRequest(ix, opts) {
  const unary = opts.unary || defaultUnary

  let req = new GetBlockHeaderByHeightRequest()
  req.setHeight(Number(ix.block.height))

  let res = await unary(opts.node, AccessAPI.GetBlockHeaderByHeight, req)

  return constructResponse(ix, res)
}

async function sendGetLatestBlockHeaderRequest(ix, opts) {
  const unary = opts.unary || defaultUnary

  let req = new GetLatestBlockHeaderRequest()

  if (ix.block?.isSealed) {
    req.setIsSealed(ix.block.isSealed)
  }

  let res = await unary(opts.node, AccessAPI.GetLatestBlockHeader, req)

  return constructResponse(ix, res)
}

function constructResponse(ix, res) {
  const blockHeader = res.getBlock()

  const ret = response()
  ret.tag = ix.tag
  ret.blockHeader = {
    id: u8ToHex(blockHeader.getId_asU8()),
    parentId: u8ToHex(blockHeader.getParentId_asU8()),
    height: blockHeader.getHeight(),
    timestamp: blockHeader.getTimestamp().toDate().toISOString(),
  }

  return ret
}

export async function sendGetBlockHeader(ix, opts = {}) {
  ix = await ix

  if (ix.block.id !== null) {
    return await sendGetBlockHeaderByIDRequest(ix, opts)
  } else if (ix.block.height !== null) {
    return await sendGetBlockHeaderByHeightRequest(ix, opts)
  } else {
    return await sendGetLatestBlockHeaderRequest(ix, opts)
  }
}
