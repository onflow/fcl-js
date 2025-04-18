import {useState, useEffect} from "react"
import * as fcl from "@onflow/fcl"
import {TransactionStatus} from "@onflow/typedefs"

export interface UseFlowTransactionArgs {
  /** The Flow transaction ID to monitor */
  id: string
}

export interface UseFlowTransactionResult {
  /** Latest transaction status, or null before any update */
  transactionStatus: TransactionStatus | null
  /** Any error encountered during status updates */
  error: Error | null
}

/**
 * Subscribes to status updates for a given Flow transaction ID.
 *
 * @param args.id - The Flow transaction ID to watch
 * @returns {UseFlowTransactionResult}
 */
export function useFlowTransaction({
  id,
}: UseFlowTransactionArgs): UseFlowTransactionResult {
  const [transactionStatus, setTransactionStatus] =
    useState<TransactionStatus | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!id) return

    setTransactionStatus(null)
    setError(null)

    const tx = fcl.tx(id)
    const unsubscribe = tx.subscribe((updatedStatus: TransactionStatus) => {
      setTransactionStatus(updatedStatus)

      if (updatedStatus.errorMessage) {
        setError(
          fcl.TransactionError.fromErrorMessage(updatedStatus.errorMessage)
        )
      }
    })

    return () => {
      unsubscribe()
    }
  }, [id])

  return {transactionStatus, error}
}
