import * as fcl from "@onflow/fcl"
import {useQuery, UseQueryOptions, UseQueryResult} from "@tanstack/react-query"
import {useCallback} from "react"
import {useFlowQueryClient} from "../provider/FlowQueryClient"

interface FlowQueryArgs {
  cadence: string
  args?: (arg: typeof fcl.arg, t: typeof fcl.t) => unknown[]
  enabled?: boolean
}

export type UseFlowQueryOptions = Omit<
  UseQueryOptions<unknown, Error>,
  "queryKey" | "queryFn"
>

/**
 * useFlowQuery
 *
 * Executes a Cadence script and returns the query result.
 *
 * @param {FlowQueryArgs} params
 *   - cadence: The Cadence script to run
 *   - args: (optional) A function returning script arguments
 *   - enabled: (optional) whether to run the query
 * @param {UseFlowQueryOptions} options
 *   Optional React Query settings (e.g. `staleTime`, `retry`, `select`, etc.)
 * @returns {UseQueryResult<unknown, Error>}
 */
export function useFlowQuery(
  {cadence, args, enabled = true}: FlowQueryArgs,
  options?: UseFlowQueryOptions
): UseQueryResult<unknown, Error> {
  const queryClient = useFlowQueryClient()

  const fetchQuery = useCallback(async () => {
    if (!cadence) return null
    return fcl.query({cadence, args})
  }, [cadence, args])

  return useQuery<unknown, Error>(
    {
      queryKey: ["flowQuery", cadence, args],
      queryFn: fetchQuery,
      enabled: enabled,
      initialData: null,
      ...options,
    },
    queryClient
  )
}
