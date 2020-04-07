import {pipe, Ok, makeGetEvents} from "@onflow/interaction"

export function getEvents(eventType, start, end) {
  return pipe([
    makeGetEvents,
    ix => {
      ix.eventType = eventType
      return Ok(ix)
    },
    ix => {
      ix.bounds.start = start
      return Ok(ix)
    },
    ix => {
      ix.bounds.end = end
      return Ok(ix)
    }
  ])
}
