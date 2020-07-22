import "../default-config"
import {config} from "@onflow/config"
import {spawn, send, INIT, SUBSCRIBE, UNSUBSCRIBE} from "@onflow/util-actor"
import {send as fclSend} from "../send"
import {decode} from "../decode"
import {getTransactionStatus} from "@onflow/sdk"

const POLL_RATE = 1000

const UPDATED = "TRANSACTION/UPDATED"
const SNAPSHOT = "SNAPSHOT"
const POLL = "POLL"

const fetchTxStatus = async transactionId => {
  const response = await fclSend([getTransactionStatus(transactionId)])
  return decode(response)
}

const isSealed = tx => tx.status === 4
const isExecuted = tx => tx.status === 3 || isSealed(tx)
const isFinalized = tx => tx.status === 2 || isExecuted(tx)
const isPending = tx => tx.status === 1 || isFinalized(tx)
const isUnknown = tx => tx.status === 0 || isPending(tx)

const HANDLERS = {
  [INIT]: async ctx => {
    const tx = await fetchTxStatus(ctx.self())
    if (!isSealed(tx)) setTimeout(() => send(ctx.self(), POLL), POLL_RATE)
    ctx.merge(tx)
  },
  [SUBSCRIBE]: (ctx, letter) => {
    ctx.subscribe(letter.from)
    ctx.send(letter.from, UPDATED, ctx.all())
  },
  [UNSUBSCRIBE]: (ctx, letter) => {
    ctx.unsubscribe(letter.from)
  },
  [SNAPSHOT]: async (ctx, letter) => {
    letter.replay(ctx.all())
  },
  [POLL]: async ctx => {
    const tx = await fetchTxStatus(ctx.self())
    if (!isSealed(tx)) setTimeout(() => send(ctx.self(), POLL), POLL_RATE)
    ctx.merge(tx)
    ctx.broadcast(UPDATED, ctx.all())
  },
}

const spawnTransaction = transactionId => {
  if (typeof transactionId === "object")
    transactionId = transactionId.transactionId
  if (transactionId == null) throw new Error("transactionId required")
  return spawn(HANDLERS, transactionId)
}

export function transaction(transactionId) {
  function snapshot() {
    const txId = spawnTransaction(transactionId)
    return send(txId, SNAPSHOT, null, {expectReply: true, timeout: 10})
  }

  function subscribe(callback) {
    const txId = spawnTransaction(transactionId)
    const EXIT = "@EXIT"
    const self = spawn(async ctx => {
      ctx.send(txId, SUBSCRIBE)
      while (1) {
        const letter = await ctx.receive()
        if (letter.tag === EXIT) {
          ctx.send(txId, UNSUBSCRIBE)
          return
        }
        callback(letter.data)
      }
    })
    return () => send(self, EXIT)
  }

  function once(predicate) {
    return function innerOnce() {
      return new Promise(resolve => {
        const unsub = subscribe(transaction => {
          if (predicate(transaction)) {
            resolve(transaction)
            unsub()
          }
        })
      })
    }
  }

  return {
    snapshot,
    subscribe,
    oncePending: once(isPending),
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
