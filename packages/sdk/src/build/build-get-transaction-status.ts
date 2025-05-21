import {
  pipe,
  Ok,
  makeGetTransactionStatus,
  InteractionBuilderFn,
} from "../interaction/interaction"

/**
 * @description A builder function that returns the status of transaction
 * NOTE: The transactionID provided must be from the current spork.
 * @param transactionId The id of the transaction to get status
 * @returns An interaction object
 */
export function getTransactionStatus(
  transactionId: string
): InteractionBuilderFn {
  return pipe([
    makeGetTransactionStatus,
    ix => {
      ix.transaction.id = transactionId
      return Ok(ix)
    },
  ])
}
