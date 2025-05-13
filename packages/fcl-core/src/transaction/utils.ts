import {TransactionStatus} from "@onflow/typedefs"

export const isExpired = (tx: TransactionStatus) => tx.status === 5
export const isSealed = (tx: TransactionStatus) => tx.status >= 4
export const isExecuted = (tx: TransactionStatus) => tx.status >= 3
export const isFinalized = (tx: TransactionStatus) => tx.status >= 2
export const isPending = (tx: TransactionStatus) => tx.status >= 1
export const isUnknown = (tx: TransactionStatus) => tx.status >= 0

export const deepEqual = (a: any, b: any): boolean => {
  if (a === b) return true
  if (typeof a !== "object" || typeof b !== "object") return false
  if (Object.keys(a).length !== Object.keys(b).length) return false
  for (const key in a) if (!deepEqual(a[key], b[key])) return false
  return true
}

export const isDiff = (a: any, b: any): boolean => {
  return !deepEqual(a, b)
}

export const scoped = (
  transactionId:
    | string
    | {
        transactionId: string
      }
) => {
  if (typeof transactionId === "object")
    transactionId = transactionId.transactionId
  if (transactionId == null) throw new Error("transactionId required")
  return transactionId
}
