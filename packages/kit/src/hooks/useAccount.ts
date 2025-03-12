import * as fcl from "@onflow/fcl"
import {Account} from "@onflow/typedefs"
import {useQuery, UseQueryResult} from "@tanstack/react-query"
import {useCallback} from "react"

/**
 * useAccount hook
 *
 * Fetches the account data from a given address.
 *
 * @param address - The Flow address to fetch the account for (with or without `0x`).
 * @returns {UseQueryResult<Account | null, Error>} The entire useQuery result
 *  (data, isLoading, error, refetch, etc.)
 */
export function useAccount(
  address?: string
): UseQueryResult<Account | null, Error> {
  const fetchAccount = useCallback(async () => {
    if (!address) return null
    const acctData = await fcl.account(address)
    return acctData as Account
  }, [address])

  return useQuery<Account | null, Error>({
    queryKey: ["flowAccount", address],
    queryFn: fetchAccount,
    enabled: Boolean(address),
    initialData: null,
  })
}
