import {invariant} from "@onflow/util-invariant"

export async function sendPing(ix, context = {}, opts = {}) {
  invariant(opts.node, `SDK Send Ping Error: opts.node must be defined.`)
  invariant(context.response, `SDK Send Ping Error: context.response must be defined.`)

  await httpRequest({
    hostname: opts.node,
    path: "/status",
    method: "GET",
    body: null
  })

  let ret = context.response()
  ret.tag = ix.tag

  return ret
}
