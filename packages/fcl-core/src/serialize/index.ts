import {
  config,
  createSignableVoucher,
  resolve as defaultResolve,
  interaction,
  InteractionBuilderFn,
  pipe,
} from "@onflow/sdk"
import {Interaction} from "@onflow/typedefs"

export interface SerializeOptions {
  resolve?: InteractionBuilderFn
}

export const serialize = async (
  args: (InteractionBuilderFn | false)[] | Interaction,
  opts: SerializeOptions = {}
) => {
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
