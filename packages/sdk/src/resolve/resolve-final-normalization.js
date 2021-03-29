import {sansPrefix} from "@onflow/util-address"

export async function resolveFinalNormalization(ix) {
  for (let key of Object.keys(ix.accounts)) {
    ix.accounts[key].addr = sansPrefix(ix.accounts[key].addr)
  }
  return ix
}
