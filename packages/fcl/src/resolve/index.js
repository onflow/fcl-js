import {
  resolve as sdkResolve,
  resolveParams,
  resolveArguments,
  resolveAccounts,
  resolveSignatures,
  resolveValidators,
  resolveRefBlockId,
  resolveProposerSequenceNumber,
} from "@onflow/sdk"
import {config} from "@onflow/config"

export const resolve = async ix => {
  return sdkResolve(ix, [
    resolveRefBlockId({ node: await config().get("accessNode.api") }),
    resolveProposerSequenceNumber({ node: await config().get("accessNode.api") }),
    resolveParams,
    resolveArguments,
    resolveAccounts,
    resolveSignatures,
    resolveValidators,
  ])
}
