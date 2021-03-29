import {interaction, pipe} from "@onflow/sdk"
import {resolve as defaultResolve} from "@onflow/sdk"
import {config} from "@onflow/config"

export const serialize = async (args = [], opts = {}) => {
  // prettier-ignore
  const resolveFunction = await config()
    .get("sdk.resolve", opts.resolve || defaultResolve(opts))

  if (Array.isArray(args)) args = await pipe(interaction(), args)
  return JSON.stringify(await resolveFunction(args), null, 2)
}
