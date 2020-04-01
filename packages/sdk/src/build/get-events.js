import {pipe, put, makeGetEvents} from "@onflow/interaction"

export function getEvents(eventType, start, end) {
  return pipe([
    makeGetEvents,
    put("ge.eventType", eventType),
    put("bounds.start", start),
    put("bounds.end", end),
  ])
}
