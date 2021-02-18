import {GetLatestBlockHeaderRequest, GetBlockHeaderByIDRequest, GetBlockHeaderByHeightRequest, AccessAPI} from "@onflow/protobuf"
import {response} from "../response/response.js"
import {unary} from "./unary"

const u8ToHex = u8 => Buffer.from(u8).toString("hex")
const hexBuffer = hex => Buffer.from(hex, "hex")

export async function sendGetBlockHeader(ix, opts = {}) {
  ix = await ix

  let req
  if (ix.block.id) {
    req = new GetBlockHeaderByIDRequest()
    req.setBlockId(hexBuffer(ix.block.id))
  } else if (ix.block.height) {
    req = new GetBlockHeaderByHeightRequest()
    req.setBlockHeight(Number(ix.block.height))
  } else {
    req = new GetLatestBlockHeaderRequest()
  }

  const res = await unary(opts.node, AccessAPI.GetBlockByID, req)

  const blockHeader = res.getBlock()

  const ret = response()
  ret.tag = ix.tag
  ret.blockHeader = {
    id: u8ToHex(blockHeader.getId_asU8()),
    parentId: u8ToHex(blockHeader.getParentId_asU8()),
    height: blockHeader.getHeight(),
    timestamp: blockHeader.getTimestamp(),
  }

  return ret
}
