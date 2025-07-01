import {isTransaction} from "../interaction/interaction"
import {config} from "@onflow/config"
import * as logger from "@onflow/util-logger"
import {Interaction} from "@onflow/typedefs"

const DEFAULT_COMPUTE_LIMIT = 100

/**
 * Resolves the compute limit for a transaction from configuration or applies default values.
 *
 * @param ix The interaction object to resolve compute limit for
 * @returns The interaction with resolved compute limit
 */
export async function resolveComputeLimit(
  ix: Interaction
): Promise<Interaction> {
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
