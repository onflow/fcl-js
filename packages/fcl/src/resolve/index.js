import {
  resolve as sdkResolve,
  resolveParams,
  resolveArguments,
  resolveAccounts,
  resolveSignatures,
  resolveValidators,
} from "@onflow/sdk"

export const resolve = async ix => {
  return sdkResolve(ix, [resolveParams, resolveArguments, resolveAccounts, resolveSignatures, resolveValidators])
}
