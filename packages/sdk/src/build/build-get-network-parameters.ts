import {
  pipe,
  makeGetNetworkParameters,
  Ok,
  InteractionCallback,
} from "../interaction/interaction"

/**
 * @description A builder function that returns the interaction to get network parameters
 * @returns A function that processes an interaction object
 */
export function getNetworkParameters(): InteractionCallback {
  return pipe([
    makeGetNetworkParameters,
    ix => {
      return Ok(ix)
    },
  ])
}
