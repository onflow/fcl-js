import {pipe, Ok, makeGetEvents} from "../interaction/interaction.js"
import * as logger from "@onflow/util-logger"

export function getEvents(eventType, start, end) {
  if (typeof start !== "undefined" || typeof end !== "undefined") {
    logger.log.deprecate({
      pkg: "FCL/SDK",
      subject: "Passing a start and end into getEvents",
      transition:
        "https://github.com/onflow/flow-js-sdk/blob/master/packages/sdk/TRANSITIONS.md#0005-deprecate-start-end-get-events-builder",
    })
  }

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
