import {GetLatestBlockRequest, ObserveService} from "@onflow/protobuf"
import {response} from "@onflow/response"
import {bufferToHexString} from "@onflow/bytes"
import {unary} from "./unary"

export async function sendGetLatestBlock(ix, opts = {}) {
  const req = new GetLatestBlockRequest()
  req.setIsSealed(ix.isSealed)

  const res = await unary(opts.node, ObserveService.GetLatestBlock, req)

  const latestBlock = res.getBlock()

  const ret = response()
  ret.tag = ix.tag
  ret.latestBlock = {
    blockHash: bufferToHexString(latestBlock.getHash_asU8()),
    previousBlockHash: bufferToHexString(
      latestBlock.getPreviousblockhash_asU8()
    ),
    blockNumber: latestBlock.getNumber(),
  }

  return ret
}
