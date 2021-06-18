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
} from "../interaction/interaction.js"
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
import {config} from "../config"

export const send = async (ix, opts = {}) => {
  opts.node = opts.node || (await config().get("accessNode.api"))
  ix = await ix

  // prettier-ignore
  switch (true) {
    case isTransaction(ix):
      return opts.sendTransaction ? opts.sendTransaction(ix, opts) : sendTransaction(ix, opts)
    case isGetTransactionStatus(ix):
      return opts.sendGetTransactionStatus ? opts.sendGetTransactionStatus(ix, opts) : sendGetTransactionStatus(ix, opts)
    case isGetTransaction(ix):
      return opts.sendGetTransaction ? opts.sendGetTransaction(ix, opts) : sendGetTransaction(ix, opts)
    case isScript(ix):
      return opts.sendExecuteScript ? opts.sendExecuteScript(ix, opts) : sendExecuteScript(ix, opts)
    case isGetAccount(ix):
      return opts.sendGetAccount ? opts.sendGetAccount(ix, opts) : sendGetAccount(ix, opts)
    case isGetEvents(ix):
      return opts.sendGetEvents ? opts.sendGetEvents(ix, opts) : sendGetEvents(ix, opts)
    case isGetLatestBlock(ix):
      return opts.sendGetLatestBlock ? opts.sendGetLatestBlock(ix, opts) : sendGetLatestBlock(ix,  opts)
    case isGetBlock(ix):
      return opts.sendGetBlock ? opts.sendGetBlock(ix, opts) : sendGetBlock(ix, opts)
    case isGetBlockHeader(ix):
      return opts.sendGetBlockHeader ? opts.sendGetBlockHeader(ix, opts) : sendGetBlockHeader(ix, opts)
    case isGetBlockById(ix):
      return opts.sendGetBlockById ? opts.sendGetBlockById(ix, opts) : sendGetBlockById(ix, opts)
    case isGetBlockByHeight(ix):
      return opts.sendGetBlockByHeight ? opts.sendGetBlockByHeight(ix, opts) : sendGetBlockByHeight(ix, opts)
    case isGetCollection(ix):
      return opts.sendGetCollection ? opts.sendGetCollection(ix, opts) : sendGetCollection(ix, opts)
    case isPing(ix):
      return opts.sendPing ? opts.sendPing(ix, opts) : sendPing(ix, opts)
    default:
      return ix
  }
}
