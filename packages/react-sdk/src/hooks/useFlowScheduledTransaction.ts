import {UseQueryOptions, UseQueryResult} from "@tanstack/react-query"
import {parseUnits} from "viem/utils"
import {CONTRACT_ADDRESSES, CADENCE_UFIX64_PRECISION} from "../constants"
import {useFlowClient} from "./useFlowClient"
import {useFlowChainId} from "./useFlowChainId"
import {useFlowQuery} from "./useFlowQuery"
import {
  ScheduledTransaction,
  ScheduledTransactionPriority,
  ScheduledTransactionStatus,
} from "./useFlowScheduledTransactionList"

export interface UseFlowScheduledTransactionArgs {
  txId?: string
  includeHandlerData?: boolean
  query?: Omit<
    UseQueryOptions<ScheduledTransaction | null, Error>,
    "queryKey" | "queryFn"
  >
  flowClient?: ReturnType<typeof useFlowClient>
}

export type UseFlowScheduledTransactionResult = UseQueryResult<
  ScheduledTransaction | null,
  Error
>

const getScheduledTransactionQuery = (chainId: string) => {
  const contractAddresses =
    CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]
  if (!contractAddresses) {
    throw new Error(`Unsupported chain: ${chainId}`)
  }

  return `
import FlowTransactionScheduler from ${contractAddresses.FlowTransactionScheduler}

access(all) struct TransactionInfo {
    access(all) let id: UInt64
    access(all) let priority: UInt8
    access(all) let executionEffort: UInt64
    access(all) let status: UInt8
    access(all) let fees: UFix64
    access(all) let scheduledTimestamp: UFix64
    access(all) let handlerTypeIdentifier: String
    access(all) let handlerAddress: Address

    init(data: FlowTransactionScheduler.TransactionData) {
        self.id = data.id
        self.priority = data.priority.rawValue
        self.executionEffort = data.executionEffort
        self.status = data.status.rawValue
        self.fees = data.fees
        self.scheduledTimestamp = data.scheduledTimestamp
        self.handlerTypeIdentifier = data.handlerTypeIdentifier
        self.handlerAddress = data.handlerAddress
    }
}

/// Gets a transaction by ID (checks globally, not manager-specific)
/// This script is used by: flow schedule get <transaction-id>
access(all) fun main(txId: UInt64): TransactionInfo? {
    // Get transaction data directly from FlowTransactionScheduler
    if let txData = FlowTransactionScheduler.getTransactionData(id: txId) {
        return TransactionInfo(data: txData)
    }
    return nil
}
`
}

const getScheduledTransactionWithHandlerQuery = (chainId: string) => {
  const contractAddresses =
    CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]
  if (!contractAddresses) {
    throw new Error(`Unsupported chain: ${chainId}`)
  }

  return `
import FlowTransactionScheduler from ${contractAddresses.FlowTransactionScheduler}

access(all) struct TransactionInfoWithHandler {
    access(all) let id: UInt64
    access(all) let priority: UInt8
    access(all) let executionEffort: UInt64
    access(all) let status: UInt8
    access(all) let fees: UFix64
    access(all) let scheduledTimestamp: UFix64
    access(all) let handlerTypeIdentifier: String
    access(all) let handlerAddress: Address

    access(all) let handlerUUID: UInt64
    access(all) let handlerResolvedViews: {Type: AnyStruct}

    init(data: FlowTransactionScheduler.TransactionData, handlerUUID: UInt64, resolvedViews: {Type: AnyStruct}) {
        // Initialize transaction fields
        self.id = data.id
        self.priority = data.priority.rawValue
        self.executionEffort = data.executionEffort
        self.status = data.status.rawValue
        self.fees = data.fees
        self.scheduledTimestamp = data.scheduledTimestamp
        self.handlerTypeIdentifier = data.handlerTypeIdentifier
        self.handlerAddress = data.handlerAddress

        self.handlerUUID = handlerUUID
        self.handlerResolvedViews = resolvedViews
    }
}

/// Gets a transaction by ID with handler data (checks globally, not manager-specific)
/// This script is used by: flow schedule get <transaction-id> --include-handler-data
access(all) fun main(txId: UInt64): TransactionInfoWithHandler? {
    // Get transaction data directly from FlowTransactionScheduler
    if let txData = FlowTransactionScheduler.getTransactionData(id: txId) {
        // Borrow handler and resolve views
        let handler = txData.borrowHandler()
        let availableViews = handler.getViews()
        var resolvedViews: {Type: AnyStruct} = {}

        for viewType in availableViews {
            if let resolvedView = handler.resolveView(viewType) {
                resolvedViews[viewType] = resolvedView
            }
        }

        return TransactionInfoWithHandler(
            data: txData,
            handlerUUID: handler.uuid,
            resolvedViews: resolvedViews
        )
    }

    return nil
}
`
}

const convertScheduledTransaction = (
  data: any,
  includeHandlerData: boolean
): ScheduledTransaction => {
  return {
    id: data.id,
    priority: Number(data.priority || 0) as ScheduledTransactionPriority,
    executionEffort: BigInt(data.executionEffort || 0),
    status: Number(data.status || 0) as ScheduledTransactionStatus,
    fees: {
      value: parseUnits(data.fees || "0.0", CADENCE_UFIX64_PRECISION),
      formatted: data.fees || "0.0",
    },
    scheduledTimestamp: Number(data.scheduledTimestamp || 0),
    handlerTypeIdentifier: data.handlerTypeIdentifier || "",
    handlerAddress: data.handlerAddress || "",
    ...(includeHandlerData && {
      handlerUUID: data.handlerUUID,
      handlerResolvedViews: data.handlerResolvedViews || {},
    }),
  }
}

/**
 * Hook for getting a specific scheduled transaction by ID.
 *
 * @param {UseFlowScheduledTransactionArgs} args Configuration including transaction ID and options
 * @returns {UseFlowScheduledTransactionResult} Query result with scheduled transaction or null if not found
 *
 * @example
 * // Basic usage
 * const { data: transaction, isLoading } = useFlowScheduledTransaction({
 *   txId: "42"
 * })
 *
 * @example
 * // With handler data
 * const { data: transaction } = useFlowScheduledTransaction({
 *   txId: "42",
 *   includeHandlerData: true
 * })
 */
export function useFlowScheduledTransaction({
  txId,
  includeHandlerData = false,
  query: queryOptions = {},
  flowClient,
}: UseFlowScheduledTransactionArgs = {}): UseFlowScheduledTransactionResult {
  const chainIdResult = useFlowChainId()
  const chainId = chainIdResult.data

  const queryResult = useFlowQuery({
    cadence: chainId
      ? includeHandlerData
        ? getScheduledTransactionWithHandlerQuery(chainId)
        : getScheduledTransactionQuery(chainId)
      : "",
    args: txId ? (arg, t) => [arg(txId, t.UInt64)] : undefined,
    query: {
      ...(queryOptions as Omit<
        UseQueryOptions<unknown, Error>,
        "queryKey" | "queryFn"
      >),
      enabled: (queryOptions?.enabled ?? true) && !!chainId && !!txId,
    },
    flowClient,
  })

  // Transform raw Cadence data to ScheduledTransaction or null
  const data =
    queryResult.data !== undefined
      ? queryResult.data
        ? convertScheduledTransaction(queryResult.data, includeHandlerData)
        : null
      : undefined

  return {
    ...queryResult,
    data,
  } as UseFlowScheduledTransactionResult
}
