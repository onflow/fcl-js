import {
  resolve as sdkResolve,
  resolveAccounts,
  resolveSignatures,
  resolveValidators,
  resolveRefBlockId,
} from "@onflow/sdk"
import {resolveCadence} from "@onflow/sdk-resolve-cadence"
import {resolveArguments} from "@onflow/sdk-resolve-arguments"
import {config} from "@onflow/config"

export const resolve = async ix => {
  return sdkResolve(ix, [
    resolveCadence,
    resolveArguments,
    resolveAccounts,
    resolveRefBlockId({node: await config().get("accessNode.api")}),
    resolveSignatures,
    resolveValidators,
  ])
}
