import {TransactionStatus} from "@onflow/typedefs"

export type SubscriptionCallback = (
  txStatus?: TransactionStatus,
  error?: Error
) => void
