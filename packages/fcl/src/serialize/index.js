import {interaction, pipe} from "@onflow/interaction"
import {resolve} from "../resolve"

export const serialize = async (args = []) => {
  if (Array.isArray(args)) args = await pipe(interaction(), args)
  return JSON.stringify(await resolve(args))
}
