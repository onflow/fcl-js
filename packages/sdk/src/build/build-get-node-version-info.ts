import {
  Ok,
  makeGetNodeVerionInfo,
  pipe,
  InteractionBuilderFn,
} from "../interaction/interaction"

/**
 * @description A builder function for the Get Node Version Info interaction
 * @returns An interaction object
 */
export function getNodeVersionInfo(): InteractionBuilderFn {
  return pipe([
    makeGetNodeVerionInfo,
    ix => {
      return Ok(ix)
    },
  ])
}
