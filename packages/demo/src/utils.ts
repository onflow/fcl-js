import {type FlowNetwork} from "@onflow/kit"
import {BLOCK_EXPLORER_URLS} from "./constants"

export const createExplorerTransactionLink = ({
  flowNetwork,
  transactionId,
}: {
  flowNetwork: FlowNetwork
  transactionId: string
}) => `${BLOCK_EXPLORER_URLS[flowNetwork]}/transaction/${transactionId}`
