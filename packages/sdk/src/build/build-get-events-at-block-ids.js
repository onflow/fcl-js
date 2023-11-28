import {pipe, Ok, makeGetEvents} from "../interaction/interaction"

/**
 * @description - A builder function that returns all instances of a particular event (by name) within a set of blocks, specified by block ids
 * NOTE:
 * - The block range provided must be from the current spork.
 * @param {string} eventName - The name of the event to get
 * @param {number[]} blockIds - The ids of the blocks to look for events
 * @returns {Function} - An interaction object
 */
export function getEventsAtBlockIds(eventName, blockIds = []) {
  return pipe([
    makeGetEvents,
    ix => {
      ix.events.eventType = eventName
      ix.events.blockIds = blockIds
      return Ok(ix)
    },
  ])
}
