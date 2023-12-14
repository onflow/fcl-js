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

const TXID_REGEXP = /^[0-9a-fA-F]{64}$/

/**
 * @typedef {import("@onflow/typedefs").Transaction} Transaction
 */

/**
 * @typedef {import("@onflow/typedefs").TransactionStatus} TransactionStatus
 */

const POLL = "POLL"
const TIMEOUT = "TIMEOUT"

const fetchTxStatus = async transactionId => {
  return fclSend([getTransactionStatus(transactionId)]).then(decode)
}

const isExpired = tx => tx.status === 5
const isSealed = tx => tx.status >= 4
const isExecuted = tx => tx.status >= 3
const isFinalized = tx => tx.status >= 2
const isPending = tx => tx.status >= 1
const isUnknown = tx => tx.status >= 0

const isDiff = (cur, next) => {
  return JSON.stringify(cur) !== JSON.stringify(next)
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

const scoped = transactionId => {
  if (typeof transactionId === "object")
    transactionId = transactionId.transactionId
  if (transactionId == null) throw new Error("transactionId required")
  return transactionId
}

const spawnTransaction =
  (opts = {}) =>
  transactionId => {
    return spawn(makeHandlers(opts), scoped(transactionId))
  }

/**
 * @callback SubscriptionCallback
 * @param {TransactionStatus} txStatus
 * @returns {void}
 */

/**
 * Provides methods for interacting with a transaction
 *
 * @param {string} transactionId - The transaction ID
 * @param {object} [opts] - Optional parameters
 * @param {number} [opts.pollRate=2500] - Polling rate in milliseconds
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
  opts = {txNotFoundTimeout: 12500, pollRate: 2500}
) {
  // Validate transactionId as 64 byte hash
  if (!TXID_REGEXP.test(scoped(transactionId)))
    throw new Error("Invalid transactionId")

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
            reject(error || txStatus.errorMessage)
            unsub()
          } else if (predicate(txStatus)) {
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
