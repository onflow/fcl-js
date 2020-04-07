import {pipe, Ok} from "@onflow/interaction"

export function limit(limit) {
  return pipe([
    ix => {
      ix.payload.limit = limit
      return Ok(ix)
    }
  ])
}
