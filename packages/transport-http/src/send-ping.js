import {invariant} from "@onflow/util-invariant"
import {httpRequest as defaultHttpRequest} from "./http-request.js"

export async function sendPing(ix, context = {}, opts = {}) {
  invariant(opts.node, `SDK Send Ping Error: opts.node must be defined.`)
  invariant(
    context.response,
    `SDK Send Ping Error: context.response must be defined.`
  )

  const httpRequest = opts.httpRequest || defaultHttpRequest

  await httpRequest({
    hostname: opts.node,
    path: "/v1/blocks?height=sealed",
    method: "GET",
    body: null,
  })

  let ret = context.response()
  ret.tag = ix.tag

  return ret
}
