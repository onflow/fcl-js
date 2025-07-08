import {
  InteractionBuilderFn,
  Ok,
  makeGetTransaction,
  pipe,
} from "../interaction/interaction"

/**
 * A builder function that returns the interaction to get a transaction by id.
 *
 * Transaction id is a hash of the encoded transaction payload and can be calculated before submitting the transaction to the network.
 * Transaction status represents the state of a transaction in the blockchain. Status can change until it is finalized.
 *
 * The transaction id provided must be from the current spork.
 *
 * Consider using 'fcl.tx(id).onceExecuted()' instead of calling this method directly for real-time transaction monitoring.
 *
 * @param transactionId The id of the transaction to get
 * @returns A function that processes an interaction object
 *
 * @example
 * import * as fcl from "@onflow/fcl";
 *
 * const tx = await fcl.send([
 *   fcl.getTransaction("9dda5f281897389b99f103a1c6b180eec9dac870de846449a302103ce38453f3")
 * ]).then(fcl.decode);
 */
export function getTransaction(id: string): InteractionBuilderFn {
  return pipe([
    makeGetTransaction,
    ix => {
      ix.transaction.id = id
      return Ok(ix)
    },
  ])
}
