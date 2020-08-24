import {pipe, Ok, makeGetLatestBlock} from "@onflow/interaction"

export function getLatestBlock(isSealed = false) {
  return pipe([
    makeGetLatestBlock,
    ix => {
      ix.block.isSealed = isSealed
      return Ok(ix)
    }
  ])
}
