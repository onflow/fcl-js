import {pipe, Ok, makeGetEvents} from "@onflow/interaction"

export function getEvents(eventType, start, end) {
  return pipe([
    makeGetEvents,
    ix => {
      ix.events.eventType = eventType
      return Ok(ix)
    },
    ix => {
      ix.events.start = start
      return Ok(ix)
    },
    ix => {
      ix.events.end = end
      return Ok(ix)
    }
  ])
}
