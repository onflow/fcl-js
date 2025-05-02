import {
  pipe,
  Ok,
  makeGetEvents,
  InteractionBuilderFn,
} from "../interaction/interaction"

/**
 * @description A builder function that returns the interaction to get events
 * @param eventType The type of event to get
 * @param start The start block ID or height
 * @param end The end block ID or height
 * @returns A function that processes an interaction object
 */
export function getEvents(
  eventType: string,
  start: number,
  end: number
): InteractionBuilderFn {
  return pipe([
    makeGetEvents,
    ix => {
      ix.events.eventType = eventType
      ix.events.start = start
      ix.events.end = end
      return Ok(ix)
    },
  ])
}
