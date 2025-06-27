import {subscribe} from "@onflow/sdk"
import {Event, EventFilter, SubscriptionTopic} from "@onflow/typedefs"
import {events as legacyEvents} from "./legacy-events"
import {SubscriptionsNotSupportedError} from "@onflow/sdk"
import {getChainId} from "../utils"

const FLOW_EMULATOR = "local"

/**
 * @description Subscribes to Flow blockchain events in real-time. This function provides a way to listen
 * for specific events emitted by smart contracts on the Flow blockchain. It automatically handles
 * fallback to legacy polling for environments that don't support WebSocket subscriptions.
 *
 * @param filterOrType Event filter object or event type string.
 * If a string is provided, it will be treated as a single event type to subscribe to.
 * If an EventFilter object is provided, it can contain multiple event types and other filter criteria.
 * @param filterOrType.eventTypes Array of event type strings to subscribe to
 * @param filterOrType.startBlockId Block ID to start streaming from
 * @param filterOrType.startBlockHeight Block height to start streaming from
 *
 * @returns An object containing a subscribe method
 * @returns returns.subscribe Function to start the subscription
 * @returns returns.subscribe.onData Callback function called when an event is received
 * @returns returns.subscribe.onError Optional callback function called when an error occurs
 * @returns returns.subscribe.unsubscribe Function returned by subscribe() to stop the subscription
 *
 * @example
 * // Subscribe to a specific event type
 * import * as fcl from "@onflow/fcl"
 *
 * const unsubscribe = fcl.events("A.0x1654653399040a61.FlowToken.TokensWithdrawn")
 *   .subscribe((event) => {
 *     console.log("Event received:", event)
 *     console.log("Event data:", event.data)
 *     console.log("Transaction ID:", event.transactionId)
 *   })
 *
 * // Stop listening after 30 seconds
 * setTimeout(() => {
 *   unsubscribe()
 * }, 30000)
 *
 * // Subscribe to multiple event types with error handling
 * const unsubscribe = fcl.events({
 *   eventTypes: [
 *     "A.0x1654653399040a61.FlowToken.TokensWithdrawn",
 *     "A.0x1654653399040a61.FlowToken.TokensDeposited"
 *   ]
 * }).subscribe(
 *   (event) => {
 *     console.log("Token event:", event.type, event.data)
 *   },
 *   (error) => {
 *     console.error("Event subscription error:", error)
 *   }
 * )
 *
 * // Subscribe to events starting from a specific block height
 * const unsubscribe = fcl.events({
 *   eventTypes: ["A.CONTRACT.EVENT"],
 *   startBlockHeight: 12345678
 * }).subscribe((event) => {
 *   console.log("Historical and new events:", event)
 * })
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
          (event: Event | null, error: Error | null) => {
            if (error) {
              onError(error)
            } else {
              if (event) {
                onData(event)
              }
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
