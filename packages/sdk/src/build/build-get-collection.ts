import {
  pipe,
  makeGetCollection,
  InteractionBuilderFn,
} from "../interaction/interaction"

/**
 * A builder function that returns all a collection containing a list of transaction ids by its collection id.
 *
 * The block range provided must be from the current spork. All events emitted during past sporks is current unavailable.
 *
 * Collection ID is SHA3-256 hash of the collection payload.
 *
 * @param collectionID The id of the collection
 * @returns A function that processes an interaction object
 *
 * @example
 * import * as fcl from "@onflow/fcl";
 *
 * const collection = await fcl.send([
 *   fcl.getCollection("cccdb0c67d015dc7f6444e8f62a3244ed650215ed66b90603006c70c5ef1f6e5")
 * ]).then(fcl.decode);
 */
export function getCollection(id: string | null = null): InteractionBuilderFn {
  return pipe([
    makeGetCollection,
    ix => {
      ix.collection.id = id
      return ix
    },
  ])
}
