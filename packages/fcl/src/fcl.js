import * as sdk from "@onflow/sdk"
import {encode} from "@onflow/resolver-encode"
import {resolveSignatures} from "@onflow/resolver-signatures"
import {send as baseSend} from "@onflow/send"

const NODE = "http://localhost:8080"

export const send = (args = [], opts = {}) => {
  opts.node = opts.node || NODE

  if (Array.isArray(args)) args = sdk.build(args)

  return sdk.pipe(args, [
    sdk.resolve([sdk.resolveParams, encode, resolveSignatures]),
    ix => baseSend(ix, opts),
  ])
}
