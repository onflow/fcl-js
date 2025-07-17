import {useState, useEffect} from "react"
import {TransactionStatus} from "@onflow/typedefs"
import {useClient} from "../provider/FlowProvider"
import {TransactionError} from "@onflow/fcl"

export interface UseFlowTransactionStatusArgs {
  /** The Flow transaction ID to monitor */
  id?: string | null
  client?: ReturnType<typeof useClient>
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
  client,
}: UseFlowTransactionStatusArgs): UseFlowTransactionStatusResult {
  const [transactionStatus, setTransactionStatus] =
    useState<TransactionStatus | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const fcl = useClient({client})

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
