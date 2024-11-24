export {sendExecuteScript} from "./send-execute-script.js"
export {sendGetAccount} from "./send-get-account.js"
// @deprecated - will be removed in future versions
import * as logger from "@onflow/util-logger"
logger.log.deprecate({
  pkg: "transport-grpc",
  msg: `@onflow/transport-grpc is deprecated, please use @onflow/transport-http instead or simply remove the \`sdk.transport\` config option within the FCL/JS-SDK.`,
  transition:
    "https://github.com/onflow/fcl-js/tree/master/packages/transport-grpc/README.md",
})

export {sendGetBlockHeader} from "./send-get-block-header.js"
export {sendGetBlock} from "./send-get-block.js"
export {sendGetCollection} from "./send-get-collection.js"
export {sendGetEvents} from "./send-get-events.js"
export {sendGetTransaction} from "./send-get-transaction.js"
export {sendGetTransactionStatus} from "./send-get-transaction-status.js"
export {sendPing} from "./send-ping.js"
export {sendTransaction} from "./send-transaction.js"
export {sendGetNetworkParameters} from "./send-get-network-parameters.js"
export {sendGetNodeVersionInfo} from "./send-get-node-version-info.js"
export {send} from "./send-grpc.js"
