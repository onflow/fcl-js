import {pipe, Ok, makeGetNetworkParameters} from "../interaction/interaction"

export function getNetworkParameters() {
  return pipe([
    makeGetNetworkParameters,
    ix => {
      return Ok(ix)
    },
  ])
}
