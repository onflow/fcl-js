import {send, decode, subscribeEvents} from "@onflow/sdk"
import {DataStream} from "@onflow/util-pubsub"
import {Event} from "@onflow/typedefs"

type EventTypeFilter = {
  eventTypes?: string[] | string
  addresses?: string[] | string
  contracts?: string[] | string
}

type NormalizedEventTypeFilter = {
  eventTypes?: string[]
  addresses?: string[]
  contracts?: string[]
}

function normalizeEventTypeFilter(
  filterOrType?: EventTypeFilter | string
): NormalizedEventTypeFilter {
  // Normalize the filter to arrays
  if (typeof filterOrType === "string" && filterOrType !== "") {
    return {
      eventTypes: [filterOrType],
    }
  } else if (filterOrType == null || filterOrType === "") {
    return {}
  } else {
    let {eventTypes, addresses, contracts} = filterOrType
    let result: NormalizedEventTypeFilter = {}

    if (eventTypes != null) {
      result.eventTypes = Array.isArray(eventTypes) ? eventTypes : [eventTypes]
    }

    if (addresses != null) {
      result.addresses = Array.isArray(addresses) ? addresses : [addresses]
    }

    if (contracts != null) {
      result.contracts = Array.isArray(contracts) ? contracts : [contracts]
    }

    return result
  }
}

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
export function events(filterOrType?: EventTypeFilter | string) {
  const filter = normalizeEventTypeFilter(filterOrType)

  return {
    subscribe: (
      callback: (event: Event | null, error: Error | null) => void
    ) => {
      const streamPromise: Promise<DataStream<Event>> = send([
        subscribeEvents(filter),
      ]).then(decode)

      // Subscribe to the stream using the callback
      streamPromise.then(stream =>
        stream
          .map(data => decode(data) as Promise<Event>)
          .subscribe(
            event => callback(event, null),
            error => callback(null, error)
          )
      )

      return () => {
        streamPromise.then(stream => stream.close())
      }
    },
  }
}
