import {useState, useEffect} from "react"
import * as fcl from "@onflow/fcl"
import {TransactionStatus} from "@onflow/typedefs"

interface UseFlowTransactionResult {
  transactionStatus: TransactionStatus | null
  error: Error | null
}

/**
 * useFlowTransaction
 *
 * Subscribes to transaction status updates for a given txId
 * and returns the current status, loading state, and any error.
 *
 * @param txId - The Flow transaction ID to monitor.
 * @returns {UseFlowTransactionResult}
 */
export function useFlowTransaction(txId?: string): UseFlowTransactionResult {
  const [transactionStatus, setTransactionStatus] =
    useState<TransactionStatus | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!txId) return

    setTransactionStatus(null)
    setError(null)

    const tx = fcl.tx(txId)

    const unsubscribe = tx.subscribe((updatedStatus: TransactionStatus) => {
      setTransactionStatus(updatedStatus)

      if (updatedStatus.errorMessage) {
        setError(new Error(updatedStatus.errorMessage))
      }
    })

    return () => {
      unsubscribe()
    }
  }, [txId])

  return {
    transactionStatus,
    error,
  }
}
