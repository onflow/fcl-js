import {TransactionStatus} from "@onflow/typedefs"

export const isExpired = (tx: TransactionStatus) => tx.status === 5
export const isSealed = (tx: TransactionStatus) => tx.status >= 4
export const isExecuted = (tx: TransactionStatus) => tx.status >= 3
export const isFinalized = (tx: TransactionStatus) => tx.status >= 2
export const isPending = (tx: TransactionStatus) => tx.status >= 1
export const isUnknown = (tx: TransactionStatus) => tx.status >= 0

export const isDiff = (cur: any, next: any) => {
  return JSON.stringify(cur) !== JSON.stringify(next)
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
