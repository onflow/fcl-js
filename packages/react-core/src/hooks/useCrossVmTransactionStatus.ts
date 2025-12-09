import type {TransactionStatus} from "@onflow/typedefs"
import type {FlowClientCore} from "@onflow/fcl-core"
import {CONTRACT_ADDRESSES} from "../constants"
import {useFlowChainId} from "./useFlowChainId"
import {useFlowTransactionStatus} from "./useFlowTransactionStatus"

// Helper function to remove "0x" prefix
function sansPrefix(address: string): string {
  return address.replace(/^0x/, "")
}

export interface UseCrossVmTransactionStatusArgs {
  /** The Flow transaction ID to monitor */
  id?: string
  flowClient?: FlowClientCore
}

export interface UseCrossVmTransactionStatusResult {
  /** Latest transaction status, or null before any update */
  transactionStatus: TransactionStatus | null
  /** EVM transaction results, if available */
  evmResults?: CallOutcome[]
  /** Any error encountered during status updates */
  error: Error | null
}

export interface CallOutcome {
  status: "passed" | "failed" | "skipped"
  hash?: string
  errorMessage?: string
}

export interface EvmTransactionExecutedData {
  hash: string[]
  index: string
  type: string
  payload: string[]
  errorCode: string
  errorMessage: string
  gasConsumed: string
  contractAddress: string
  logs: string[]
  blockHeight: string
  returnedData: string[]
  precompiledCalls: string[]
  stateUpdateChecksum: string
}

/**
 * Subscribes to status updates for a given Cross-VM Flow transaction ID that executes EVM calls.
 * This hook monitors the transaction status and extracts EVM call results if available.
 *
 * @returns {UseCrossVmTransactionStatusResult}
 */
export function useCrossVmTransactionStatus({
  id,
  flowClient,
}: UseCrossVmTransactionStatusArgs): UseCrossVmTransactionStatusResult {
  const chainId = useFlowChainId()

  const eventType =
    chainId.data && chainId.data in CONTRACT_ADDRESSES
      ? `A.${sansPrefix(CONTRACT_ADDRESSES[chainId.data as keyof typeof CONTRACT_ADDRESSES].EVM)}.EVM.TransactionExecuted`
      : null

  const {transactionStatus, error} = useFlowTransactionStatus({
    id: eventType ? id : undefined,
    flowClient,
  })

  if (eventType === null) {
    return {
      transactionStatus: null,
      error: new Error(
        `Unsupported chain: ${chainId.data}. Please ensure the chain ID is valid and supported.`
      ),
    }
  }

  const evmEvents = transactionStatus?.events
    ?.filter(event => event.type === eventType)
    ?.map(event => event.data) as EvmTransactionExecutedData[]

  const evmResults: CallOutcome[] = evmEvents?.map(event => {
    const {hash, errorCode, errorMessage} = event
    const result: CallOutcome = {
      status: errorCode === "0" ? "passed" : "failed",
      hash: `0x${hash.map(h => parseInt(h, 10).toString(16).padStart(2, "0")).join("")}`,
    }
    if (event.errorMessage) {
      result.errorMessage = errorMessage
    }
    return result
  })

  return {transactionStatus, error, evmResults: evmResults}
}
