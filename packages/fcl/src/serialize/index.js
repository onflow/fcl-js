import {interaction, pipe} from "@onflow/sdk"
import {resolve as defaultResolve} from "@onflow/sdk"
import {config, createSignableVoucher} from "@onflow/sdk"

export const serialize = async (args = [], opts = {}) => {
  const resolveFunction = await config.first(
    ["sdk.resolve"],
    opts.resolve || defaultResolve
  )

  if (Array.isArray(args)) args = await pipe(interaction(), args)

  return JSON.stringify(
    createSignableVoucher(await resolveFunction(args)),
    null,
    2
  )
}
