import {pipe, Ok, makeGetBlockByHeight} from "@onflow/interaction"

export function getBlockByHeight(height) {
  return pipe([
    makeGetBlockByHeight,
    ix => {
      ix.block.height = height
      return Ok(ix)
    }
  ])
}
