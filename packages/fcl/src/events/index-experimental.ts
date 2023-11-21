import {spawn, subscriber, SUBSCRIBE, UNSUBSCRIBE} from "@onflow/util-actor"
import {
  config,
  block,
  getEventsAtBlockHeightRange,
  send,
  decode,
  subscribeEvents,
  resolve,
} from "@onflow/sdk"
import {
  Subscribable,
  Subscription,
  Subscriber,
  DataStream,
} from "@onflow/util-pubsub"

/*
ix.subscribeEvents.startBlockId = startBlockId
ix.subscribeEvents.startHeight = startHeight
ix.subscribeEvents.eventTypes = eventTypes
ix.subscribeEvents.addresses = addresses
ix.subscribeEvents.contracts = contracts
ix.subscribeEvents.heartbeatInterval = heartbeatInterval
*/
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

function mergeFilters(
  a: NormalizedEventTypeFilter,
  b: NormalizedEventTypeFilter
): NormalizedEventTypeFilter {
  return {
    eventTypes: Array.from(new Set([...a.eventTypes, ...b.eventTypes])),
    addresses: Array.from(new Set([...a.addresses, ...b.addresses])),
    contracts: Array.from(new Set([...a.contracts, ...b.contracts])),
  }
}

function normalizeEventTypeFilter(filterOrType?: EventTypeFilter | string) {
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
    filter = {
      eventTypes: Array.isArray(eventTypes) ? eventTypes : [eventTypes],
      addresses: Array.isArray(addresses) ? addresses : [addresses],
      contracts: Array.isArray(contracts) ? contracts : [contracts],
    }
  }

  // If any of the filters are empty, we need to add a wildcard for tracking
  Object.entries(filter).forEach(([key, identifiers]) => {
    if (identifiers.length === 0) filter[key].push(WILD_CARD_IDENTIFIER)
  })

  return filter
}

const WILD_CARD_IDENTIFIER = "*"

class FilterCounter {
  private counts: Map<string, number> = new Map()

  constructor() {}

  private get(key: string) {
    return this.counts.get(key) ?? 0
  }

  increment(key: string) {
    const count = this.get(key) + 1
    this.counts.set(key, count)
  }

  decrement(key: string) {
    const count = this.get(key) - 1
    if (count === 0) this.counts.delete(key)
    else this.counts.set(key, count)
  }

  getFiltersIdentifiers() {
    if (this.counts.get(WILD_CARD_IDENTIFIER) != null) return []
    return Array.from(this.counts.keys())
  }
}

class FilterManager {
  private state: Record<keyof NormalizedEventTypeFilter, FilterCounter> = {
    eventTypes: new FilterCounter(),
    addresses: new FilterCounter(),
    contracts: new FilterCounter(),
  }

  constructor() {}

  get filter(): NormalizedEventTypeFilter {
    return {
      eventTypes: this.state.eventTypes.getFiltersIdentifiers(),
      addresses: this.state.addresses.getFiltersIdentifiers(),
      contracts: this.state.contracts.getFiltersIdentifiers(),
    }
  }

  addFilter(filter: NormalizedEventTypeFilter) {
    Object.keys(filter).forEach(key => {
      const identifiers = filter[key as keyof NormalizedEventTypeFilter]
      identifiers.forEach(identifier => {
        this.state[key as keyof NormalizedEventTypeFilter].increment(identifier)
      })
    })
  }

  removeFilter(filter: NormalizedEventTypeFilter) {
    Object.keys(filter).forEach(key => {
      const identifiers = filter[key as keyof NormalizedEventTypeFilter]
      identifiers.forEach(identifier => {
        this.state[key as keyof NormalizedEventTypeFilter].decrement(identifier)
      })
    })
  }
}

type Event = {
  type: string
  address: string
  contract: string
  height: number
  data: any
}

/**
 * The event subscription pool is used to create a single event stream for all subscribers.
 * It determines the minimum set of filters needed to satisfy all subscribers, manages the
 * event stream, and dispatches events to subscribers.
 */
class EventSubscriptionPool {
  // List of subscribers
  private subscribers: [Subscriber<Event>, earliestStreamId: number][] = []
  // For each normalized filter key they is a map of indentifier to count
  private filterManager = new FilterManager()

  // Track old event streams so we can close them when they are no longer needed
  // Streams are allowed to persist until they reach a block a block that is
  // processed by a later stream
  private streams: {
    stream: DataStream<Event>
    lowWaterMark: number
    highWaterMark: number
  }[] = []
  private streamId = 0
  // handle new events queued while transitioning to a new event stream
  private queuedEvents: Event[] = []

  subscribe(
    filterOrType: EventTypeFilter | string,
    cb: (event: Event, error: any) => void
  ): Subscription {
    // Add the filter to the filter manager
    const subscriberFilter = normalizeEventTypeFilter(filterOrType)
    this.filterManager.addFilter(subscriberFilter)

    function onEvent(event: Event) {
      if (subscriberFilter.eventTypes.length > 0) {
        if (
          !subscriberFilter.eventTypes.includes(event.type) &&
          !subscriberFilter.eventTypes.includes(WILD_CARD_IDENTIFIER)
        )
          return
      }
      if (subscriberFilter.addresses.length > 0) {
        if (
          !subscriberFilter.addresses.includes(event.address) &&
          !subscriberFilter.addresses.includes(WILD_CARD_IDENTIFIER)
        )
          return
      }
      if (subscriberFilter.contracts.length > 0) {
        if (
          !subscriberFilter.contracts.includes(event.contract) &&
          !subscriberFilter.contracts.includes(WILD_CARD_IDENTIFIER)
        )
          return
      }
      cb(event, null)
    }

    function onError(error: any) {
      cb(null, error)
    }

    const subscriber = {next: onEvent, error: onError}
    this.subscribers.push([subscriber, this.streamId])

    return {
      unsubscribe: () => {
        const index = this.subscribers.findIndex(
          ([_subscriber, _]) => _subscriber === subscriber
        )
        if (index > -1) {
          this.subscribers.splice(index, 1)
          this.filterManager.removeFilter(subscriberFilter)
        }
      },
    }
  }

  private refreshSocket() {
    // If there are no subscribers, close the event stream
    if (this.subscribers.length === 0) {
      this.streams.forEach(({stream}) => stream?.close())
      this.streams = []
      return
    }

    const filter = this.filterManager.filter

    // Close the current event stream
    // We need a grace period to ensure there is no gap in events
    const oldStreamId = this.streamId
    setTimeout(() => {
      this.removeStream(oldStreamId)
    }, 5000)
    this.streamId++

    const currentStreamId = this.streamId
    // Subscribe to the new event stream
    const newStream = resolve(send([subscribeEvents(filter)]))
    this.eventStream.subscribe(
      event => {
        if (this.highWaterMark.blockHeight >= event.height) {
          if (this.highWaterMark.streamId > currentStreamId) {
          }
        }

        this.highWaterMark = [event.height, this.streamId]
        this.subscribers.forEach(([subscriber, earliestStreamId]) => {
          if (earliestStreamId <= this.highWaterMark[1]) {
            subscriber.next(event)
          }
        })
      },
      error => {
        this.subscribers.forEach(subscriber => subscriber.error(error))
        this.refreshSocket()
      },
      () => {
        this.refreshSocket()
      }
    )
  }

  private removeStream(streamId: number) {
    const index = this.streams.findIndex(
      ([, streamId]) => streamId === streamId
    )
    if (index > -1) {
      this.streams[index]?.[0]?.close()
      this.streams.splice(index, 1)
    }
  }
}

const EVENT_SUBSCRIPTION_POOL = new EventSubscriptionPool()

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
 * @param {string} key - A valid event name
 * @returns {SubscribeObject}
 *
 * @example
 * import * as fcl from "@onflow/fcl"
 * fcl.events(eventName).subscribe((event) => console.log(event))
 */
export function events(key) {
  return {
    /**
     * @description - Subscribe to events
     * @param {Function} callback - The callback function
     * @returns {SubscriptionCallback}
     */
    subscribe: callback => {
      return EVENT_SUBSCRIPTION_POOL.subscribe(key, callback)
    },
  }
}
