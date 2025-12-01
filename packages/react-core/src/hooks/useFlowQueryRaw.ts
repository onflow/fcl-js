import {useQuery, UseQueryResult, UseQueryOptions} from "@tanstack/react-query"
import {useCallback} from "react"
import {useFlowQueryClient} from "../provider/FlowQueryClient"
import {encodeQueryArgs} from "./useFlowQuery"
import type {FlowClient} from "../types"
import {useFlowClient} from "./useFlowClient"

export interface UseFlowQueryRawArgs {
  cadence: string
  args?: (arg: any, t: any) => unknown[]
  query?: Omit<UseQueryOptions<unknown, Error>, "queryKey" | "queryFn">
  flowClient?: FlowClient
}

/**
 * useFlowQueryRaw
 *
 * Executes a Cadence script and returns the raw query result.
 *
 * @param params
 *   - cadence: The Cadence script to run
 *   - args: (optional) A function returning script arguments
 *   - query: (optional) React Query settings (staleTime, retry, enabled, select, etc.)
 * @returns {UseQueryResult<unknown, Error>}
 */
export function useFlowQueryRaw({
  cadence,
  args,
  query: queryOptions = {},
  flowClient,
}: UseFlowQueryRawArgs): UseQueryResult<unknown, Error> {
  const queryClient = useFlowQueryClient()
  const fcl = useFlowClient({flowClient})

  const fetchQueryRaw = useCallback(async () => {
    if (!cadence) return null
    return fcl.queryRaw({cadence, args})
  }, [cadence, args])

  const encodedArgs = encodeQueryArgs(args)
  return useQuery<unknown, Error>(
    {
      queryKey: ["flowQueryRaw", cadence, encodedArgs],
      queryFn: fetchQueryRaw,
      enabled: queryOptions.enabled ?? true,
      ...queryOptions,
    },
    queryClient
  )
}
