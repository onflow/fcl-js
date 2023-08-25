import {pipe, Ok, makeGetTransactionStatus} from "../interaction/interaction"

/**
 * @description - A builder function that returns the status of transaction
 * NOTE: The transactionID provided must be from the current spork.
 * @param {string} transactionId - The id of the transaction to get status
 * @returns {Function} - An interaction object
 */
export function getTransactionStatus(transactionId) {
  return pipe([
    makeGetTransactionStatus,
    ix => {
      ix.transaction.id = transactionId
      return Ok(ix)
    },
  ])
}
