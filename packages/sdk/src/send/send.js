import {interaction, pipe} from "../interaction/interaction.js"
import {config} from "../config"
import {resolve as defaultResolve} from "../resolve/resolve.js"
import {send as defaultSend} from "./sdk-send.js"

export const send = async (args = [], opts = {}) => {
  const sendFn = await config.first(
    ["sdk.transport", "sdk.send"],
    opts.send || defaultSend
  )

  const resolveFn = await config.first(
    ["sdk.resolve"],
    opts.resolve || defaultResolve
  )

  if (Array.isArray(args)) args = pipe(interaction(), args)
  return sendFn(await resolveFn(args), opts)
}
