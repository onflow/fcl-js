import {config} from "@onflow/config"
import {isGetAccount, isScript} from "../interaction/interaction"

export async function resolveIsSealed(ix) {
  if (isGetAccount(ix) || isScript(ix)) {
    if (ix.block.isSealed == null && !ix.block.id && !ix.block.height) {
      ix.block.isSealed = !(await config().get("fcl.experimental.softFinality"))
    }
  }

  return ix
}
