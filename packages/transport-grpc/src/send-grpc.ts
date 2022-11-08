import {invariant} from "@onflow/util-invariant"
import {sendTransaction} from "./send-transaction.js"
import {sendGetTransactionStatus} from "./send-get-transaction-status.js"
import {sendGetTransaction} from "./send-get-transaction.js"
import {sendExecuteScript} from "./send-execute-script.js"
import {sendGetAccount} from "./send-get-account.js"
import {sendGetEvents} from "./send-get-events.js"
import {sendGetBlock} from "./send-get-block.js"
import {sendGetBlockHeader} from "./send-get-block-header.js"
import {sendGetCollection} from "./send-get-collection.js"
import {sendPing} from "./send-ping.js"

export const send = async (ix, context = {}, opts = {}) => {
  invariant(
    opts.node,
    `SDK Send Error: Either opts.node or "accessNode.api" in config must be defined.`
  )
  invariant(context.ix, `SDK Send Error: context.ix must be defined.`)

  ix = await ix

  // prettier-ignore
  switch (true) {
    case context.ix.isTransaction(ix):
      return opts.sendTransaction ? opts.sendTransaction(ix, context, opts) : sendTransaction(ix, context, opts)
    case context.ix.isGetTransactionStatus(ix):
      return opts.sendGetTransactionStatus ? opts.sendGetTransactionStatus(ix, context, opts) : sendGetTransactionStatus(ix, context, opts)
    case context.ix.isGetTransaction(ix):
      return opts.sendGetTransaction ? opts.sendGetTransaction(ix, context, opts) : sendGetTransaction(ix, context, opts)
    case context.ix.isScript(ix):
      return opts.sendExecuteScript ? opts.sendExecuteScript(ix, context, opts) : sendExecuteScript(ix, context, opts)
    case context.ix.isGetAccount(ix):
      return opts.sendGetAccount ? opts.sendGetAccount(ix, context, opts) : sendGetAccount(ix, context, opts)
    case context.ix.isGetEvents(ix):
      return opts.sendGetEvents ? opts.sendGetEvents(ix, context, opts) : sendGetEvents(ix, context, opts)
    case context.ix.isGetBlock(ix):
      return opts.sendGetBlock ? opts.sendGetBlock(ix, context, opts) : sendGetBlock(ix, context, opts)
    case context.ix.isGetBlockHeader(ix):
      return opts.sendGetBlockHeader ? opts.sendGetBlockHeader(ix, context, opts) : sendGetBlockHeader(ix, context, opts)
    case context.ix.isGetCollection(ix):
      return opts.sendGetCollection ? opts.sendGetCollection(ix, context, opts) : sendGetCollection(ix, context, opts)
    case context.ix.isPing(ix):
      return opts.sendPing ? opts.sendPing(ix, context, opts) : sendPing(ix, context, opts)
    default:
      return ix
  }
}
