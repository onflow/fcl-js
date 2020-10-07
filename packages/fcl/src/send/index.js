import {interaction, pipe} from "@onflow/interaction"
import {send as baseSend} from "@onflow/send"
import {resolve} from "@onflow/sdk-resolve"

export const send = async (args = [], opts = {}) => {
  if (Array.isArray(args)) args = pipe(interaction(), args)
  return baseSend(await resolve(opts)(args), opts)
}
