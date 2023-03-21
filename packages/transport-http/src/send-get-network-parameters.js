import {invariant} from "@onflow/util-invariant"
import {httpRequest as defaultHttpRequest} from "./http-request.js"

export async function sendGetNetworkParameters(ix, context = {}, opts = {}) {
  invariant(
    opts.node,
    `SDK Send Get Network Parameters Error: opts.node must be defined.`
  )
  invariant(
    context.response,
    `SDK Send Get Network Parameters Error: context.response must be defined.`
  )

  const httpRequest = opts.httpRequest || defaultHttpRequest

  ix = await ix

  const res = await httpRequest({
    hostname: opts.node,
    path: `/v1/network/parameters`,
    method: "GET",
    body: null,
  })

  let ret = context.response()
  ret.tag = ix.tag

  ret.networkParameters = {
    chainId: res.chain_id,
  }
  return ret
}
