import {isTransaction} from "../interaction/interaction"
import {Interaction} from "@onflow/typedefs"
import {SdkContext} from "../context/context"

export async function resolveComputeLimit(
  ix: Interaction,
  context: SdkContext
): Promise<Interaction> {
  if (isTransaction(ix)) {
    ix.message.computeLimit = ix.message.computeLimit || context.computeLimit
  }
  return ix
}
