import {useQuery, UseQueryOptions, UseQueryResult} from "@tanstack/react-query"
import {useCallback} from "react"
import {parseUnits} from "viem/utils"
import {CADENCE_UFIX64_PRECISION, CONTRACT_ADDRESSES} from "../constants"
import {useFlowQueryClient} from "../provider/FlowQueryClient"
import {useFlowChainId} from "./useFlowChainId"
import {useFlowClient} from "./useFlowClient"

export enum ScheduledTransactionPriority {
  Low = 0,
  Medium = 1,
  High = 2,
}

export enum ScheduledTransactionStatus {
  Pending = 0,
  Processing = 1,
  Completed = 2,
  Failed = 3,
  Cancelled = 4,
}

export interface ScheduledTransactionInfo {
  id: string
  priority: ScheduledTransactionPriority
  executionEffort: bigint
  status: ScheduledTransactionStatus
  fees: {
    value: bigint
    formatted: string
  }
  scheduledTimestamp: number
  handlerTypeIdentifier: string
  handlerAddress: string
  handlerUUID?: string
  handlerResolvedViews?: {[viewType: string]: any}
}

export interface UseFlowScheduledTransactionListArgs {
  account?: string
  includeHandlerData?: boolean
  query?: Omit<
    UseQueryOptions<ScheduledTransactionInfo[], Error>,
    "queryKey" | "queryFn"
  >
  flowClient?: ReturnType<typeof useFlowClient>
}

export type UseFlowScheduledTransactionListResult = UseQueryResult<
  ScheduledTransactionInfo[],
  Error
>

const getListScheduledTransactionScript = (chainId: string) => {
  const contractAddresses =
    CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]
  if (!contractAddresses) {
    throw new Error(`Unsupported chain: ${chainId}`)
  }

  return `
import FlowTransactionScheduler from ${contractAddresses.FlowTransactionScheduler}
import FlowTransactionSchedulerUtils from ${contractAddresses.FlowTransactionSchedulerUtils}

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

access(all) fun main(account: Address): [TransactionInfo] {
    let manager = FlowTransactionSchedulerUtils.borrowManager(at: account)
        ?? panic("Could not borrow Manager from account")

    let txIds = manager.getTransactionIDs()
    var transactions: [TransactionInfo] = []

    for id in txIds {
        if let txData = manager.getTransactionData(id) {
            transactions.append(TransactionInfo(data: txData))
        }
    }

    return transactions
}
`
}

const getListScheduledTransactionWithHandlerScript = (chainId: string) => {
  const contractAddresses =
    CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]
  if (!contractAddresses) {
    throw new Error(`Unsupported chain: ${chainId}`)
  }

  return `
import FlowTransactionScheduler from ${contractAddresses.FlowTransactionScheduler}
import FlowTransactionSchedulerUtils from ${contractAddresses.FlowTransactionSchedulerUtils}

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

access(all) fun main(account: Address): [TransactionInfoWithHandler] {
    let manager = FlowTransactionSchedulerUtils.borrowManager(at: account)
        ?? panic("Could not borrow Manager from account")

    let txIds = manager.getTransactionIDs()
    var transactions: [TransactionInfoWithHandler] = []

    for id in txIds {
        if let txData = manager.getTransactionData(id) {
            let handler = txData.borrowHandler()
            let availableViews = manager.getHandlerViewsFromTransactionID(id)
            var resolvedViews: {Type: AnyStruct} = {}

            for viewType in availableViews {
                if let resolvedView = manager.resolveHandlerViewFromTransactionID(id, viewType: viewType) {
                    resolvedViews[viewType] = resolvedView
                }
            }

            transactions.append(TransactionInfoWithHandler(
                data: txData,
                handlerUUID: handler.uuid,
                resolvedViews: resolvedViews
            ))
        }
    }

    return transactions
}
`
}

const convertToScheduledTransactionInfo = (
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
 * Hook for listing all scheduled transactions for an account.
 * Uses TanStack Query for caching and automatic refetching.
 *
 * @param {UseFlowScheduledTransactionListArgs} args - Configuration including account address and options
 * @returns {UseFlowScheduledTransactionListResult} Query result with list of scheduled transactions
 *
 * @example
 * // Basic usage
 * const { data: transactions, isLoading } = useFlowScheduledTransactionList({
 *   account: "0x1234567890abcdef"
 * })
 *
 * @example
 * // With handler data
 * const { data: transactions } = useFlowScheduledTransactionList({
 *   account: "0x1234567890abcdef",
 *   includeHandlerData: true
 * })
 */
export function useFlowScheduledTransactionList({
  account,
  includeHandlerData = false,
  query: queryOptions = {},
  flowClient,
}: UseFlowScheduledTransactionListArgs = {}): UseFlowScheduledTransactionListResult {
  const queryClient = useFlowQueryClient()
  const fcl = useFlowClient({flowClient})
  const chainIdResult = useFlowChainId()
  const chainId = chainIdResult.data

  const fetchScheduledTransactions = useCallback(async (): Promise<
    ScheduledTransactionInfo[]
  > => {
    if (!chainId || !account) return []

    const cadence = includeHandlerData
      ? getListScheduledTransactionWithHandlerScript(chainId)
      : getListScheduledTransactionScript(chainId)

    const result = await fcl.query({
      cadence,
      args: (arg, t) => [arg(account, t.Address)],
    })

    if (!Array.isArray(result)) return []

    return result.map(data =>
      convertToScheduledTransactionInfo(data, includeHandlerData)
    )
  }, [chainId, account, includeHandlerData])

  return useQuery<ScheduledTransactionInfo[], Error>(
    {
      queryKey: ["flowScheduledTransactionList", account, includeHandlerData],
      queryFn: fetchScheduledTransactions,
      enabled: Boolean(chainId && account && (queryOptions?.enabled ?? true)),
      ...queryOptions,
    },
    queryClient
  )
}
