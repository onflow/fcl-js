import type {FlowClientCore} from "@onflow/fcl-core"
import {useQuery, UseQueryOptions, UseQueryResult} from "@tanstack/react-query"
import {useFlowQueryClient} from "../provider/FlowQueryClient"
import {useCallback} from "react"
import {useFlowClient} from "./useFlowClient"
import {useFlowConfig} from "./useFlowConfig"

interface UseFlowChainIdArgs {
  query?: Omit<UseQueryOptions<string | null, Error>, "queryKey" | "queryFn">
  flowClient?: FlowClientCore
}

/**
 * Gets the Flow chain ID.
 */
export function useFlowChainId({
  query: queryOptions = {},
  flowClient,
}: UseFlowChainIdArgs = {}): UseQueryResult<string | null, Error> {
  const queryClient = useFlowQueryClient()
  const fcl = useFlowClient({flowClient})
  const config = useFlowConfig()

  const fetchChainId = useCallback(async () => {
    return await fcl.getChainId()
  }, [fcl, config])

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
