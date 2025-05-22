import * as fcl from "@onflow/fcl"
import {useQuery, UseQueryResult, UseQueryOptions} from "@tanstack/react-query"
import {useCallback} from "react"
import {useFlowQueryClient} from "../provider/FlowQueryClient"

export interface UseFlowQueryArgs {
  cadence: string
  args?: (arg: typeof fcl.arg, t: typeof fcl.t) => unknown[]
  query?: Omit<UseQueryOptions<unknown, Error>, "queryKey" | "queryFn">
}

/**
 * useFlowQuery
 *
 * Executes a Cadence script and returns the query result.
 *
 * @param params
 *   - cadence: The Cadence script to run
 *   - args: (optional) A function returning script arguments
 *   - query: (optional) React Query settings (staleTime, retry, enabled, select, etc.)
 * @returns {UseQueryResult<unknown, Error>}
 */
export function useFlowQuery({
  cadence,
  args,
  query: queryOptions = {},
}: UseFlowQueryArgs): UseQueryResult<unknown, Error> {
  const queryClient = useFlowQueryClient()

  const fetchQuery = useCallback(async () => {
    if (!cadence) return null
    return fcl.query({cadence, args})
  }, [cadence, args])

  // Encode the arguments to a JSON-CDC object so they can be deterministically
  // serialized and used as the query key.
  const encodedArgs = args?.(fcl.arg, fcl.t)?.map((x: any) =>
    x.xform.asArgument(x.value)
  )

  return useQuery<unknown, Error>(
    {
      queryKey: ["flowQuery", cadence, encodedArgs],
      queryFn: fetchQuery,
      enabled: queryOptions.enabled ?? true,
      ...queryOptions,
    },
    queryClient
  )
}
