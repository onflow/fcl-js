import {useQuery, UseQueryResult, UseQueryOptions} from "@tanstack/react-query"
import {useCallback} from "react"
import {useFlowQueryClient} from "../provider/FlowQueryClient"
import type {FlowClient} from "../types"
import {useFlowClient} from "./useFlowClient"

export function encodeQueryArgs(
  args?: (arg: any, t: any) => unknown[]
): any[] | undefined {
  // Note: arg and t are passed through from the FlowClient's query method
  // This function is used only for creating deterministic query keys
  if (!args) return undefined
  // We can't encode args without the actual arg/t functions
  // so we'll use the function string representation as a fallback
  return [args.toString()]
}

export interface UseFlowQueryArgs {
  cadence: string
  args?: (arg: any, t: any) => unknown[]
  query?: Omit<UseQueryOptions<unknown, Error>, "queryKey" | "queryFn">
  flowClient?: FlowClient
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
