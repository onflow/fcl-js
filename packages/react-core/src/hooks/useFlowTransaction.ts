import type {Transaction} from "@onflow/typedefs"
import type {FlowClient} from "../types"
import {useQuery, UseQueryResult, UseQueryOptions} from "@tanstack/react-query"
import {useCallback} from "react"
import {useFlowQueryClient} from "../provider/FlowQueryClient"
import {useFlowClient} from "./useFlowClient"

export interface UseFlowTransactionArgs {
  /** The transaction ID (256-bit hash as hex string) or scheduled transaction ID (UInt64 as decimal string) to fetch */
  txId?: string
  /** React Query settings (staleTime, retry, enabled, select, etc.) */
  query?: Omit<
    UseQueryOptions<Transaction | null, Error>,
    "queryKey" | "queryFn"
  >
  /** Optional flowClient */
  flowClient?: FlowClient
}

/**
 * Fetches a Flow transaction by ID.
 *
 * @param args.txId - The transaction ID (256-bit hash as hex string) or scheduled transaction ID (UInt64 as decimal string)
 * @param args.query - Optional React Query options
 * @returns {UseQueryResult<Transaction | null, Error>} Transaction object or null
 */
export function useFlowTransaction({
  txId,
  query: queryOptions = {},
  flowClient,
}: UseFlowTransactionArgs): UseQueryResult<Transaction | null, Error> {
  const queryClient = useFlowQueryClient()
  const fcl = useFlowClient({flowClient})

  const fetchTransaction = useCallback(async () => {
    if (!txId) return null
    // Note: FlowClient implementations must provide getTransaction method
    // or send/decode methods with getTransaction builder
    if (typeof fcl.getTransaction === "function") {
      return fcl.getTransaction(txId)
    }
    // Fallback: assume send/decode are available (they should be on FlowClient)
    throw new Error("FlowClient must implement getTransaction method")
  }, [txId, fcl])

  return useQuery<Transaction | null, Error>(
    {
      queryKey: ["flowTransaction", txId],
      queryFn: fetchTransaction,
      initialData: null,
      ...queryOptions,
    },
    queryClient
  )
}
