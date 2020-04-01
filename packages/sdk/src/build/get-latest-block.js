import {pipe, put, makeGetLatestBlock} from "@onflow/interaction"

export function getLatestBlock(isSealed = false) {
  return pipe([makeGetLatestBlock, put("glb.isSealed", isSealed)])
}
