import {invariant} from "@onflow/util-invariant"
import {
  pipe,
  Ok,
  makeSubscribeEvents,
  InteractionBuilderFn,
} from "../interaction/interaction"
import {EventFilter, Interaction} from "@onflow/typedefs"

/**
 * Subscribe to events with the given filter and parameters.
 *
 * Creates a subscription to listen for real-time events from the Flow blockchain. This function configures
 * the subscription parameters for filtering specific events based on type, addresses, contracts, and other criteria.
 *
 * Events are emitted by Cadence code during transaction execution and provide insights into what happened.
 * Subscriptions allow you to listen for these events in real-time without polling.
 *
 * @param filter The filter configuration for the event subscription
 * @param filter.startBlockId Optional block ID to start subscription from
 * @param filter.startHeight Optional block height to start subscription from
 * @param filter.eventTypes Array of event types to filter for
 * @param filter.addresses Array of account addresses to filter events from
 * @param filter.contracts Array of contract names to filter events from
 * @param filter.heartbeatInterval Interval for heartbeat messages in milliseconds
 * @returns A function that processes an interaction object
 *
 * @example
 * import * as fcl from "@onflow/fcl";
 *
 * // Subscribe to FlowToken transfer events
 * const subscription = await fcl.send([
 *   fcl.subscribeEvents({
 *     eventTypes: [
 *       "A.1654653399040a61.FlowToken.TokensWithdrawn",
 *       "A.1654653399040a61.FlowToken.TokensDeposited"
 *     ],
 *     startHeight: 1000000, // Start from specific block height
 *     heartbeatInterval: 3000 // 3 second heartbeat
 *   })
 * ]);
 *
 * // Subscribe to events from specific contracts
 * const contractSubscription = await fcl.send([
 *   fcl.subscribeEvents({
 *     contracts: ["FlowToken", "FungibleToken"],
 *     addresses: ["0x1654653399040a61"]
 *   })
 * ]);
 *
 * // Handle the subscription data elsewhere using fcl.subscribe()
 */
export function subscribeEvents({
  startBlockId,
  startHeight,
  eventTypes,
  addresses,
  contracts,
  heartbeatInterval,
}: EventFilter): InteractionBuilderFn {
  invariant(
    !(startBlockId && startHeight),
    `SDK Subscribe Events Error: Cannot set both startBlockId and startHeight.`
  )

  return pipe([
    makeSubscribeEvents,
    (ix: Interaction) => {
      ix.subscribeEvents.startBlockId = startBlockId ?? null
      ix.subscribeEvents.startHeight = startHeight ?? null
      ix.subscribeEvents.eventTypes = eventTypes ?? null
      ix.subscribeEvents.addresses = addresses ?? null
      ix.subscribeEvents.contracts = contracts ?? null
      ix.subscribeEvents.heartbeatInterval = heartbeatInterval ?? null
      return Ok(ix)
    },
  ])
}
