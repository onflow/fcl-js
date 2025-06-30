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
import {createGetChainId} from "../utils"
import {FCLContext} from "../context"
import {createPartialGlobalFCLContext} from "../context/global"

const FLOW_EMULATOR = "local"

// Map of transaction observables
// Used for shared global singleton to prevent duplicate subscriptions
const registry = new Map<string, ReturnType<typeof createObservable>>()

export function createTransaction(context: Pick<FCLContext, "sdk" | "config">) {
  /**
   * @description Creates a transaction monitor that provides methods for tracking and subscribing to
   * transaction status updates on the Flow blockchain. This function returns an object with methods
   * to get snapshots, subscribe to status changes, and wait for specific transaction states.
   *
   * @param transactionId The 64-character hex transaction ID to monitor. Must be a valid
   * Flow transaction hash (64 bytes represented as hex string).
   * @param opts Optional configuration parameters
   * @param opts.pollRate Polling rate in milliseconds when using legacy polling fallback
   * @param opts.txNotFoundTimeout Timeout in milliseconds for ignoring transaction
   * not found errors during initial transaction propagation (do not modify unless you know what you are doing)
   *
   * @returns Transaction monitor object with methods for tracking transaction status
   * @returns Function returns.snapshot - Get current transaction status snapshot
   * @returns Function returns.subscribe - Subscribe to transaction status updates
   * @returns Function returns.onceFinalized - Wait for transaction to be finalized
   * @returns Function returns.onceExecuted - Wait for transaction to be executed
   * @returns Function returns.onceSealed - Wait for transaction to be sealed
   *
   * @throws If transactionId is not a valid 64-byte hash string
   *
   * @example
   * // Basic transaction monitoring
   * import * as fcl from "@onflow/fcl"
   *
   * const txId = await fcl.mutate({
   *   cadence: `
   *     transaction {
   *       execute { log("Hello, World!") }
   *     }
   *   `
   * })
   *
   * // Get current status
   * const status = await fcl.tx(txId).snapshot()
   * console.log("Current status:", status.status)
   *
   * // Subscribe to all status changes
   * const unsubscribe = fcl.tx(txId).subscribe((status) => {
   *   console.log("Status update:", status.status)
   *   if (status.status === fcl.transaction.isSealed) {
   *     console.log("Transaction sealed!")
   *     console.log("Events:", status.events)
   *   }
   * })
   * // Clean up subscription when done
   * setTimeout(() => unsubscribe(), 60000)
   *
   * // Wait for specific transaction states
   * try {
   *   // Wait for finalization (consensus reached)
   *   const finalizedStatus = await fcl.tx(txId).onceFinalized()
   *   console.log("Transaction finalized")
   *
   *   // Wait for execution (transaction executed)
   *   const executedStatus = await fcl.tx(txId).onceExecuted()
   *   console.log("Transaction executed")
   *
   *   // Wait for sealing (transaction sealed in block)
   *   const sealedStatus = await fcl.tx(txId).onceSealed()
   *   console.log("Transaction sealed:", sealedStatus.events)
   * } catch (error) {
   *   console.error("Transaction failed:", error.message)
   * }
   *
   * // Handle transaction errors
   * fcl.tx(txId).subscribe(
   *   (status) => {
   *     if (status.statusCode === 1) {
   *       console.error("Transaction error:", status.errorMessage)
   *     }
   *   },
   *   (error) => {
   *     console.error("Subscription error:", error)
   *   }
   * )
   */
  function transaction(
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
        observable = createObservable(context, transactionId, opts)
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
          const unsub = subscribe(
            (txStatus: TransactionStatus) => {
              if (txStatus.statusCode === 1) {
                const transactionError = TransactionError.fromErrorMessage(
                  txStatus.errorMessage
                )
                reject(transactionError)
                unsub()
              } else if (predicate(txStatus)) {
                resolve(txStatus)
                unsub()
              }
            },
            err => {
              if (!suppress) {
                reject(err)
                unsub()
              }
            }
          )
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

  return transaction
}

export const transaction = createTransaction(createPartialGlobalFCLContext())

/**
 * @description Creates an observable for a transaction
 */
function createObservable(
  context: Pick<FCLContext, "sdk" | "config">,
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

  // Initialize the subscription
  init().catch(error)

  async function init() {
    const flowNetwork = await createGetChainId(context)()

    // As of Flow CLI v2.2.8, WebSocket subscriptions are not supported on the Flow emulator
    // This conditional will be removed when WebSocket subscriptions are supported in this environment
    if (flowNetwork === FLOW_EMULATOR) {
      console.warn(
        "Events are not supported on the Flow emulator, falling back to legacy polling."
      )
      fallbackLegacyPolling()
    } else {
      subscribeTransactionStatuses()
    }
  }

  // Subscribe to transaction status updates
  function subscribeTransactionStatuses() {
    // Subscribe to transaction status updates
    const subscription = sdkSubscribe({
      topic: SubscriptionTopic.TRANSACTION_STATUSES,
      args: {transactionId: txId},
      onData: txStatus => {
        if (isDiff(value, txStatus)) {
          value = txStatus
          next(txStatus)
        }

        // Clean up the subscription if the transaction is sealed
        // Wait for next tick to ensure unsubscribe is defined
        if (isSealed(txStatus)) {
          new Promise(resolve => setTimeout(resolve, 0)).then(() => {
            if (isSealed(txStatus)) {
              subscription.unsubscribe()
            }
          })
        }
      },
      onError: (err: Error) => {
        if (err instanceof SubscriptionsNotSupportedError) {
          console.warn(
            "Failed to subscribe to transaction status updates using real-time streaming (are you using the deprecated GRPC transport?), falling back to polling."
          )
          fallbackLegacyPolling()
        } else {
          error(err)
        }
      },
    })
  }

  function fallbackLegacyPolling() {
    // Poll for transaction status updates
    const unsubscribe = legacyTransaction(txId, opts).subscribe(
      (txStatus?: TransactionStatus, err?: Error) => {
        if (err) {
          error(err)
        } else if (txStatus && isDiff(value, txStatus)) {
          value = txStatus
          next(txStatus)

          // Clean up the subscription if the transaction is sealed
          // Wait for next tick to ensure unsubscribe is defined
          if (isSealed(txStatus)) {
            new Promise(resolve => setTimeout(resolve, 0)).then(() => {
              unsubscribe()
            })
          }
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
