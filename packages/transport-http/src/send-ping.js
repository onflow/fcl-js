import {invariant} from "@onflow/util-invariant"

export async function sendPing(ix, context = {}, opts = {}) {
  invariant(opts.node, `SDK Send Ping Error: opts.node must be defined.`)
  invariant(context.response, `SDK Send Ping Error: context.response must be defined.`)

  // const unary = opts.unary || defaultUnary

  // ix = await ix

  // const req = new PingRequest()

  // const res = await unary(opts.node, AccessAPI.Ping, req)

  let ret = contnext.response()
  ret.tag = ix.tag

  return ret
}
