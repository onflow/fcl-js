import {pipe, Ok} from "@onflow/interaction"

export function limit(computeLimit) {
  return pipe([
    ix => {
      ix.message.computeLimit = computeLimit
      return Ok(ix)
    }
  ])
}
