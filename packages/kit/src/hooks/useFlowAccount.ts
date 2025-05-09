import * as fcl from "@onflow/fcl"
import type {Account} from "@onflow/typedefs"
import {useQuery, UseQueryResult, UseQueryOptions} from "@tanstack/react-query"
import {useCallback} from "react"
import {useFlowQueryClient} from "../provider/FlowQueryClient"

export interface UseFlowAccountArgs {
  /** Flow address (with or without `0x`) */
  address?: string
  /** React Query settings (staleTime, retry, enabled, select, etc.) */
  query?: Omit<UseQueryOptions<Account | null, Error>, "queryKey" | "queryFn">
}

/**
 * Fetches Flow account data for a given address.
 *
 * @param args.address – Flow address
 * @param args.query – Optional React Query options
 */
export function useFlowAccount({
  address,
  query: queryOptions = {},
}: UseFlowAccountArgs): UseQueryResult<Account | null, Error> {
  const queryClient = useFlowQueryClient()

  const fetchAccount = useCallback(async () => {
    if (!address) return null
    return (await fcl.account(address)) as Account
  }, [address])

  return useQuery<Account | null, Error>(
    {
      queryKey: ["flowAccount", address],
      queryFn: fetchAccount,
      initialData: null,
      ...queryOptions,
    },
    queryClient
  )
}
