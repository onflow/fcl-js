import {
  resolve,
  resolveParams,
  resolveAccounts,
  resolveSignatures,
  build,
  send as sdkSend,
} from "@onflow/sdk"
import {config} from "../config"

export const send = async (args = [], opts = {}) => {
  opts.node = opts.node || (await config().get("accessNode.api"))

  if (Array.isArray(args)) args = build(args)

  const ix = await resolve(args, [
    resolveParams,
    resolveAccounts,
    resolveSignatures,
  ])

  return sdkSend(ix, opts)
}
