import * as fcl from "@onflow/fcl"
import { useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query"
import { useFlowQueryClient } from "../provider/FlowQueryClient"
import { useCallback } from "react"
import { useFlowConfig } from "./useFlowConfig"

interface UseFlowChainIdArgs {
  query?: Omit<UseQueryOptions<string | null, Error>, "queryKey" | "queryFn">
}

/**
 * Gets the Flow chain ID.
 */
export function useFlowChainId({
  query: queryOptions = {},
}: UseFlowChainIdArgs = {}): UseQueryResult<string | null, Error> {
  const queryClient = useFlowQueryClient()
  const config = useFlowConfig()

  const fetchChainId = useCallback(async () => {
    return await fcl.getChainId()
  }, [config])

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
