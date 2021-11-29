import {invariant} from "@onflow/util-invariant"
import {response} from "../response/response.js"

export async function sendPing(ix, opts = {}) {
  // invariant(opts.node, `SDK Send Ping Error: opts.node must be defined.`)

  // const unary = opts.unary || defaultUnary

  // ix = await ix

  // const req = new PingRequest()

  // const res = await unary(opts.node, AccessAPI.Ping, req)

  // let ret = response()
  // ret.tag = ix.tag

  // return ret
}
