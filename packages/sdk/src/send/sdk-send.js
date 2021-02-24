import {
    isTransaction,
    isGetTransaction,
    isGetTransactionStatus,
    isScript,
    isGetAccount,
    isGetEvents,
    isGetBlock,
    isGetLatestBlock,
    isGetBlockById,
    isGetBlockByHeight,
    isPing,
} from "../interaction/interaction.js"
import {sendTransaction} from "./send-transaction.js"
import {sendGetTransactionStatus} from "./send-get-transaction-status.js"
import {sendGetTransaction} from "./send-get-transaction.js"
import {sendExecuteScript} from "./send-execute-script.js"
import {sendGetAccount} from "./send-get-account.js"
import {sendGetEvents} from "./send-get-events.js"
import {sendGetBlock} from "./send-get-block.js"
import {sendGetLatestBlock} from "./send-get-latest-block.js"
import {sendGetBlockById} from "./send-get-block-by-id.js"
import {sendGetBlockByHeight} from "./send-get-block-by-height.js"
import {sendPing} from "./send-ping.js"
import {config} from "@onflow/config"

export const send = async (ix, opts = {}) => {
    opts.node = opts.node || (await config().get("accessNode.api"))
    ix = await ix

    switch (true) {
        case isTransaction(ix):
            return sendTransaction(ix, opts)
        case isGetTransactionStatus(ix):
            return sendGetTransactionStatus(ix, opts)
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
        case isGetBlock(ix):
            return sendGetBlock(ix, opts)
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
