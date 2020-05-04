import {pipe, Ok} from "@onflow/interaction"

export function ref(refBlock) {
  return pipe([
    ix => {
      ix.message.refBlock = refBlock
      return Ok(ix)
    }
  ])
}
