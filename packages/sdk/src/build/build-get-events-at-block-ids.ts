import {pipe, Ok, makeGetEvents} from "../interaction/interaction"

export function getEventsAtBlockIds(eventType, blockIds = []) {
  return pipe([
    makeGetEvents,
    ix => {
      ix.events.eventType = eventType
      ix.events.blockIds = blockIds
      return Ok(ix)
    },
  ])
}
