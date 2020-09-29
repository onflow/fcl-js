import {
  resolve as sdkResolve,
  resolveArguments,
  resolveAccounts,
  resolveSignatures,
  resolveValidators,
  resolveRefBlockId,
} from "@onflow/sdk"
import {resolveCadence} from "@onflow/sdk-resolve-cadence"
import {config} from "@onflow/config"

export const resolve = async ix => {
  return sdkResolve(ix, [
    resolveCadence,
    resolveRefBlockId({node: await config().get("accessNode.api")}),
    resolveArguments,
    resolveAccounts,
    resolveSignatures,
    resolveValidators,
  ])
}
