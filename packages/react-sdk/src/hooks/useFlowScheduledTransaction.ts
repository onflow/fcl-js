import {useQuery, UseQueryOptions, UseQueryResult} from "@tanstack/react-query"
import {useCallback} from "react"
import {parseUnits} from "viem/utils"
import {CONTRACT_ADDRESSES, CADENCE_UFIX64_PRECISION} from "../constants"
import {useFlowQueryClient} from "../provider/FlowQueryClient"
import {useFlowClient} from "./useFlowClient"
import {useFlowChainId} from "./useFlowChainId"
import {
  ScheduledTransactionInfo,
  ScheduledTransactionPriority,
  ScheduledTransactionStatus,
} from "./useFlowScheduledTransactionList"

export interface UseFlowScheduledTransactionArgs {
  scheduledTxId?: string
  includeHandlerData?: boolean
  query?: Omit<
    UseQueryOptions<ScheduledTransactionInfo | null, Error>,
    "queryKey" | "queryFn"
  >
  flowClient?: ReturnType<typeof useFlowClient>
}

export type UseFlowScheduledTransactionResult = UseQueryResult<
  ScheduledTransactionInfo | null,
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

const convertScheduledTransactionInfo = (
  data: any,
  includeHandlerData: boolean
): ScheduledTransactionInfo => {
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
 * Uses TanStack Query for caching and automatic refetching.
 *
 * @param {UseFlowScheduledTransactionArgs} args - Configuration including transaction ID and options
 * @returns {UseFlowScheduledTransactionResult} Query result with scheduled transaction or null if not found
 *
 * @example
 * // Basic usage
 * const { data: transaction, isLoading } = useFlowScheduledTransaction({
 *   scheduledTxId: "42"
 * })
 *
 * @example
 * // With handler data
 * const { data: transaction } = useFlowScheduledTransaction({
 *   scheduledTxId: "42",
 *   includeHandlerData: true
 * })
 */
export function useFlowScheduledTransaction({
  scheduledTxId,
  includeHandlerData = false,
  query: queryOptions = {},
  flowClient,
}: UseFlowScheduledTransactionArgs = {}): UseFlowScheduledTransactionResult {
  const queryClient = useFlowQueryClient()
  const fcl = useFlowClient({flowClient})
  const chainIdResult = useFlowChainId()
  const chainId = chainIdResult.data

  const fetchScheduledTransaction =
    useCallback(async (): Promise<ScheduledTransactionInfo | null> => {
      if (!chainId || !scheduledTxId) return null

      const cadence = includeHandlerData
        ? getScheduledTransactionWithHandlerQuery(chainId)
        : getScheduledTransactionQuery(chainId)

      const result = await fcl.query({
        cadence,
        args: (arg, t) => [arg(scheduledTxId, t.UInt64)],
      })

      if (!result) return null

      return convertScheduledTransactionInfo(result, includeHandlerData)
    }, [chainId, scheduledTxId, includeHandlerData])

  return useQuery<ScheduledTransactionInfo | null, Error>(
    {
      queryKey: ["flowScheduledTransaction", scheduledTxId, includeHandlerData],
      queryFn: fetchScheduledTransaction,
      enabled: Boolean(
        chainId && scheduledTxId && (queryOptions?.enabled ?? true)
      ),
      ...queryOptions,
    },
    queryClient
  )
}
