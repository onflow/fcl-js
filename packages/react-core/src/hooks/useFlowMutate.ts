import {
  useMutation,
  UseMutationResult,
  UseMutationOptions,
} from "@tanstack/react-query"
import {useCallback} from "react"
import {useFlowQueryClient} from "../provider/FlowQueryClient"
import type {FlowClientCore} from "@onflow/fcl-core"
import {useFlowClient} from "./useFlowClient"

/**
 * Arguments for the useFlowMutate hook.
 *
 * - `mutation`: Optional React Query mutation settings
 *   (e.g. `onSuccess`, `onError`, `retry`, `retryDelay`, etc.).
 */
export interface UseFlowMutateArgs {
  mutation?: Omit<UseMutationOptions<string, Error, any>, "mutationFn">
  flowClient?: FlowClientCore
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
  flowClient,
}: UseFlowMutateArgs = {}): UseMutationResult<string, Error, any> {
  const queryClient = useFlowQueryClient()
  const fcl = useFlowClient({flowClient})

  const mutationFn = useCallback(
    async (variables: any) => {
      const txId = await fcl.mutate(variables)
      return txId
    },
    [fcl]
  )

  return useMutation<string, Error, any>(
    {
      mutationFn,
      retry: false,
      ...mutationOptions,
    },
    queryClient
  )
}
