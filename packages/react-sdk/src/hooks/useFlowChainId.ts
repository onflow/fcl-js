import {useQuery, UseQueryOptions, UseQueryResult} from "@tanstack/react-query"
import {useFlowQueryClient} from "../provider/FlowQueryClient"
import {useCallback} from "react"
import {useClient} from "./useClient"

interface UseFlowChainIdArgs {
  query?: Omit<UseQueryOptions<string | null, Error>, "queryKey" | "queryFn">
  client?: ReturnType<typeof useClient>
}

/**
 * Gets the Flow chain ID.
 */
export function useFlowChainId({
  query: queryOptions = {},
  client,
}: UseFlowChainIdArgs = {}): UseQueryResult<string | null, Error> {
  const queryClient = useFlowQueryClient()
  const fcl = useClient({client})

  const fetchChainId = useCallback(async () => {
    return await fcl.getChainId()
  }, [fcl])

  return useQuery<string | null, Error>(
    {
      queryKey: ["flowChainId"],
      queryFn: fetchChainId,
      initialData: null,
      ...queryOptions,
    },
    queryClient
  )
}
