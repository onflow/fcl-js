import {
  Ok,
  makeGetNodeVerionInfo,
  pipe,
  InteractionCallback,
} from "../interaction/interaction"

/**
 * @description A builder function for the Get Node Version Info interaction
 * @returns An interaction object
 */
export function getNodeVersionInfo(): InteractionCallback {
  return pipe([
    makeGetNodeVerionInfo,
    ix => {
      return Ok(ix)
    },
  ])
}
