import {invariant} from "@onflow/util-invariant"
import {httpRequest as defaultHttpRequest} from "./http-request.js"
import { IIx } from "@onflow/typedefs"; 

interface IContext {
  response?: Function;
  ix?: IIx;
}

interface IOpts {
  node?: string
  httpRequest?: any,

}

export async function sendPing(ix: IIx, context: IContext = {}, opts: IOpts = {}) {
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

  let ret = typeof context?.response === 'function' ? context.response() : {}
  ret.tag = ix.tag

  return ret
}
