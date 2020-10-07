import {interaction, pipe} from "@onflow/interaction"
import {send as baseSend} from "@onflow/send"
import {config} from "@onflow/config"
import {resolve} from "../resolve"

export const send = async (args = [], opts = {}) => {
  if (Array.isArray(args)) args = pipe(interaction(), args)
  return baseSend(await resolve(args), opts)
}
