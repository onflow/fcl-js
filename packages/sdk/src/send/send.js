import {interaction, pipe} from "../interaction/interaction.js"
import * as ixModule from "../interaction/interaction.js"
import {invariant} from "../build/build-invariant.js"
import {response} from "../response/response.js"
import {config} from "../config"
import {resolve as defaultResolve} from "../resolve/resolve.js"

export const send = async (args = [], opts = {}) => {
  const sendFn = await config.first(
    ["sdk.transport", "sdk.send"],
    opts.send
  )

  invariant(
    sendFn, 
    `Required value for sdk.transport is not defined in config. See: ${"https://github.com/onflow/fcl-js/blob/master/packages/sdk/CHANGELOG.md#0057-alpha1----2022-01-21"}`
  )

  const resolveFn = await config.first(
    ["sdk.resolve"],
    opts.resolve || defaultResolve
  )

  opts.node = opts.node || (await config().get("accessNode.api"))

  if (Array.isArray(args)) args = pipe(interaction(), args)
  return sendFn(await resolveFn(args), {config, response, ix: ixModule}, opts)
}
