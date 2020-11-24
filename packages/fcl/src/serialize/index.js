import {interaction, pipe} from "@onflow/interaction"
import {resolve as defaultResolve} from "@onflow/sdk-resolve"
import {config} from "@onflow/config"

export const serialize = async (args = [], opts = {}) => {
  const resolveFunction = await config().get(
    "sdk.resolve",
    opts.resolve || defaultResolve(opts)
  )
  if (Array.isArray(args)) args = await pipe(interaction(), args)
  return JSON.stringify(await resolveFunction(opts)(args), null, 2)
}
