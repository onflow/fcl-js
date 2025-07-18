import {
  useMutation,
  UseMutationResult,
  UseMutationOptions,
} from "@tanstack/react-query"
import {useCallback} from "react"
import {useFlowQueryClient} from "../provider/FlowQueryClient"
import {mutate} from "@onflow/fcl"
import {useClient} from "./useClient"

/**
 * Arguments for the useFlowMutate hook.
 *
 * - `mutation`: Optional React Query mutation settings
 *   (e.g. `onSuccess`, `onError`, `retry`, `retryDelay`, etc.).
 */
export interface UseFlowMutateArgs {
  mutation?: Omit<
    UseMutationOptions<string, Error, Parameters<typeof mutate>[0]>,
    "mutationFn"
  >
  client?: ReturnType<typeof useClient>
}

/**
 * useFlowMutate
 *
 * Sends a Flow transaction via FCL and returns a React Query mutation.
 *
 * @param args.mutation – Optional React Query mutation options
 */
export function useFlowMutate({
  mutation: mutationOptions = {},
  client,
}: UseFlowMutateArgs = {}): UseMutationResult<
  string,
  Error,
  Parameters<typeof mutate>[0]
> {
  const queryClient = useFlowQueryClient()
  const fcl = useClient({client})

  const mutationFn = useCallback(
    async (variables: Parameters<typeof mutate>[0]) => {
      const txId = await fcl.mutate(variables)
      return txId
    },
    []
  )

  return useMutation<string, Error, Parameters<typeof mutate>[0]>(
    {
      mutationFn,
      retry: false,
      ...mutationOptions,
    },
    queryClient
  )
}
