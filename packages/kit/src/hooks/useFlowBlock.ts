import * as fcl from "@onflow/fcl"
import {Block} from "@onflow/typedefs"
import {useQuery, UseQueryOptions, UseQueryResult} from "@tanstack/react-query"
import {useFlowQueryClient} from "../provider/FlowQueryClient"
import {useCallback} from "react"

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

export type UseFlowBlockOptions = Omit<
  UseQueryOptions<Block | null, Error>,
  "queryKey" | "queryFn"
>

/**
 * Fetches a Flow block according to the given params.
 *
 * @param params – one of:
 *   • {}                   – latest block
 *   • { sealed: true }     – latest sealed block
 *   • { id: string }       – block by ID
 *   • { height: number }   – block by height
 * @param options – optional React Query settings (staleTime, retry, select, etc.)
 */
export function useFlowBlock(
  params: UseBlockParams = {},
  options?: UseFlowBlockOptions
): UseQueryResult<Block | null, Error> {
  const queryClient = useFlowQueryClient()

  const fetchBlock = useCallback(async () => {
    const block = await fcl.block(params)
    return block as Block
  }, [params])

  return useQuery<Block | null, Error>(
    {
      queryKey: ["flowBlock", params],
      queryFn: fetchBlock,
      enabled: true,
      initialData: null,
      ...options,
    },
    queryClient
  )
}
