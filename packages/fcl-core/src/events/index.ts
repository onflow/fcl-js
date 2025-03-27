import {subscribe} from "@onflow/sdk"
import {Event, EventFilter, SubscriptionTopic} from "@onflow/typedefs"
import {events as legacyEvents} from "./legacy-events"
import {SubscriptionsNotSupportedError} from "@onflow/sdk"

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
      let unsubscribeFnLegacy = () => {}
      const {unsubscribe: unsubscribeFn} = subscribe({
        topic: SubscriptionTopic.EVENTS,
        args: filter,
        onData: data => {
          callback(data, null)
        },
        onError: (error: Error) => {
          // If subscriptions are not supported, fallback to legacy polling, otherwise return the error
          if (error instanceof SubscriptionsNotSupportedError) {
            fallbackLegacyPolling()
          } else {
            callback(null, error)
          }
        },
      })

      function fallbackLegacyPolling() {
        console.warn(
          "Failed to subscribe to events using real-time streaming (are you using the deprecated GRPC transport?), falling back to legacy polling."
        )

        if (typeof filterOrType !== "string") {
          throw new Error(
            "Legacy fcl.events fallback only supports string filters (single event type)"
          )
        }
        const unsubscribe = legacyEvents(filterOrType).subscribe(callback)
        unsubscribeFnLegacy = unsubscribe
      }

      // Return an unsubscribe function
      return () => {
        unsubscribeFn()
        unsubscribeFnLegacy()
      }
    },
  }
}
