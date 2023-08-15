import {invariant} from "@onflow/util-invariant"
import {httpRequest as defaultHttpRequest} from "./http-request.js"

interface IContext {
  response?: Function;
  ix?: any;
}

interface IOpts {
  node?: string
  httpRequest?: any,

}

export async function sendPing(ix, context: IContext = {}, opts: IOpts = {}) {
  invariant(Boolean(opts.node), `SDK Send Ping Error: opts.node must be defined.`)
  invariant(
    Boolean(context.response),
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
