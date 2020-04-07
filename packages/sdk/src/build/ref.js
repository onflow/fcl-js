import {pipe, Ok} from "@onflow/interaction"

export function ref(ref) {
  return pipe([
    ix => {
      ix.payload.ref = ref
      return Ok(ix)
    }
  ])
}
