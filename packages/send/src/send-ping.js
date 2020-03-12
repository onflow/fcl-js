import {ObserveService, PingRequest} from "@onflow/protobuf"
import {response} from "@onflow/response"
import {bufferToHexString} from "@onflow/bytes"
import {unary} from "./unary"

export async function sendPing(ix, opts = {}) {
  const req = new PingRequest()

  const res = await unary(opts.node, ObserveService.Ping, req)

  let ret = response()
  ret.tag = ix.tag
  ret.ping = bufferToHexString(res.getAddress_asU8())

  return ret
}
