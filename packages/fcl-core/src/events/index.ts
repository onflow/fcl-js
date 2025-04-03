import {subscribe} from "@onflow/sdk"
import {Event, EventFilter, SubscriptionTopic} from "@onflow/typedefs"
import {events as legacyEvents} from "./legacy-events"
import {SubscriptionsNotSupportedError} from "@onflow/sdk"
import {getChainId} from "../utils"

const FLOW_EMULATOR = "local"

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
      onData: (event: Event) => void,
      onError: (error: Error) => void = (error: Error) => {
        console.error("Unhandled error in event subscription:", error)
      }
    ): (() => void) => {
      let unsubscribeFn = () => {}
      let unsubscribeFnLegacy = () => {}

      // Subscribe to the event stream
      function subscribeEventStream() {
        const {unsubscribe} = subscribe({
          topic: SubscriptionTopic.EVENTS,
          args: filter,
          onData: event => {
            // Emit the event
            onData(event)
          },
          onError: (error: Error) => {
            // If subscriptions are not supported, fallback to legacy polling, otherwise return the error
            if (error instanceof SubscriptionsNotSupportedError) {
              console.warn(
                "Failed to subscribe to events using real-time streaming (are you using the deprecated GRPC transport?), falling back to legacy polling."
              )
              fallbackLegacyPolling()
            } else {
              onError(error)
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
        unsubscribeFnLegacy = legacyEvents(filterOrType).subscribe(
          (event: Event, error?: Error) => {
            if (error) {
              onError(error)
            } else {
              onData(event)
            }
          }
        )
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
        onError(error)
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
