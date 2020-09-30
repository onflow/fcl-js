import {pipe, Ok, makeGetEvents} from "@onflow/interaction"

export function getEvents(eventType, start, end) {
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
