import {interaction, pipe} from "@onflow/interaction"
import {send as defaultSend} from "@onflow/send"
import {resolve as defaultResolve} from "@onflow/sdk-resolve"
import {config} from "@onflow/config"

export const send = async (args = [], opts = {}) => {
  const sendFunction = await config().get("sdk.send", opts.send || defaultSend)
  const resolveFunction = await config().get(
    "sdk.resolve",
    opts.resolve || defaultResolve(opts)
  )
  if (Array.isArray(args)) args = pipe(interaction(), args)
  return sendFunction(await resolveFunction(args), opts)
}
