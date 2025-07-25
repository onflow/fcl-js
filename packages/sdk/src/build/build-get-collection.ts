import {
  pipe,
  makeGetCollection,
  InteractionBuilderFn,
} from "../interaction/interaction"

/**
 * A builder function that returns a collection containing a list of transaction IDs by its collection ID.
 *
 * A collection is a batch of transactions that have been included in a block. Each collection has a unique ID
 * which is the SHA3-256 hash of the collection payload. Collections are used to group related transactions
 * together for more efficient processing by the network.
 *
 * The collection ID provided must be from the current spork. Collections from past sporks are currently unavailable.
 *
 * @param collectionID The ID of the collection to retrieve
 * @returns A function that processes an interaction object
 *
 * @example
 * import * as fcl from "@onflow/fcl";
 *
 * // Get a collection and see what transactions it contains
 * const collection = await fcl.send([
 *   fcl.getCollection("cccdb0c67d015dc7f6444e8f62a3244ed650215ed66b90603006c70c5ef1f6e5")
 * ]).then(fcl.decode);
 *
 * console.log("Collection ID:", collection.id);
 * console.log("Transaction IDs:", collection.transactionIds);
 * console.log("Total transactions:", collection.transactionIds.length);
 *
 * // Process each transaction in the collection
 * for (const txId of collection.transactionIds) {
 *   const transaction = await fcl.send([
 *     fcl.getTransaction(txId)
 *   ]).then(fcl.decode);
 *   console.log("Transaction:", transaction);
 * }
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
