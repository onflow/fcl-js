import "../default-config"
import {
  SubscriptionTopic,
  TransactionExecutionStatus,
  TransactionStatus,
} from "@onflow/typedefs"
import {
  isDiff,
  isExecuted,
  isExpired,
  isFinalized,
  isPending,
  isSealed,
  scoped,
} from "./utils"
import {TXID_REGEXP} from "./constants"
import {
  isUnknown,
  subscribe as sdkSubscribe,
  SubscriptionsNotSupportedError,
} from "@onflow/sdk"
import {TransactionError} from "./transaction-error"
import {transaction as legacyTransaction} from "./legacy-polling"

// Map of transaction observables
// Used for shared global singleton to prevent duplicate subscriptions
const registry = new Map<string, ReturnType<typeof createObservable>>()

/**
 * Provides methods for interacting with a transaction
 *
 * @param transactionId - The transaction ID
 * @param opts - Optional parameters
 * @param opts.pollRate - Polling rate in milliseconds
 * @param opts.txNotFoundTimeout - Timeout in milliseconds for ignoring transaction not found errors (do not modify unless you know what you are doing)
 * @throws {Error} If transactionId is not a 64 byte hash string
 */
export function transaction(
  transactionId: string,
  opts: {
    pollRate?: number
    txNotFoundTimeout?: number
  } = {txNotFoundTimeout: 12500, pollRate: 1000}
): {
  snapshot: () => Promise<TransactionStatus>
  subscribe: (
    onData: (txStatus: TransactionStatus) => void,
    onError?: (err: Error) => void
  ) => () => void
  onceFinalized: () => Promise<TransactionStatus>
  onceExecuted: () => Promise<TransactionStatus>
  onceSealed: () => Promise<TransactionStatus>
} {
  // Validate transactionId as 64 byte hash
  if (!TXID_REGEXP.test(scoped(transactionId)))
    throw new Error("Invalid transactionId")

  function getObservable() {
    let observable = registry.get(transactionId)
    if (!observable) {
      observable = createObservable(transactionId, opts)
      registry.set(transactionId, observable)
    }
    return observable
  }

  function snapshot() {
    return Promise.resolve(getObservable().value)
  }

  function subscribe(
    onData: (txStatus: TransactionStatus) => void,
    onError?: (err: Error) => void
  ) {
    const observable = getObservable()
    const {unsubscribe} = observable.subscribe(onData, onError)
    return () => unsubscribe()
  }

  function once(predicate: (txStatus: TransactionStatus) => boolean) {
    return function innerOnce(opts = {suppress: false}) {
      const suppress = opts.suppress || false
      return new Promise((resolve, reject) => {
        const unsub = subscribe(((
          txStatus?: TransactionStatus,
          error?: Error
        ) => {
          if ((error || txStatus?.statusCode) && !suppress) {
            if (error != null) {
              reject(error)
              unsub()
            } else if (txStatus?.statusCode === 1) {
              const transactionError = TransactionError.fromErrorMessage(
                txStatus.errorMessage
              )
              reject(transactionError)
              unsub()
            }
            return
          }

          if (predicate(txStatus!)) {
            resolve(txStatus!)
            unsub()
          }
        }) as any)
      }) as Promise<TransactionStatus>
    }
  }

  return {
    snapshot,
    subscribe,
    onceFinalized: once(isFinalized),
    onceExecuted: once(isExecuted),
    onceSealed: once(isSealed),
  }
}

transaction.isUnknown = isUnknown
transaction.isPending = isPending
transaction.isFinalized = isFinalized
transaction.isExecuted = isExecuted
transaction.isSealed = isSealed
transaction.isExpired = isExpired

/**
 * Creates an observable for a transaction
 */
function createObservable(
  txId: string,
  opts: {pollRate?: number; txNotFoundTimeout?: number}
) {
  const observers = new Set<{
    onData: (txStatus: TransactionStatus) => void
    onError: (err: Error) => void
  }>()
  let value: TransactionStatus = {
    blockId: "",
    status: TransactionExecutionStatus.UNKNOWN,
    statusCode: 0,
    errorMessage: "",
    events: [],
    statusString: "",
  }

  // Subscribe to transaction status updates
  sdkSubscribe({
    topic: SubscriptionTopic.TRANSACTION_STATUSES,
    args: {transactionId: txId},
    onData: txStatus => {
      if (isDiff(value, txStatus)) {
        value = txStatus
        next(txStatus)
      }
    },
    onError: (err: Error) => {
      if (err instanceof SubscriptionsNotSupportedError) {
        fallbackLegacyPolling()
      } else {
        error(err)
      }
    },
  })

  function fallbackLegacyPolling() {
    console.warn(
      "Failed to subscribe to transaction status updates using real-time streaming (are you using the deprecated GRPC transport?), falling back to polling."
    )

    // Poll for transaction status updates
    legacyTransaction(txId, opts).subscribe(
      (txStatus?: TransactionStatus, err?: Error) => {
        if (err) {
          error(err)
        } else if (txStatus) {
          value = txStatus
          next(txStatus)
        }
      }
    )
  }

  function next(txStatus: TransactionStatus) {
    for (const observer of observers) {
      try {
        observer.onData(txStatus)
      } catch (error) {
        console.error("Error in transaction observer", error)
      }
    }
  }

  function error(err: Error) {
    for (const observer of observers) {
      try {
        observer.onError(err)
      } catch (error) {
        console.error("Error in transaction observer", error)
      }
    }
  }

  return {
    subscribe(
      onData: (status: TransactionStatus) => void,
      onError?: (error: Error) => void
    ) {
      const observer = {
        onData,
        onError: onError || (() => {}),
      }
      observers.add(observer)
      onData(value)

      return {
        unsubscribe: () => observers.delete(observer),
      }
    },
    get value() {
      return value
    },
  }
}
