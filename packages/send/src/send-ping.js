import {AccessAPI, PingRequest} from "@onflow/protobuf"
import {response} from "@onflow/response"
import {unary} from "./unary"

export async function sendPing(ix, opts = {}) {
  const req = new PingRequest()

  const res = await unary(opts.node, AccessAPI.Ping, req)

  let ret = response()
  ret.tag = ix.tag

  return ret
}
