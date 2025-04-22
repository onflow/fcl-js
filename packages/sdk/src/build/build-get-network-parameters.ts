import {Interaction} from "@onflow/typedefs"
import {pipe, makeGetNetworkParameters, Ok} from "../interaction/interaction"

/**
 * @description - A builder function that returns the interaction to get network parameters
 * @returns A function that processes an interaction object
 */
export function getNetworkParameters(): (
  ix: Interaction
) => Promise<Interaction> {
  return pipe([
    makeGetNetworkParameters,
    ix => {
      return Ok(ix)
    },
  ])
}
