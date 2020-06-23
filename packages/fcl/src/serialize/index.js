import {build} from "@onflow/sdk"
import {resolve} from "../resolve"

export const serialize = async (args = []) => {
  if (Array.isArray(args)) args = await build(args)
  return JSON.stringify(await resolve(args))
}
