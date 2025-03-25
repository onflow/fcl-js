import * as fcl from "@onflow/fcl"
import {useMutation, UseMutationResult} from "@tanstack/react-query"
import {useCallback} from "react"
import {useFlowQueryClient} from "../provider/FlowQueryClient"

export function useFlowMutate(): UseMutationResult<
  string,
  Error,
  Parameters<typeof fcl.mutate>[0]
> {
  const queryClient = useFlowQueryClient()

  const mutationFn = useCallback(
    async (variables: Parameters<typeof fcl.mutate>[0]) => {
      const txId = await fcl.mutate(variables)
      return txId
    },
    []
  )

  return useMutation<string, Error, Parameters<typeof fcl.mutate>[0]>(
    {
      mutationFn,
      retry: false,
    },
    queryClient
  )
}
