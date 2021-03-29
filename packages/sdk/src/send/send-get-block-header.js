import {GetLatestBlockHeaderRequest, GetBlockHeaderByIDRequest, GetBlockHeaderByHeightRequest, AccessAPI} from "@onflow/protobuf"
import {response} from "../response/response.js"
import {unary as defaultUnary} from "./unary"

const u8ToHex = u8 => Buffer.from(u8).toString("hex")
const hexBuffer = hex => Buffer.from(hex, "hex")

export async function sendGetBlockHeader(ix, opts = {}) {
  const unary = opts.unary || defaultUnary

  ix = await ix

  let req
  let res
  if (ix.block.id) {
    req = new GetBlockHeaderByIDRequest()
    req.setId(hexBuffer(ix.block.id))

    res = await unary(opts.node, AccessAPI.GetBlockHeaderByID, req)
  } else if (ix.block.height) {
    req = new GetBlockHeaderByHeightRequest()
    req.setHeight(Number(ix.block.height))

    res = await unary(opts.node, AccessAPI.GetBlockHeaderByHeight, req)
  } else {
    req = new GetLatestBlockHeaderRequest()

    if (ix.block && ix.block.isSealed) {
      req.setIsSealed(ix.block.isSealed)
    }

    res = await unary(opts.node, AccessAPI.GetLatestBlockHeader, req)
  }

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
