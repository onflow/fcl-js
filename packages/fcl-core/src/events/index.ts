import {subscribe} from "@onflow/sdk"
import {Event, EventFilter, SubscriptionTopic} from "@onflow/typedefs"
import {events as legacyEvents} from "./legacy-events"
import {SubscriptionsNotSupportedError} from "@onflow/sdk"
import {getChainId} from "../utils"

const FLOW_EMULATOR = "emulator"

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
      let unsubscribeFn = () => {}
      let unsubscribeFnLegacy = () => {}

      // Subscribe to the event stream
      function subscribeEventStream() {
        const {unsubscribe} = subscribe({
          topic: SubscriptionTopic.EVENTS,
          args: filter,
          onData: data => {
            callback(data, null)
          },
          onError: (error: Error) => {
            // If subscriptions are not supported, fallback to legacy polling, otherwise return the error
            if (error instanceof SubscriptionsNotSupportedError) {
              console.warn(
                "Failed to subscribe to events using real-time streaming (are you using the deprecated GRPC transport?), falling back to legacy polling."
              )
              fallbackLegacyPolling()
            } else {
              callback(null, error)
            }
          },
        })
        unsubscribeFn = unsubscribe
      }

      // Fallback to legacy polling if real-time streaming is not supported
      function fallbackLegacyPolling() {
        if (typeof filterOrType !== "string") {
          throw new Error(
            "Legacy fcl.events fallback only supports string filters (single event type)"
          )
        }
        unsubscribeFnLegacy = legacyEvents(filterOrType).subscribe(callback)
      }

      async function subscribeToEvents() {
        const network = await getChainId()

        // As of Flow CLI v2.2.8, WebSocket subscriptions are not supported on the Flow emulator
        // This conditional will be removed when WebSocket subscriptions are supported in this environment
        if (network === FLOW_EMULATOR) {
          console.warn(
            "Events are not supported on the Flow emulator, falling back to legacy polling."
          )
          fallbackLegacyPolling()
        } else {
          subscribeEventStream()
        }
      }

      // Subscribe to events
      const initPromise = subscribeToEvents().catch(error => {
        callback(null, error)
      })

      // Return an unsubscribe function
      return () => {
        initPromise.finally(() => {
          unsubscribeFn()
          unsubscribeFnLegacy()
        })
      }
    },
  }
}
