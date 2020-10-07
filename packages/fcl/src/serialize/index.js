import {interaction, pipe} from "@onflow/interaction"
import {resolve} from "@onflow/sdk-resolve"

export const serialize = async (args = [], opts= {}) => {
  if (Array.isArray(args)) args = await pipe(interaction(), args)
  return JSON.stringify(await resolve(opts)(args))
}
