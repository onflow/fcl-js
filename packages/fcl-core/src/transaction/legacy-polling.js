import "../default-config"
import {
  spawn,
  subscriber,
  snapshoter,
  UPDATED,
  SNAPSHOT,
  INIT,
  SUBSCRIBE,
  UNSUBSCRIBE,
} from "@onflow/util-actor"
import {send as fclSend, decode, getTransactionStatus} from "@onflow/sdk"
import {HTTPRequestError} from "@onflow/transport-http"
import {grpc} from "@improbable-eng/grpc-web"
import {TransactionError} from "./transaction-error"
import {
  scoped,
  isDiff,
  isUnknown,
  isPending,
  isFinalized,
  isExecuted,
  isSealed,
  isExpired,
} from "./utils"

const POLL = "POLL"
const TIMEOUT = "TIMEOUT"

/**
 * @typedef {import("@onflow/typedefs").Transaction} Transaction
 */

/**
 * @typedef {import("@onflow/typedefs").TransactionStatus} TransactionStatus
 */

const fetchTxStatus = async transactionId => {
  return fclSend([getTransactionStatus(transactionId)]).then(decode)
}

const makeHandlers = (opts = {}) => ({
  [INIT]: async ctx => {
    setTimeout(() => ctx.sendSelf(TIMEOUT), opts.txNotFoundTimeout)
    ctx.sendSelf(POLL)
  },
  [SUBSCRIBE]: (ctx, letter) => {
    ctx.subscribe(letter.from)
    ctx.send(letter.from, UPDATED, ctx.all())
  },
  [UNSUBSCRIBE]: (ctx, letter) => {
    ctx.unsubscribe(letter.from)
  },
  [SNAPSHOT]: async (ctx, letter) => {
    letter.reply(ctx.all())
  },
  [TIMEOUT]: async ctx => {
    // If status is still unknown, send a timeout error
    if (Object.keys(ctx.all()).length === 0) {
      ctx.fatalError(
        new Error(
          `TX status polling failed: no transaction was found within timeout interval (${opts.txNotFoundTimeout}ms)`
        )
      )
    }
  },
  [POLL]: async ctx => {
    // Helper to queue another poll
    const poll = () => setTimeout(() => ctx.sendSelf(POLL), opts.pollRate)

    let tx
    const prevTx = ctx.all()
    try {
      tx = await fetchTxStatus(ctx.self())
    } catch (e) {
      const isHttpNotFound =
        e instanceof HTTPRequestError && e.statusCode === 404
      const isGrpcNotFound = e.code === grpc.Code.NotFound

      // If TX is not found, suppress error and poll again
      if (isHttpNotFound || isGrpcNotFound) {
        return poll()
      }

      return ctx.fatalError(e)
    }

    if (!isSealed(tx)) poll()
    if (isDiff(prevTx, tx)) ctx.broadcast(UPDATED, tx)
    ctx.merge(tx)
  },
})

const spawnTransaction =
  (opts = {}) =>
  transactionId => {
    return spawn(makeHandlers(opts), scoped(transactionId))
  }

/**
 * Provides methods for interacting with a transaction
 *
 * @param {string} transactionId - The transaction ID
 * @param {object} [opts] - Optional parameters
 * @param {number} [opts.pollRate=1000] - Polling rate in milliseconds
 * @param {number} [opts.txNotFoundTimeout=12500] - Timeout in milliseconds for ignoring transaction not found errors (do not modify unless you know what you are doing)
 * @returns {{
 *    snapshot: function(): Promise<TransactionStatus>,
 *    subscribe: function(SubscriptionCallback): function(): void,
 *    onceFinalized: function(): Promise<TransactionStatus>,
 *    onceExecuted: function(): Promise<TransactionStatus>,
 *    onceSealed: function(): Promise<TransactionStatus>
 * }}
 * @throws {Error} If transactionId is not a 64 byte hash string
 */
export function transaction(
  transactionId,
  opts = {txNotFoundTimeout: 12500, pollRate: 1000}
) {
  function snapshot() {
    return snapshoter(transactionId, spawnTransaction(opts))
  }

  function subscribe(callback) {
    return subscriber(scoped(transactionId), spawnTransaction(opts), callback)
  }

  function once(predicate) {
    return function innerOnce(opts = {}) {
      const suppress = opts.suppress || false
      return new Promise((resolve, reject) => {
        const unsub = subscribe((txStatus, error) => {
          if ((error || txStatus.statusCode) && !suppress) {
            if (error != null) {
              reject(error)
              unsub()
            } else if (txStatus.statusCode === 1) {
              const transactionError = TransactionError.fromErrorMessage(
                txStatus.errorMessage
              )
              reject(transactionError)
              unsub()
            }
            return
          }

          if (predicate(txStatus)) {
            resolve(txStatus)
            unsub()
          }
        })
      })
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

export {TransactionError}
