import {pipe, Ok, makeGetEvents} from "../interaction/interaction"

/**
 * @description - A builder function that returns all instances of a particular event (by name) within a height range
 * NOTE:
 * - The block range provided must be from the current spork.
 * - The block range provided must be 250 blocks or lower per request.
 * @param {string} eventName - The name of the event to get
 * @param {number} fromBlockHeight - The height of the block to start looking for events (inclusive)
 * @param {number} toBlockHeight - The height of the block to stop looking for events (inclusive)
 * @returns {Function} - An interaction object
 */
export function getEventsAtBlockHeightRange(
  eventName,
  fromBlockHeight,
  toBlockHeight
) {
  return pipe([
    makeGetEvents,
    ix => {
      ix.events.eventType = eventName
      ix.events.start = fromBlockHeight
      ix.events.end = toBlockHeight
      return Ok(ix)
    },
  ])
}
