import {Block} from "@onflow/typedefs"
import {useQuery, UseQueryResult, UseQueryOptions} from "@tanstack/react-query"
import {useFlowQueryClient} from "../provider/FlowQueryClient"
import {useCallback, useMemo} from "react"
import {useFlowClient} from "./useFlowClient"

interface BlockByLatest {
  sealed?: never
  id?: never
  height?: never
}

interface BlockByLatestSealed {
  sealed?: boolean
  id?: never
  height?: never
}

interface BlockById {
  id: string
  sealed?: never
  height?: never
}

interface BlockByHeight {
  height: number
  sealed?: never
  id?: never
}

type UseBlockParams =
  | BlockByLatest
  | BlockByLatestSealed
  | BlockById
  | BlockByHeight

export interface UseFlowBlockArgs {
  sealed?: boolean
  id?: string
  height?: number
  query?: Omit<UseQueryOptions<Block | null, Error>, "queryKey" | "queryFn">
  flowClient?: ReturnType<typeof useFlowClient>
}

/**
 * Fetches a Flow block according to the given params.
 *
 * @param params
 *   - sealed: boolean (optional) – latest sealed block
 *   - id: string (optional)     – block by ID
 *   - height: number (optional) – block by height
 *   - query: (optional)         – React Query flags (enabled, staleTime, retry, etc.)
 */
export function useFlowBlock(
  params: UseFlowBlockArgs = {}
): UseQueryResult<Block | null, Error> {
  const {sealed, id, height, query: queryOptions = {}, flowClient} = params
  const queryClient = useFlowQueryClient()
  const fcl = useFlowClient({flowClient})

  const domainParams = useMemo<UseBlockParams>(
    () => ({sealed, id, height}) as UseBlockParams,
    [sealed, id, height]
  )

  const fetchBlock = useCallback(async () => {
    return (await fcl.block(domainParams)) as Block
  }, [domainParams])

  return useQuery<Block | null, Error>(
    {
      queryKey: ["flowBlock", domainParams],
      queryFn: fetchBlock,
      initialData: null,
      ...queryOptions,
    },
    queryClient
  )
}
