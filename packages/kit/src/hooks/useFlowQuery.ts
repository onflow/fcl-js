import * as fcl from "@onflow/fcl"
import {useQuery, UseQueryResult} from "@tanstack/react-query"
import {useCallback} from "react"
import {useFlowQueryClient} from "../provider/FlowQueryClient"

interface FlowQueryArgs {
  cadence: string
  args?: (arg: typeof fcl.arg, t: typeof fcl.t) => unknown[]
}

/**
 * useFlowQuery
 *
 * Executes a Cadence script and returns the query result.
 *
 * @param {FlowQueryArgs} options - An object containing:
 *   - cadence: The Cadence script to run
 *   - args: (optional) A function returning script arguments
 * @returns {UseQueryResult<unknown, Error>} React Query result (data, isLoading, error, etc.)
 */
export function useFlowQuery({
  cadence,
  args,
}: FlowQueryArgs): UseQueryResult<unknown, Error> {
  const queryClient = useFlowQueryClient()

  const fetchQuery = useCallback(async () => {
    if (!cadence) return null
    return fcl.query({cadence, args})
  }, [cadence, args])

  return useQuery<unknown, Error>(
    {
      queryKey: ["flowQuery", cadence, args],
      queryFn: fetchQuery,
      enabled: Boolean(cadence),
      retry: false,
      initialData: null,
    },
    queryClient
  )
}
