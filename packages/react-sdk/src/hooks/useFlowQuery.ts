import {useQuery, UseQueryResult, UseQueryOptions} from "@tanstack/react-query"
import {useCallback} from "react"
import {useFlowQueryClient} from "../provider/FlowQueryClient"
import {arg, t} from "@onflow/fcl"
import {useFlowClient} from "./useFlowClient"

export function encodeQueryArgs(
  args?: (_arg: typeof arg, _t: typeof t) => unknown[]
): any[] | undefined {
  // Encode the arguments to a JSON-CDC object so they can be deterministically
  // serialized and used as the query key.
  return args?.(arg, t)?.map((x: any) => x.xform.asArgument(x.value))
}

export interface UseFlowQueryArgs {
  cadence: string
  args?: (_arg: typeof arg, _t: typeof t) => unknown[]
  query?: Omit<UseQueryOptions<unknown, Error>, "queryKey" | "queryFn">
  flowClient?: ReturnType<typeof useFlowClient>
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
  flowClient,
}: UseFlowQueryArgs): UseQueryResult<unknown, Error> {
  const queryClient = useFlowQueryClient()
  const fcl = useFlowClient({flowClient})

  const fetchQuery = useCallback(async () => {
    if (!cadence) return null
    return fcl.query({cadence, args})
  }, [cadence, args])

  const encodedArgs = encodeQueryArgs(args)
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
