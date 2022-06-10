import {isTransaction} from "../interaction/interaction.js"
import {config} from "@onflow/config"
import * as logger from "@onflow/util-logger"

const DEFAULT_COMPUTE_LIMIT = 100

export async function resolveComputeLimit(ix) {
  if (isTransaction(ix)) {
    ix.message.computeLimit =
      ix.message.computeLimit || (await config.get("fcl.limit"))

    if (!ix.message.computeLimit) {
      logger.log.deprecate({
        pkg: "FCL/SDK",
        subject:
          "The built-in default compute limit (DEFAULT_COMPUTE_LIMIT=10)",
        transition:
          "https://github.com/onflow/flow-js-sdk/blob/master/packages/sdk/TRANSITIONS.md#0009-deprecate-default-compute-limit",
      })
      ix.message.computeLimit = DEFAULT_COMPUTE_LIMIT
    }
  }
  return ix
}
