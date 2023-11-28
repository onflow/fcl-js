import {pipe, Ok} from "../interaction/interaction"

export function ref(refBlock) {
  return pipe([
    ix => {
      ix.message.refBlock = refBlock
      return Ok(ix)
    },
  ])
}
