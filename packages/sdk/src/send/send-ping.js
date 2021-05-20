import {AccessAPI, PingRequest} from "@onflow/protobuf"
import {response} from "../response/response.js"
import {unary as defaultUnary} from "./unary"

export async function sendPing(ix, opts = {}) {
  const unary = opts.unary || defaultUnary

  ix = await ix

  const req = new PingRequest()

  const res = await unary(opts.node, AccessAPI.Ping, req)

  let ret = response()
  ret.tag = ix.tag

  return ret
}
