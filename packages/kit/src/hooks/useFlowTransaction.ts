import * as fcl from "@onflow/fcl"
import type {Transaction} from "@onflow/typedefs"
import {useQuery, UseQueryResult, UseQueryOptions} from "@tanstack/react-query"
import {useCallback} from "react"
import {useFlowQueryClient} from "../provider/FlowQueryClient"

export interface UseFlowTransactionArgs {
  /** Flow transaction ID to fetch */
  txId?: string
  /** React Query settings (staleTime, retry, enabled, select, etc.) */
  query?: Omit<
    UseQueryOptions<Transaction | null, Error>,
    "queryKey" | "queryFn"
  >
}

/**
 * Fetches a Flow transaction by ID.
 *
 * @param args.txId - Flow transaction ID
 * @param args.query - Optional React Query options
 * @returns {UseQueryResult<Transaction | null, Error>} Transaction object or null
 */
export function useFlowTransaction({
  txId,
  query: queryOptions = {},
}: UseFlowTransactionArgs): UseQueryResult<Transaction | null, Error> {
  const queryClient = useFlowQueryClient()

  const fetchTransaction = useCallback(async () => {
    if (!txId) return null

    return fcl
      .send([fcl.getTransaction(txId)])
      .then(fcl.decode) as Promise<Transaction>
  }, [txId])

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
