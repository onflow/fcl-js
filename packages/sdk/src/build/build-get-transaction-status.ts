import {
  pipe,
  Ok,
  makeGetTransactionStatus,
  InteractionBuilderFn,
} from "../interaction/interaction"

/**
 * A builder function that returns the status of transaction.
 *
 * The transaction id provided must be from the current spork.
 *
 * Consider using 'fcl.tx(id)' instead of calling this method directly for real-time transaction monitoring.
 *
 * @param transactionId The id of the transaction to get the status of
 * @returns A function that processes an interaction object
 *
 * @example
 * ```typescript
 * import * as fcl from "@onflow/fcl";
 *
 * const status = await fcl.send([
 *   fcl.getTransactionStatus("9dda5f281897389b99f103a1c6b180eec9dac870de846449a302103ce38453f3")
 * ]).then(fcl.decode);
 * ```
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
