import {config, send, decode, subscribeEvents} from "@onflow/sdk"
import {DataStream} from "@onflow/util-pubsub"
import {Event} from "@onflow/typedefs"

type EventTypeFilter = {
  eventTypes?: string[] | string
  addresses?: string[] | string
  contracts?: string[] | string
}

type NormalizedEventTypeFilter = {
  eventTypes: string[]
  addresses: string[]
  contracts: string[]
}

const RATE = 10000
const UPDATED = "UPDATED"
const TICK = "TICK"
const HIGH_WATER_MARK = "hwm"

const scheduleTick = async ctx => {
  return setTimeout(
    () => ctx.sendSelf(TICK),
    await config().get("fcl.eventPollRate", RATE)
  )
}

function normalizeEventTypeFilter(
  filterOrType?: EventTypeFilter | string
): NormalizedEventTypeFilter {
  // Normalize the filter to arrays
  let filter: NormalizedEventTypeFilter
  if (typeof filterOrType === "string") {
    return {
      eventTypes: [filterOrType],
      addresses: [],
      contracts: [],
    }
  } else if (filterOrType == null) {
    return {
      eventTypes: [],
      addresses: [],
      contracts: [],
    }
  } else {
    const {eventTypes, addresses, contracts} = filterOrType
    return {
      eventTypes: Array.isArray(eventTypes)
        ? eventTypes
        : eventTypes
        ? [eventTypes]
        : [],
      addresses: Array.isArray(addresses)
        ? addresses
        : addresses
        ? [addresses]
        : [],
      contracts: Array.isArray(contracts)
        ? contracts
        : contracts
        ? [contracts]
        : [],
    }
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
        stream.subscribe(
          event => callback(event, null),
          error => {
            callback(null, error)
          }
        )
      )

      return () => {
        streamPromise.then(stream => stream.close())
      }
    },
  }
}
