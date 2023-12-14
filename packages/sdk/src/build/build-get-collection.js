import {pipe, makeGetCollection} from "../interaction/interaction"

/**
 * @description - A builder function that returns all a collection containing a list of transaction ids by its collection id
 * NOTE:
 * - The block range provided must be from the current spork. All events emitted during past sporks is current unavailable.
 * @param {string} [id] - The id of the collection to get
 * @returns {Function} - An interaction object
 */
export function getCollection(id = null) {
  return pipe([
    makeGetCollection,
    ix => {
      ix.collection.id = id
      return ix
    },
  ])
}
