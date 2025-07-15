import {isTransaction} from "../interaction/interaction"
import {Interaction} from "@onflow/typedefs"
import {SdkContext} from "../context/context"
import {withGlobalContext} from "../context/global"

export function createResolveComputeLimit(context: SdkContext) {
  return async function resolveComputeLimit(
    ix: Interaction
  ): Promise<Interaction> {
    if (isTransaction(ix)) {
      ix.message.computeLimit = ix.message.computeLimit || context.computeLimit
    }
    return ix
  }
}

/**
 * Resolves the compute limit for a transaction from configuration or applies default values.
 *
 * @param ix The interaction object to resolve compute limit for
 * @returns The interaction with resolved compute limit
 */
export const resolveComputeLimit = withGlobalContext(createResolveComputeLimit)
