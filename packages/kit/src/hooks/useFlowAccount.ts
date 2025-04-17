import * as fcl from "@onflow/fcl"
import type {Account} from "@onflow/typedefs"
import {useQuery, UseQueryResult, UseQueryOptions} from "@tanstack/react-query"
import {useCallback} from "react"
import {useFlowQueryClient} from "../provider/FlowQueryClient"

/**
 * Options for the useFlowAccount hook.
 *
 * All React Query options available for UseQueryOptions<Account | null, Error>
 * except `queryKey` and `queryFn`, which are managed internally.
 */
export type UseFlowAccountOptions = Omit<
  UseQueryOptions<Account | null, Error>,
  "queryKey" | "queryFn"
>

/**
 * Fetches Flow account data for a given address.
 *
 * @param address – Flow address (with or without `0x`)
 * @param options – Optional React Query settings (e.g. staleTime, select, retry, etc.)
 * @returns UseQueryResult<Account | null, Error>
 */
export function useFlowAccount(
  address?: string,
  options?: UseFlowAccountOptions
): UseQueryResult<Account | null, Error> {
  const queryClient = useFlowQueryClient()

  const fetchAccount = useCallback(async () => {
    if (!address) return null
    return (await fcl.account(address)) as Account
  }, [address])

  return useQuery<Account | null, Error>(
    {
      queryKey: ["flowAccount", address],
      queryFn: fetchAccount,
      enabled: Boolean(address),
      initialData: null,
      ...options,
    },
    queryClient
  )
}
