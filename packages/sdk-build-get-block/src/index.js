import {pipe, Ok, makeGetBlock} from "@onflow/interaction"

export function getBlock(isSealed = null) {
  return pipe([
    makeGetBlock,
    ix => {
      ix.block.isSealed = isSealed
      return Ok(ix)
    }
  ])
}
