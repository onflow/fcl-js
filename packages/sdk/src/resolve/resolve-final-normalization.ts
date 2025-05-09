import {sansPrefix} from "@onflow/util-address"
import {Interaction} from "@onflow/typedefs"

export async function resolveFinalNormalization(
  ix: Interaction
): Promise<Interaction> {
  for (let key of Object.keys(ix.accounts)) {
    ix.accounts[key].addr = sansPrefix(ix.accounts[key].addr)
  }
  return ix
}
