import {invariant} from "@onflow/util-invariant"
import {AccessAPI, GetNetworkParametersRequest} from "@onflow/protobuf"
import {unary as defaultUnary} from "./unary"

export async function sendGetNetworkParameters(ix, context = {}, opts = {}) {
  invariant(
    opts.node,
    `SDK Send Get Transaction Error: opts.node must be defined.`
  )
  invariant(
    context.response,
    `SDK Send Get Transaction Error: context.response must be defined.`
  )

  const unary = opts.unary || defaultUnary

  ix = await ix

  const req = new GetNetworkParametersRequest()

  const res = await unary(opts.node, AccessAPI.GetNetworkParameters, req, context)

  let ret = context.response()
  ret.tag = ix.tag

  let chainId = res.getChainId()
  ret.networkParameters = {
    chainId: chainId
  }

  return ret
}
