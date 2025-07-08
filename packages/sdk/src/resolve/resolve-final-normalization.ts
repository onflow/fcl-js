import {sansPrefix} from "@onflow/util-address"
import {Interaction} from "@onflow/typedefs"

/**
 * Normalizes account addresses by removing the "0x" prefix from all account addresses in the interaction.
 *
 * @param ix The interaction object to normalize
 * @returns The interaction with normalized account addresses
 */
export async function resolveFinalNormalization(
  ix: Interaction
): Promise<Interaction> {
  for (let key of Object.keys(ix.accounts)) {
    ix.accounts[key].addr = sansPrefix(ix.accounts[key].addr)
  }
  return ix
}
