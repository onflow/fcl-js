import {
  isTransaction,
  isGetTransactionStatus,
  isScript,
  isGetAccount,
  isGetEvents,
  isGetLatestBlock,
  isGetBlockById,
  isGetBlockByHeight,
  isPing
} from "@onflow/interaction"
import {sendTransaction} from "./send-transaction"
import {sendGetTransactionStatus} from "./send-get-transaction-status"
import {sendExecuteScript} from "./send-execute-script"
import {sendGetAccount} from "./send-get-account"
import {sendGetEvents} from "./send-get-events"
import {sendGetLatestBlock} from "./send-get-latest-block"
import {sendGetBlockById} from "./send-get-block-by-id"
import {sendGetBlockByHeight} from "./send-get-block-by-height"
import {sendPing} from "./send-ping"

export const send = async (ix, opts = {}) => {
  switch (true) {
    case isTransaction(ix):
      return sendTransaction(ix, opts)
    case isGetTransactionStatus(ix):
      return sendGetTransactionStatus(ix, opts)
    case isScript(ix):
      return sendExecuteScript(ix, opts)
    case isGetAccount(ix):
      return sendGetAccount(ix, opts)
    case isGetEvents(ix):
      return sendGetEvents(ix, opts)
    case isGetLatestBlock(ix):
      return sendGetLatestBlock(ix, opts)
    case isGetBlockById(ix):
      return sendGetBlockById(ix, opts)
    case isGetBlockByHeight(ix):
      return sendGetBlockByHeight(ix, opts)
    case isPing(ix):
      return sendPing(ix, opts)
    default:
      return ix
  }
}
