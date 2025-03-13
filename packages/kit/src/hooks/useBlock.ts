import * as fcl from "@onflow/fcl"
import {Block} from "@onflow/typedefs"
import {useQuery, UseQueryResult} from "@tanstack/react-query"
import {useFlowQueryClient} from "../provider/FlowQueryClient"
import {useCallback} from "react"

interface UseBlockParams {
  sealed?: boolean
  id?: string
  height?: number
}

export function useBlock({
  sealed,
  id,
  height,
}: UseBlockParams = {}): UseQueryResult<Block | null, Error> {
  const queryClient = useFlowQueryClient()

  const fetchBlock = useCallback(async () => {
    const block = await fcl.block({sealed, id, height})
    return block as Block
  }, [sealed, id, height])

  return useQuery<Block | null, Error>(
    {
      queryKey: ["flowBlock", {sealed, id, height}],
      queryFn: fetchBlock,
      enabled: true,
      initialData: null,
      retry: false,
    },
    queryClient
  )
}
