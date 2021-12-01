import {invariant} from "@onflow/util-invariant"
import {
  isTransaction,
  isGetTransaction,
  isGetTransactionStatus,
  isScript,
  isGetAccount,
  isGetEvents,
  isGetBlock,
  isGetBlockHeader,
  isGetLatestBlock,
  isGetBlockById,
  isGetBlockByHeight,
  isPing,
  isGetCollection,
} from "../interaction/interaction.js.js.js.js.js"
import {sendTransaction} from "./send-transaction.js"
import {sendGetTransactionStatus} from "./send-get-transaction-status.js"
import {sendGetTransaction} from "./send-get-transaction.js"
import {sendExecuteScript} from "./send-execute-script.js"
import {sendGetAccount} from "./send-get-account.js"
import {sendGetEvents} from "./send-get-events.js"
import {sendGetBlock} from "./send-get-block.js"
import {sendGetBlockHeader} from "./send-get-block-header.js"
import {sendGetLatestBlock} from "./send-get-latest-block.js"
import {sendGetBlockById} from "./send-get-block-by-id.js"
import {sendGetBlockByHeight} from "./send-get-block-by-height.js"
import {sendGetCollection} from "./send-get-collection.js"
import {sendPing} from "./send-ping.js"

export const send = async (ix, context = {}, opts = {}) => {
  invariant(opts.node, `SDK Send Error: Either opts.node or "accessNode.api" in config must be defined.`)
  
  ix = await ix

  // prettier-ignore
  switch (true) {
    case isTransaction(ix):
      return opts.sendTransaction ? opts.sendTransaction(ix, context, opts) : sendTransaction(ix, context, opts)
    case isGetTransactionStatus(ix):
      return opts.sendGetTransactionStatus ? opts.sendGetTransactionStatus(ix, context, opts) : sendGetTransactionStatus(ix, context, opts)
    case isGetTransaction(ix):
      return opts.sendGetTransaction ? opts.sendGetTransaction(ix, context, opts) : sendGetTransaction(ix, context, opts)
    case isScript(ix):
      return opts.sendExecuteScript ? opts.sendExecuteScript(ix, context, opts) : sendExecuteScript(ix, context, opts)
    case isGetAccount(ix):
      return opts.sendGetAccount ? opts.sendGetAccount(ix, context, opts) : sendGetAccount(ix, context, opts)
    case isGetEvents(ix):
      return opts.sendGetEvents ? opts.sendGetEvents(ix, context, opts) : sendGetEvents(ix, context, opts)
    case isGetLatestBlock(ix):
      return opts.sendGetLatestBlock ? opts.sendGetLatestBlock(ix, context, opts) : sendGetLatestBlock(ix, context,  opts)
    case isGetBlock(ix):
      return opts.sendGetBlock ? opts.sendGetBlock(ix, context, opts) : sendGetBlock(ix, context, opts)
    case isGetBlockHeader(ix):
      return opts.sendGetBlockHeader ? opts.sendGetBlockHeader(ix, context, opts) : sendGetBlockHeader(ix, context, opts)
    case isGetBlockById(ix):
      return opts.sendGetBlockById ? opts.sendGetBlockById(ix, context, opts) : sendGetBlockById(ix, context, opts)
    case isGetBlockByHeight(ix):
      return opts.sendGetBlockByHeight ? opts.sendGetBlockByHeight(ix, context, opts) : sendGetBlockByHeight(ix, context, opts)
    case isGetCollection(ix):
      return opts.sendGetCollection ? opts.sendGetCollection(ix, context, opts) : sendGetCollection(ix, context, opts)
    case isPing(ix):
      return opts.sendPing ? opts.sendPing(ix, context, opts) : sendPing(ix, context, opts)
    default:
      return ix
  }
}
