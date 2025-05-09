import {
  pipe,
  Ok,
  makeGetEvents,
  InteractionBuilderFn,
} from "../interaction/interaction"

/**
 * @description A builder function that returns the interaction to get events at specific block IDs
 * @param eventType The type of event to get
 * @param blockIds The block IDs to get events from
 * @returns A function that processes an interaction object
 */
export function getEventsAtBlockIds(
  eventType: string,
  blockIds: string[]
): InteractionBuilderFn {
  return pipe([
    makeGetEvents,
    ix => {
      ix.events.eventType = eventType
      ix.events.blockIds = blockIds
      return Ok(ix)
    },
  ])
}
