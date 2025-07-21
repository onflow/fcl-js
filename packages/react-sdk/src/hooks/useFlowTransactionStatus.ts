import {useState, useEffect} from "react"
import {TransactionStatus} from "@onflow/typedefs"
import {useFlowClient} from "./useFlowClient"
import {TransactionError} from "@onflow/fcl"

export interface UseFlowTransactionStatusArgs {
  /** The Flow transaction ID to monitor */
  id?: string | null
  flowClient?: ReturnType<typeof useFlowClient>
}

export interface UseFlowTransactionStatusResult {
  /** Latest transaction status, or null before any update */
  transactionStatus: TransactionStatus | null
  /** Any error encountered during status updates */
  error: Error | null
}

/**
 * Subscribes to status updates for a given Flow transaction ID.
 *
 * @remarks
 * This hook was previously named `useFlowTransaction`.
 *
 * @param args.id - The Flow transaction ID to watch
 * @returns {UseFlowTransactionStatusResult}
 */
export function useFlowTransactionStatus({
  id,
  flowClient,
}: UseFlowTransactionStatusArgs): UseFlowTransactionStatusResult {
  const [transactionStatus, setTransactionStatus] =
    useState<TransactionStatus | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const fcl = useFlowClient({flowClient})

  useEffect(() => {
    if (!id) return

    setTransactionStatus(null)
    setError(null)

    const tx = fcl.tx(id)
    const unsubscribe = tx.subscribe((updatedStatus: TransactionStatus) => {
      setTransactionStatus(updatedStatus)

      if (updatedStatus.errorMessage) {
        setError(TransactionError.fromErrorMessage(updatedStatus.errorMessage))
      }
    })

    return () => {
      unsubscribe()
    }
  }, [id])

  return {transactionStatus, error}
}
