import * as sdk from "@onflow/sdk"
import {config} from "../config"
import {send as baseSend} from "@onflow/send"

export const send = async (args = [], opts = {}) => {
  opts.node = opts.node || await config().get("accessNode.api")

  if (Array.isArray(args)) args = sdk.build(args)

  const ix = await sdk.pipe(args, [
    sdk.resolve([
      sdk.resolveParams,
      sdk.resolvePayload,
      sdk.resolveAuthorizations,
    ]),
  ])

  return baseSend(ix, opts)
}
