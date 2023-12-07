import {invariant} from "@onflow/util-invariant"
import {pipe, Ok, makeSubscribeEvents} from "../interaction/interaction"
import {EventFilter, Interaction} from "@onflow/typedefs"

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
}): Function {
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
  ]) as any
}
