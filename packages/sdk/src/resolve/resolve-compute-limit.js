import {isTransaction} from "../interaction/interaction.js"
import {config} from "@onflow/config"

const DEFAULT_COMPUTE_LIMIT = 10

export async function resolveComputeLimit(ix) {
  if (isTransaction(ix)) {
    ix.message.computeLimit =
      ix.message.computeLimit || (await config.get("sdk.defaultComputeLimit"))
    if (!ix.message.computeLimit) {
      logger.log({
        title: "FCL/SDK Deprecation Notice",
        message: `The built-in default compute limit (DEFAULT_COMPUTE_LIMIT=10) has been deprecated and will be removed in a future version of the Flow JS-SDK/FCL.
You can learn more (including a guide on common transition paths) here: https://github.com/onflow/flow-js-sdk/blob/master/packages/sdk/TRANSITIONS.md#0009-deprecate-default-compute-limit`,
        level: logger.LEVELS.warn,
      })
      ix.message.computeLimit = DEFAULT_COMPUTE_LIMIT
    }
  }
}
