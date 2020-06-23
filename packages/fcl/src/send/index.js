import {build, send as sdkSend} from "@onflow/sdk"
import {resolve} from "../resolve"
import {config} from "../config"

export const send = async (args = [], opts = {}) => {
  opts.node = opts.node || (await config().get("accessNode.api"))
  if (Array.isArray(args)) args = build(args)
  return sdkSend(await resolve(args), opts)
}
