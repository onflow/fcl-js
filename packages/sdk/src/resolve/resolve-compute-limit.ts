import {isTransaction} from "../interaction/interaction"
import {Interaction} from "@onflow/typedefs"
import {SdkContext} from "../context/context"

/**
 * Resolves the compute limit for a transaction from configuration or applies default values.
 *
 * @param ix The interaction object to resolve compute limit for
 * @returns The interaction with resolved compute limit
 */
export async function resolveComputeLimit(
  ix: Interaction,
  context: SdkContext
): Promise<Interaction> {
  if (isTransaction(ix)) {
    ix.message.computeLimit = ix.message.computeLimit || context.computeLimit
  }
  return ix
}
