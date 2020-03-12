import {
  isTransaction,
  isGetTransaction,
  isScript,
  isGetAccount,
  isGetEvents,
  isGetLatestBlock,
  isPing
} from "@onflow/interaction"
import {sendTransaction} from "./send-transaction"
import {sendGetTransaction} from "./send-get-transaction"
import {sendExecuteScript} from "./send-execute-script"
import {sendGetAccount} from "./send-get-account"
import {sendGetEvents} from "./send-get-events"
import {sendGetLatestBlock} from "./send-get-latest-block"
import {sendPing} from "./send-ping"

export const send = async (ix, opts = {}) => {
  switch (true) {
    case isTransaction(ix):
      return sendTransaction(ix, opts)
    case isGetTransaction(ix):
      return sendGetTransaction(ix, opts)
    case isScript(ix):
      return sendExecuteScript(ix, opts)
    case isGetAccount(ix):
      return sendGetAccount(ix, opts)
    case isGetEvents(ix):
      return sendGetEvents(ix, opts)
    case isGetLatestBlock(ix):
      return sendGetLatestBlock(ix, opts)
    case isPing(ix):
      return sendPing(ix, opts)
    default:
      return ix
  }
}
