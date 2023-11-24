import {invariant} from "@onflow/util-invariant"
import {pipe, Ok, makeSubscribeEvents} from "../interaction/interaction.js"
import {EventFilter} from "@onflow/typedefs"

/**
 * Subscribe to events with the given filter & parameters
 */
export function subscribeEvents({
  startBlockId,
  startHeight,
  eventTypes,
  addresses,
  contracts,
  heartbeatInterval,
}: EventFilter & {
  startBlockId?: string
  startHeight?: number
  heartbeatInterval?: number
}) {
  invariant(
    !(startBlockId && startHeight),
    `SDK Subscribe Events Error: Cannot set both startBlockId and startHeight.`
  )

  return pipe([
    makeSubscribeEvents,
    (ix: any) => {
      ix.subscribeEvents.startBlockId = startBlockId
      ix.subscribeEvents.startHeight = startHeight
      ix.subscribeEvents.eventTypes = eventTypes
      ix.subscribeEvents.addresses = addresses
      ix.subscribeEvents.contracts = contracts
      ix.subscribeEvents.heartbeatInterval = heartbeatInterval
      return Ok(ix)
    },
  ])
}
