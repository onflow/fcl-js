import {pipe, Ok, makeGetNetworkParameters} from "../interaction/interaction.js"

export function getNetworkParameters() {
  return pipe([
    makeGetNetworkParameters,
    ix => {
      return Ok(ix)
    },
  ])
}
