import {
  resolve as sdkResolve,
  resolveParams,
  resolveAccounts,
  resolveSignatures,
} from "@onflow/sdk"

export const resolve = async ix => {
  return sdkResolve(ix, [resolveParams, resolveAccounts, resolveSignatures])
}
