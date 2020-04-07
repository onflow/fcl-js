import {pipe, Ok} from "@onflow/interaction"

export function nonce(nonce) {
  return pipe([
    ix => {
      ix.payload.nonce = nonce
      return Ok(ix)
    }
  ])
}
