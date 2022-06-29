import {pipe, Ok} from "../interaction/interaction.js"

export function template(tp) {
  return pipe([
    ix => {
        ix.template = tp
        return Ok(ix)
    }
  ])
}
