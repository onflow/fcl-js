import {pipe, Ok, makeGetBlockById} from "@onflow/interaction"

export function getBlockById(id) {
  return pipe([
    makeGetBlockById,
    ix => {
      ix.block.id = id
      return Ok(ix)
    }
  ])
}
