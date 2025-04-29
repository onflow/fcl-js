import {
  pipe,
  Ok,
  makeGetEvents,
  InteractionCallback,
} from "../interaction/interaction"

/**
 * @description A builder function that returns the interaction to get events at a block height range
 * @param eventType The type of event to get
 * @param startHeight The start height of the block range
 * @param endHeight The end height of the block range
 * @returns A function that processes an interaction object
 */
export function getEventsAtBlockHeightRange(
  eventType: string,
  startHeight: number,
  endHeight: number
): InteractionCallback {
  return pipe([
    makeGetEvents,
    ix => {
      ix.events.eventType = eventType
      ix.events.start = startHeight
      ix.events.end = endHeight
      return Ok(ix)
    },
  ])
}
