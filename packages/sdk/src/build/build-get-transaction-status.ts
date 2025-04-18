import {pipe, Ok, makeGetTransactionStatus} from "../interaction/interaction"
import {Interaction} from "../types"

/**
 * @description - A builder function that returns the status of transaction
 * NOTE: The transactionID provided must be from the current spork.
 * @param transactionId - The id of the transaction to get status
 * @returns An interaction object
 */
export function getTransactionStatus(
  transactionId: string
): (ix: Interaction) => Promise<Interaction> {
  return pipe([
    makeGetTransactionStatus,
    ix => {
      ix.transaction.id = transactionId
      return Ok(ix)
    },
  ])
}
