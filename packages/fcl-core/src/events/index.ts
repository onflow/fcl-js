import {send, decode, subscribeEvents} from "@onflow/sdk"
import {Event, EventFilter, EventStream} from "@onflow/typedefs"
import {events as legacyEvents} from "./legacy-events"

/**
 * @description - Subscribe to events
 * @param filterOrType - The filter or type of events to subscribe to
 *
 * @example
 * import * as fcl from "@onflow/fcl"
 * const unsubscribe = fcl.events(eventName).subscribe((event) => console.log(event))
 * unsubscribe()
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

      // If the subscribe fails, fallback to legacy events
      const legacySubscriptionPromise = streamPromise
        .then(() => null)
        .catch(e => {
          // Only fallback to legacy events if the error is specifcally about the unsupported feature
          if (
            e.message !==
            "SDK Send Error: subscribeEvents is not supported by this transport."
          ) {
            throw e
          }

          if (typeof filterOrType !== "string") {
            throw new Error(
              "GRPC fcl.events fallback only supports string (type) filters"
            )
          }
          return legacyEvents(filterOrType).subscribe(callback)
        })

      // Subscribe to the stream using the callback
      function onEvents(data: Event[]) {
        data.forEach(event => callback(event, null))
      }
      function onError(error: Error) {
        callback(null, error)
      }

      // If using legacy events, don't subscribe to the stream
      legacySubscriptionPromise.then(legacySubscription => {
        if (!legacySubscription) {
          streamPromise
            .then(stream => stream.on("events", onEvents).on("error", onError))
            .catch(error => {
              streamPromise.then(stream => stream.close())
              onError(error)
            })
        }
      })

      // Unsubscribe will call terminate the legacy subscription or close the stream
      return () => {
        legacySubscriptionPromise.then(legacySubscription => {
          if (legacySubscription) {
            legacySubscription()
          } else {
            streamPromise.then(stream => stream.close())
          }
        })
      }
    },
  }
}
