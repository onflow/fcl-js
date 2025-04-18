import {Ok, makeGetNodeVerionInfo, pipe} from "../interaction/interaction"
import {Interaction} from "../types"

/**
 * A builder function for the Get Node Version Info interaction
 */
export function getNodeVersionInfo(): (
  ix: Interaction
) => Promise<Interaction> {
  return pipe([
    makeGetNodeVerionInfo,
    ix => {
      return Ok(ix)
    },
  ])
}
