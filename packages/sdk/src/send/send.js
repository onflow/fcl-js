import {Buffer} from "@onflow/rlp"
import {interaction, pipe} from "../interaction/interaction.js"
import * as ixModule from "../interaction/interaction.js"
import {response} from "../response/response.js"
import {config} from "@onflow/config"
import {resolve as defaultResolve} from "../resolve/resolve.js"
import {sendFn} from "./send-fn"

export const send = async (args = [], opts = {}) => {
  const resolveFn = await config.first(
    ["sdk.resolve"],
    opts.resolve || defaultResolve
  )

  if (Array.isArray(args)) args = pipe(interaction(), args)
  return sendFn(
    await resolveFn(args),
    {config, response, ix: ixModule, Buffer},
    opts
  )
}
