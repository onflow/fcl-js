import * as ix from "../interaction/interaction.js"
import {response} from "../response/response.js"
import {config} from "../config"
import {resolve as defaultResolve} from "../resolve/resolve.js"
import {send as defaultGRPCSend} from "@onflow/sdk-send-grpc"

export const send = async (args = [], opts = {}) => {
  const sendFn = await config.first(
    ["sdk.transport", "sdk.send"],
    opts.send || defaultGRPCSend
  )

  const resolveFn = await config.first(
    ["sdk.resolve"],
    opts.resolve || defaultResolve
  )

  opts.node = opts.node || (await config().get("accessNode.api"))

  if (Array.isArray(args)) args = ix.pipe(ix.interaction(), args)
  return sendFn(await resolveFn(args), context = {config, response, ix}, opts)
}
