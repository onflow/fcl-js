import {arg, t} from "@onflow/fcl"
import {UseQueryOptions} from "@tanstack/react-query"
import {useCallback, useMemo} from "react"
import {useFlowQueryClient} from "../provider/FlowQueryClient"
import {useFlowChainId} from "./useFlowChainId"
import {useFlowClient} from "./useFlowClient"
import {useFlowMutate} from "./useFlowMutate"
import {useFlowQuery} from "./useFlowQuery"

export enum Priority {
  High = 0,
  Medium = 1,
  Low = 2,
}

export enum Status {
  Unknown = 0,
  Scheduled = 1,
  Executed = 2,
  Canceled = 3,
}

export interface TransactionData {
  id: string
  priority: Priority
  executionEffort: string
  status: Status
  fees: string
  scheduledTimestamp: string
  handlerTypeIdentifier: string
  handlerAddress: string
  // Optional handler data when includeTransactionHandler is true
  handler?: HandlerData
}

export interface HandlerData {
  typeIdentifier: string
  // Not yet a standard so we need to let the client decide the type
  metadata: {[viewType: string]: any}
  // Optional transactions when includeHandlerTransactions is true
  transactions?: TransactionData[]
}

export interface HandlerCollection {
  [typeIdentifier: string]: HandlerData
}

export interface ScheduleManagerFilter {
  // Include transactions for each handler
  handlerTransactions?: boolean
  // Include handler for each transaction
  transactionHandler?: boolean
}

export interface UseFlowScheduleManagerArgs {
  // Manager address
  address?: string
  // Filter options for including related data
  include?: ScheduleManagerFilter
  // React Query settings
  query?: Omit<UseQueryOptions<unknown, Error>, "queryKey" | "queryFn">
  flowClient?: ReturnType<typeof useFlowClient>
}

export interface UseFlowScheduleManagerData {
  transactions: TransactionData[]
  handlers: HandlerCollection
}

export interface UseFlowScheduleManagerResult {
  data: UseFlowScheduleManagerData | null
  isLoading: boolean
  isFetching: boolean
  error: Error | null
  refetch: () => void

  // Query scripts
  scripts: {
    getManagerTransactions: (
      address: string,
      includeHandler?: boolean
    ) => Promise<TransactionData[]>
    getManagerHandlers: (
      address: string,
      includeTransactions?: boolean
    ) => Promise<HandlerCollection>
    getHandlerTransactions: (
      address: string,
      handlerTypeIdentifier: string
    ) => Promise<TransactionData[]>
    getTransactionHandler: (
      address: string,
      transactionId: string
    ) => Promise<HandlerData | null>
  }

  // Transaction mutations (will trigger refetch of data)
  transactions: {
    cancel: (address: string, transactionId: string) => Promise<string>
    cleanup: (address: string) => Promise<string>
  }
}

// Cadence scripts with placeholders
const getManagerTransactionsInternal = (
  network: "testnet" | "mainnet" | "local",
  includeHandler: boolean
) => `
// TODO
`

const getManagerHandlersInternal = (
  network: "testnet" | "mainnet" | "local",
  includeTransactions: boolean
) => `
// TODO
`

const getHandlerTransactionsInternal = (
  network: "testnet" | "mainnet" | "local"
) => `
// TODO
`

const getTransactionHandlerInternal = (
  network: "testnet" | "mainnet" | "local"
) => `
// TODO
`

const cancelTransaction = (network: "testnet" | "mainnet" | "local") => `
// TODO
`

const cleanupManager = (network: "testnet" | "mainnet" | "local") => `
// TODO
`

/**
 * Fetches and manages scheduled transactions for a Flow account
 *
 * @param args.address - The manager address to fetch data for
 * @param args.include - Filter options for including related data
 * @param args.query - Optional React Query options
 * @param args.flowClient - Optional custom flow client
 *
 * @example
 * // Auto-fetch data for an address
 * const manager = useFlowScheduleManager({
 *   address: "0x123...",
 *   include: { handlerTransactions: true }
 * })
 *
 * // Use without auto-fetching
 * const manager = useFlowScheduleManager()
 */
export function useFlowScheduleManager({
  address,
  include = {},
  query: queryOptions = {},
  flowClient,
}: UseFlowScheduleManagerArgs = {}): UseFlowScheduleManagerResult {
  const chainIdResult = useFlowChainId()
  const fcl = useFlowClient({flowClient})
  const queryClient = useFlowQueryClient()

  const network = chainIdResult.data as
    | "testnet"
    | "mainnet"
    | "local"
    | undefined

  // Internal query functions that can be reused
  const queryAllTransactions = useCallback(
    async (
      targetAddress: string,
      includeHandler: boolean = false
    ): Promise<TransactionData[]> => {
      if (!network) throw new Error("Network not detected")
      if (!targetAddress) throw new Error("Address is required")

      try {
        const result = await fcl.query({
          cadence: getManagerTransactionsInternal(network, includeHandler),
          args: () => [arg(targetAddress, t.Address)],
        })
        return (result as TransactionData[]) || []
      } catch (error) {
        console.error("Failed to fetch transactions:", error)
        throw error
      }
    },
    [network, fcl]
  )

  const queryAllHandlers = useCallback(
    async (
      targetAddress: string,
      includeTransactions: boolean = false
    ): Promise<HandlerCollection> => {
      if (!network) throw new Error("Network not detected")
      if (!targetAddress) throw new Error("Address is required")

      try {
        const result = await fcl.query({
          cadence: getManagerHandlersInternal(network, includeTransactions),
          args: () => [arg(targetAddress, t.Address)],
        })
        return (result as HandlerCollection) || {}
      } catch (error) {
        console.error("Failed to fetch handlers:", error)
        throw error
      }
    },
    [network, fcl]
  )

  // Auto-fetch transactions using the internal query function
  const transactionsResult = useFlowQuery({
    cadence:
      network && address
        ? getManagerTransactionsInternal(
            network,
            include.transactionHandler || false
          )
        : "",
    args: () => (address ? [arg(address, t.Address)] : []),
    query: {
      ...queryOptions,
      enabled: (queryOptions.enabled ?? true) && !!network && !!address,
    },
    flowClient: fcl,
  })

  // Auto-fetch handlers using the internal query function
  const handlersResult = useFlowQuery({
    cadence:
      network && address
        ? getManagerHandlersInternal(
            network,
            include.handlerTransactions || false
          )
        : "",
    args: () => (address ? [arg(address, t.Address)] : []),
    query: {
      ...queryOptions,
      enabled: (queryOptions.enabled ?? true) && !!network && !!address,
    },
    flowClient: fcl,
  })

  // Memoized data
  const data = useMemo<UseFlowScheduleManagerData | null>(() => {
    if (!transactionsResult.data && !handlersResult.data) {
      return null
    }

    return {
      transactions: (transactionsResult.data as TransactionData[]) || [],
      handlers: (handlersResult.data as HandlerCollection) || {},
    }
  }, [transactionsResult.data, handlersResult.data])

  // Refetch function
  const refetch = useCallback(async () => {
    await Promise.all([transactionsResult.refetch(), handlersResult.refetch()])
  }, [transactionsResult, handlersResult])

  // Exposed script methods that reuse the internal query functions
  const getManagerTransactions = useCallback(
    async (
      address: string,
      includeHandler?: boolean
    ): Promise<TransactionData[]> => {
      return queryAllTransactions(address, includeHandler || false)
    },
    [queryAllTransactions]
  )

  const getManagerHandlers = useCallback(
    async (
      address: string,
      includeTransactions?: boolean
    ): Promise<HandlerCollection> => {
      return queryAllHandlers(address, includeTransactions || false)
    },
    [queryAllHandlers]
  )

  const getHandlerTransactions = useCallback(
    async (
      address: string,
      handlerTypeIdentifier: string
    ): Promise<TransactionData[]> => {
      if (!network) throw new Error("Network not detected")
      if (!address) throw new Error("Address is required")
      if (!handlerTypeIdentifier)
        throw new Error("Handler type identifier is required")

      try {
        const result = await fcl.query({
          cadence: getHandlerTransactionsInternal(network),
          args: () => [
            arg(address, t.Address),
            arg(handlerTypeIdentifier, t.String),
          ],
        })
        return (result as TransactionData[]) || []
      } catch (error) {
        console.error("Failed to fetch handler transactions:", error)
        throw error
      }
    },
    [network, fcl]
  )

  const getTransactionHandler = useCallback(
    async (
      address: string,
      transactionId: string
    ): Promise<HandlerData | null> => {
      if (!network) throw new Error("Network not detected")
      if (!address) throw new Error("Address is required")
      if (!transactionId) throw new Error("Transaction ID is required")

      try {
        const result = await fcl.query({
          cadence: getTransactionHandlerInternal(network),
          args: () => [arg(address, t.Address), arg(transactionId, t.UInt64)],
        })
        return result as HandlerData | null
      } catch (error) {
        console.error("Failed to fetch transaction handler:", error)
        throw error
      }
    },
    [network, fcl]
  )

  // Mutations
  const cancelTransactionMutation = useFlowMutate({flowClient: fcl})
  const cleanupMutation = useFlowMutate({flowClient: fcl})

  // Invalidate queries helper
  const invalidateQueries = useCallback(() => {
    if (address && network) {
      queryClient.invalidateQueries({
        queryKey: [
          "flowQuery",
          getManagerTransactionsInternal(
            network,
            include.transactionHandler || false
          ),
        ],
      })
      queryClient.invalidateQueries({
        queryKey: [
          "flowQuery",
          getManagerHandlersInternal(
            network,
            include.handlerTransactions || false
          ),
        ],
      })
    }
  }, [
    address,
    network,
    include.transactionHandler,
    include.handlerTransactions,
    queryClient,
  ])

  const cancel = useCallback(
    async (targetAddress: string, transactionId: string): Promise<string> => {
      if (!network) throw new Error("Network not detected")
      if (!targetAddress) throw new Error("Target address is required")
      if (!transactionId) throw new Error("Transaction ID is required")

      try {
        const result = await cancelTransactionMutation.mutateAsync({
          cadence: cancelTransaction(network),
          args: () => [arg(transactionId, t.UInt64)],
        })

        // Refetch data if the cancel was for the currently watched address
        if (targetAddress === address) {
          await invalidateQueries()
        }

        return result
      } catch (error) {
        console.error("Failed to cancel transaction:", error)
        throw error
      }
    },
    [network, cancelTransactionMutation, address, invalidateQueries]
  )

  const cleanup = useCallback(
    async (targetAddress: string): Promise<string> => {
      if (!network) throw new Error("Network not detected")
      if (!targetAddress) throw new Error("Target address is required")

      try {
        const result = await cleanupMutation.mutateAsync({
          cadence: cleanupManager(network),
          args: () => [],
        })

        // Refetch data if the cleanup was for the currently watched address
        if (targetAddress === address) {
          await invalidateQueries()
        }

        return result
      } catch (error) {
        console.error("Failed to cleanup manager:", error)
        throw error
      }
    },
    [network, cleanupMutation, address, invalidateQueries]
  )

  return {
    data,
    isLoading: transactionsResult.isLoading || handlersResult.isLoading,
    isFetching: transactionsResult.isFetching || handlersResult.isFetching,
    error: transactionsResult.error || handlersResult.error,
    refetch,
    scripts: {
      getManagerTransactions,
      getManagerHandlers,
      getHandlerTransactions,
      getTransactionHandler,
    },
    transactions: {
      cancel,
      cleanup,
    },
  }
}
