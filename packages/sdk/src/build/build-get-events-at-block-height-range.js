import {pipe, Ok, makeGetEvents} from "../interaction/interaction.js"

export function getEventsAtBlockHeightRange(eventType, start, end) {
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
