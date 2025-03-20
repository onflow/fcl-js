import {config} from "@onflow/config"

export async function resolveIsSealed(ix) {
  if (ix.block.isSealed == null && !ix.block.id && !ix.block.height) {
    ix.block.isSealed = await config().get("fcl.isSealed", true)
  }

  return ix
}
