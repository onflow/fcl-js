import React, {createContext, useContext, useState, useEffect} from "react"
import {TransactionExecutionStatus} from "@onflow/typedefs"
import {useFlowClient} from "../hooks/useFlowClient"

interface GlobalTransactionContextValue {
  /** Current global transaction ID, or null if none */
  globalTxId: string | null
  /** Set the global transaction ID */
  setGlobalTxId: (txId: string | null) => void
}

const GlobalTransactionContext =
  createContext<GlobalTransactionContextValue | null>(null)

/**
 * Hook to access and manage the global transaction state.
 *
 * @throws Error if used outside of FlowProvider
 *
 * @example
 * ```tsx
 * const {globalTxId, setGlobalTxId} = useGlobalTransaction()
 *
 * // Start tracking a transaction
 * setGlobalTxId(txId)
 *
 * // Check if a transaction is in progress
 * if (globalTxId) {
 *   console.log("Transaction in progress:", globalTxId)
 * }
 * ```
 */
export function useGlobalTransaction(): GlobalTransactionContextValue {
  const context = useContext(GlobalTransactionContext)
  if (!context) {
    throw new Error("useGlobalTransaction must be used within a FlowProvider")
  }
  return context
}

interface GlobalTransactionProviderProps {
  children: React.ReactNode
}

/**
 * Provider that tracks a single global transaction.
 * Automatically clears the transaction ID when the transaction is executed.
 */
export function GlobalTransactionProvider({
  children,
}: GlobalTransactionProviderProps) {
  const [txId, setTxId] = useState<string | null>(null)
  const fcl = useFlowClient()

  useEffect(() => {
    if (!txId) return

    const unsub = fcl.tx(txId).subscribe(
      (txStatus: {status: number}) => {
        if (txStatus.status >= TransactionExecutionStatus.EXECUTED) {
          setTxId(null)
        }
      },
      (error: Error) => {
        console.error("Transaction status subscription error:", error)
        setTxId(null)
      }
    )

    return () => {
      unsub()
    }
  }, [txId])

  const value: GlobalTransactionContextValue = {
    globalTxId: txId,
    setGlobalTxId: (newTxId: string | null) => {
      if (newTxId !== txId) {
        setTxId(newTxId)
      }
    },
  }

  return (
    <GlobalTransactionContext.Provider value={value}>
      {children}
    </GlobalTransactionContext.Provider>
  )
}
