import {send, decode, subscribeEvents} from "@onflow/sdk"
import {Event, EventFilter, EventStream} from "@onflow/typedefs"

/**
 * @typedef {import("@onflow/typedefs").Event} Event
 */

/**
 * @typedef {object} SubscribeObject
 * @property {Function} subscribe - The subscribe function.
 */

/**
 * @callback SubscriptionCallback
 * @returns {Event}
 */

/**
 * @description - Subscribe to events
 * @param filterOrType - The filter or type of events to subscribe to
 *
 * @example
 * import * as fcl from "@onflow/fcl"
 * fcl.events(eventName).subscribe((event) => console.log(event))
 */
export function events(filterOrType?: EventFilter | string) {
  let filter: EventFilter
  if (typeof filterOrType === "string") {
    filter = {eventTypes: [filterOrType]}
  } else {
    filter = filterOrType || {}
  }

  return {
    subscribe: (
      callback: (events: Event | null, error: Error | null) => void
    ) => {
      const streamPromise: Promise<EventStream> = send([
        subscribeEvents(filter),
      ]).then(decode)

      // Subscribe to the stream using the callback
      function onEvents(data: Event[]) {
        data.forEach(event => callback(event, null))
      }
      function onError(error: Error) {
        callback(null, error)
      }
      streamPromise.then(stream =>
        stream.on("events", onEvents).on("error", onError)
      )

      return () => {
        streamPromise.then(stream => stream.close())
      }
    },
  }
}
