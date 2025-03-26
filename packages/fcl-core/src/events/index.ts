import {subscribe} from "@onflow/sdk"
import {Event, EventFilter, SdkTransport} from "@onflow/typedefs"
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
      // TODO: Fix this typing (async)
      callback: (events: Event | null, error: Error | null) => void
    ) => {
      const {unsubscribe: unsubscribeFn} = subscribe({
        topic: SdkTransport.SubscriptionTopic.EVENTS,
        args: filter,
        onData: ((data: Event) => {
          callback(data, null)
        }) as any, // TODO: Fix this typing
        onError: (error: Error) => {
          callback(null, error)

          // TODO: Handle acceptable fallback errors (e.g. unsupported feature)
          // this would be an HTTP error, not a subscription error

          // Fallback to legacy polling
          fallbackLegacyPolling()
        },
      })

      let unsubscribeLegacy = () => {}
      function fallbackLegacyPolling() {
        console.warn(
          "Failed to subscribe to events using real-time streaming (are you using the deprecated GRPC transport?), falling back to legacy polling."
        )

        if (typeof filterOrType !== "string") {
          throw new Error(
            "Legacy fcl.events fallback only supports string (type) filters"
          )
        }
        const unsubscribe = legacyEvents(filterOrType).subscribe(callback)
        unsubscribeLegacy = unsubscribe
      }

      // Return an unsubscribe function
      return () => {
        unsubscribeFn()
        unsubscribeLegacy()
      }
    },
  }
}
