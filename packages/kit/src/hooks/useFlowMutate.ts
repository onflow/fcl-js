import * as fcl from "@onflow/fcl"
import {useMutation, UseMutationResult} from "@tanstack/react-query"
import {useCallback} from "react"
import {useFlowQueryClient} from "../provider/FlowQueryClient"

interface FlowMutateArgs {
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
   * By default, FCL will use fcl.authz if not provided.
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
 * Executes a Cadence transaction using fcl.mutate.
 *
 * @param {FlowMutateArgs} options - An object containing:
 *   - cadence: The Cadence transaction to run
 *   - args: (optional) A function returning transaction arguments
 *   - payer, proposer, authorizations: (optional) Custom authz functions
 *   - limit: (optional) Compute limit for the transaction
 * @returns {UseMutationResult<string, Error>} React Query mutation result,
 *   where `data` is the transaction ID on success.
 */
export function useFlowMutate({
  cadence,
  args,
  payer,
  proposer,
  authorizations,
  limit = 9999,
}: FlowMutateArgs): UseMutationResult<string, Error> {
  const queryClient = useFlowQueryClient()

  const mutationFn = useCallback(async () => {
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
  }, [cadence, args, payer, proposer, authorizations, limit])

  return useMutation({
    mutationFn,
    retry: false,
  })
}
