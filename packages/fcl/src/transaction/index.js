import "../default-config"
import {
  spawn,
  send,
  subscriber,
  snapshoter,
  UPDATED,
  SNAPSHOT,
  INIT,
  SUBSCRIBE,
  UNSUBSCRIBE,
  ERROR,
} from "@onflow/util-actor"
import {send as fclSend, decode, getTransactionStatus} from "@onflow/sdk"

/**
 * @typedef {import("@onflow/typedefs").Transaction} Transaction
 */

/**
 * @typedef {import("@onflow/typedefs").TransactionStatus} TransactionStatus
 */

const RATE = 2500
const POLL = "POLL"

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

const HANDLERS = {
  [INIT]: async ctx => {
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
  [POLL]: async ctx => {
    let tx
    try {
      tx = await fetchTxStatus(ctx.self())
    } catch (e) {
      return ctx.fatalError(e)
    }

    if (!isSealed(tx)) setTimeout(() => ctx.sendSelf(POLL), RATE)
    if (isDiff(ctx.all(), tx)) ctx.broadcast(UPDATED, tx)
    ctx.merge(tx)
  },
}

const scoped = transactionId => {
  if (typeof transactionId === "object")
    transactionId = transactionId.transactionId
  if (transactionId == null) throw new Error("transactionId required")
  return transactionId
}

const spawnTransaction = transactionId => {
  return spawn(HANDLERS, scoped(transactionId))
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
 * @returns {{
 *    snapshot: function(): Promise<TransactionStatus>,
 *    subscribe: function(SubscriptionCallback): function(): void,
 *    onceFinalized: function(): Promise<TransactionStatus>,
 *    onceExecuted: function(): Promise<TransactionStatus>,
 *    onceSealed: function(): Promise<TransactionStatus>
 * }}
 */
export function transaction(transactionId) {
  function snapshot() {
    return snapshoter(transactionId, spawnTransaction)
  }

  function subscribe(callback) {
    return subscriber(scoped(transactionId), spawnTransaction, callback)
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
