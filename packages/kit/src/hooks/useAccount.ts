import * as fcl from "@onflow/fcl"
import {Account} from "@onflow/typedefs"
import {useCallback, useEffect, useState} from "react"

interface UseAccountReturn {
  account: Account | null
  loading: boolean
  error: Error | null
  refetch: () => void
}

/**
 * useAccount hook
 *
 * Fetches the account data from a given address.
 *
 * @param address - The Flow address to fetch the account for (with or without `0x`).
 * @returns An object containing:
 *  - account: the fetched account (or `null` if not loaded)
 *  - loading: whether the fetch is in progress
 *  - error: any error that occurred
 *  - refetch: a function to re-fetch the account data
 */
export function useAccount(address?: string): UseAccountReturn {
  const [account, setAccount] = useState<Account | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchAccount = useCallback(async () => {
    if (!address) return
    setLoading(true)
    setError(null)
    try {
      const acctData = await fcl.account(address)
      setAccount(acctData as Account)
    } catch (err) {
      setError(err as Error)
      setAccount(null)
    } finally {
      setLoading(false)
    }
  }, [address])

  useEffect(() => {
    fetchAccount()
  }, [fetchAccount])

  return {
    account,
    loading,
    error,
    refetch: fetchAccount,
  }
}
