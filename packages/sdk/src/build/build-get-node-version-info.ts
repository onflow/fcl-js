import {Ok, makeGetNodeVerionInfo, pipe} from "../interaction/interaction"

/**
 * A builder function for the Get Node Version Info interaction
 */
export function getNodeVersionInfo(): Function {
  return pipe([
    makeGetNodeVerionInfo,
    ix => {
      return Ok(ix)
    },
  ])
}
