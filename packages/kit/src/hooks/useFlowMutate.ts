import * as fcl from "@onflow/fcl"
import {useMutation, UseMutationResult} from "@tanstack/react-query"
import {useCallback} from "react"
import {useFlowQueryClient} from "../provider/FlowQueryClient"

export interface FlowMutateVariables {
  /**
   * Required Cadence transaction string.
   */
  cadence: string

  /**
   * (Optional) Function returning transaction arguments.
   */
  args?: (arg: typeof fcl.arg, t: typeof fcl.t) => unknown[]

  /**
   * (Optional) Authorization function for the payer.
   */
  payer?: () => Promise<unknown>

  /**
   * (Optional) Authorization function for the proposer.
   */
  proposer?: () => Promise<unknown>

  /**
   * (Optional) Array of authorization functions for additional signers.
   */
  authorizations?: (() => Promise<unknown>)[]

  /**
   * (Optional) The compute limit for the transaction (defaults to 9999).
   */
  limit?: number
}

/**
 * useFlowMutate
 *
 * Returns a React Query mutation that, when called, runs `fcl.mutate` using
 * the parameters provided to `mutate(variables)`.
 *
 * @returns {UseMutationResult<string, Error, FlowMutateVariables>} The mutation result.
 *   - `data` is the transaction ID (string) on success.
 *   - `mutate(variables)` is how you invoke the transaction.
 */
export function useFlowMutate(): UseMutationResult<
  string,
  Error,
  FlowMutateVariables
> {
  const queryClient = useFlowQueryClient()

  const mutationFn = useCallback(async (variables: FlowMutateVariables) => {
    const {
      cadence,
      args,
      payer,
      proposer,
      authorizations,
      limit = 9999,
    } = variables

    if (!cadence) {
      throw new Error("Cadence transaction code is required.")
    }

    const txId = await fcl.mutate({
      cadence,
      args,
      payer,
      proposer,
      authorizations,
      limit,
    })

    return txId
  }, [])

  return useMutation<string, Error, FlowMutateVariables>(
    {
      mutationFn,
      retry: false,
    },
    queryClient
  )
}
