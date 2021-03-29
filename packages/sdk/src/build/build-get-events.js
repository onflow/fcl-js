import {pipe, Ok, makeGetEvents} from "../interaction/interaction.js"

export function getEvents(eventType, start, end) {

  if (typeof start !== "undefined" || typeof end !== "undefined") {
    console.warn(
      `
      %cFCL/SDK Deprecation Notice
      ============================
  
      Passing a start and end into getEnvents has been deprecated and will not be supported in future versions of the Flow JS-SDK/FCL.
      You can learn more (including a guide on common transition paths) here: https://github.com/onflow/flow-js-sdk/blob/master/packages/sdk/TRANSITIONS.md#0005-deprecate-start-end-get-events-builder
  
      ============================
    `,
      "font-weight:bold;font-family:monospace;"
    )  
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
