import {pipe, Ok, makeSubscribeEvents} from "../interaction/interaction.js"

export function subscribeEvents({
  startBlockId,
  startHeight,
  eventTypes,
  addresses,
  contracts,
  heartbeatInterval,
}) {
  return pipe([
    makeSubscribeEvents,
    ix => {
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
