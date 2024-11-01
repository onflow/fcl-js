import {pipe, Ok, makeGetTransaction} from "../interaction/interaction"

/**
 * @description - A builder function that returns a transaction
 * NOTE: The transactionID provided must be from the current spork.
 * @param {string} transactionId - The id of the transaction to get
 * @returns {Function} - An interaction object
 */
export function getTransaction(transactionId) {
  return pipe([
    makeGetTransaction,
    ix => {
      ix.transaction.id = transactionId
      return Ok(ix)
    },
  ])
}
