import {TransactionExecutionStatus} from "@onflow/typedefs"
import React, {createContext, useContext, useState, useEffect} from "react"
import {useFlowClient} from "@onflow/react-core"

interface GlobalTransactionContextValue {
  /** Check if a global transaction is currently running */
  globalTxId: string | null
  /** Set the global transaction running state */
  setGlobalTxId: (txId: string | null) => void
}

const GlobalTransactionContext =
  createContext<GlobalTransactionContextValue | null>(null)

export const useGlobalTransaction = (): GlobalTransactionContextValue => {
  const context = useContext(GlobalTransactionContext)
  if (!context) {
    throw new Error(
      "useGlobalTransaction must be used within a GlobalTransactionProvider"
    )
  }
  return context
}

interface GlobalTransactionProviderProps {
  children: React.ReactNode
}

export const GlobalTransactionProvider: React.FC<
  GlobalTransactionProviderProps
> = ({children}) => {
  const [txId, setTxId] = useState<string | null>(null)
  const fcl = useFlowClient()

  useEffect(() => {
    if (!txId) return

    // Subscribe to transaction updates
    const unsub = fcl.tx(txId).subscribe(
      (txStatus: any) => {
        if (txStatus.status >= TransactionExecutionStatus.EXECUTED) {
          // Transaction has been executed, reset the global transaction ID
          setTxId(null)
        }
      },
      (error: any) => {
        // Handle subscription errors
        console.error("Transaction status subscription error:", error)
        // Clear the transaction ID to prevent button from staying in processing state
        setTxId(null)
      }
    )

    return () => {
      unsub()
    }
  }, [txId])

  const globalTransactionValue: GlobalTransactionContextValue = {
    globalTxId: txId,
    setGlobalTxId: (newTxId: string | null) => {
      if (newTxId !== txId) {
        setTxId(newTxId)
      }
    },
  }

  return (
    <GlobalTransactionContext.Provider value={globalTransactionValue}>
      {children}
    </GlobalTransactionContext.Provider>
  )
}
