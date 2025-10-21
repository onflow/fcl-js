import {
  UseMutateAsyncFunction,
  UseMutateFunction,
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query"
import {CONTRACT_ADDRESSES} from "../constants"
import {useFlowQueryClient} from "../provider/FlowQueryClient"
import {useFlowChainId} from "./useFlowChainId"
import {useFlowClient} from "./useFlowClient"

export interface UseFlowScheduledTransactionCancelArgs {
  mutation?: Omit<UseMutationOptions<string, Error, string>, "mutationFn">
  flowClient?: ReturnType<typeof useFlowClient>
}

export interface UseFlowScheduledTransactionCancelResult
  extends Omit<UseMutationResult<string, Error>, "mutate" | "mutateAsync"> {
  cancelTransaction: UseMutateFunction<string, Error, string>
  cancelTransactionAsync: UseMutateAsyncFunction<string, Error, string>
}

const cancelScheduledTransactionMutation = (chainId: string) => {
  const contractAddresses =
    CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]
  if (!contractAddresses) {
    throw new Error(`Unsupported chain: ${chainId}`)
  }

  return `
import FlowTransactionSchedulerUtils from ${contractAddresses.FlowTransactionSchedulerUtils}
import FlowToken from ${contractAddresses.FlowToken}
import FungibleToken from ${contractAddresses.FungibleToken}

/// Cancels a scheduled transaction by ID
/// This transaction is used by: flow schedule cancel <transaction-id> [--signer account]
transaction(txId: UInt64) {
    let manager: auth(FlowTransactionSchedulerUtils.Owner) &{FlowTransactionSchedulerUtils.Manager}
    let receiverRef: &{FungibleToken.Receiver}

    prepare(signer: auth(BorrowValue) &Account) {
        // Borrow the Manager with Owner entitlement
        self.manager = signer.storage.borrow<auth(FlowTransactionSchedulerUtils.Owner) &{FlowTransactionSchedulerUtils.Manager}>(
            from: FlowTransactionSchedulerUtils.managerStoragePath
        ) ?? panic("Could not borrow Manager with Owner entitlement from account")

        // Get receiver reference from signer's account
        self.receiverRef = signer.capabilities.borrow<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)
            ?? panic("Could not borrow receiver reference")
    }

    execute {
        // Cancel the transaction and receive refunded fees
        let refundedFees <- self.manager.cancel(id: txId)

        // Deposit refunded fees back to the signer's vault
        self.receiverRef.deposit(from: <-refundedFees)
    }
}
`
}

/**
 * Hook for canceling a scheduled transaction.
 *
 * @param {UseFlowScheduledTransactionCancelArgs} args Optional configuration including mutation options
 * @returns {UseFlowScheduledTransactionCancelResult} Mutation result with cancelTransaction/cancelTransactionAsync functions
 *
 * @example
 * const { cancelTransactionAsync, isPending } = useFlowScheduledTransactionCancel()
 *
 * const handleCancel = async (txId: string) => {
 *   try {
 *     const resultTxId = await cancelTransactionAsync(txId)
 *     console.log("Cancel transaction ID:", resultTxId)
 *   } catch (error) {
 *     console.error("Cancel failed:", error)
 *   }
 * }
 */
export function useFlowScheduledTransactionCancel({
  mutation: mutationOptions = {},
  flowClient,
}: UseFlowScheduledTransactionCancelArgs = {}): UseFlowScheduledTransactionCancelResult {
  const chainIdResult = useFlowChainId()
  const chainId = chainIdResult.data
  const cadenceTx = chainId ? cancelScheduledTransactionMutation(chainId) : null

  const queryClient = useFlowQueryClient()
  const fcl = useFlowClient({flowClient})

  const mutation = useMutation(
    {
      mutationFn: async (txId: string) => {
        if (!cadenceTx) {
          throw new Error("Chain ID not detected")
        }

        const resultTxId = await fcl.mutate({
          cadence: cadenceTx,
          args: (arg, t) => [arg(txId, t.UInt64)],
        })
        return resultTxId
      },
      retry: false,
      ...mutationOptions,
    },
    queryClient
  )

  const {
    mutate: cancelTransaction,
    mutateAsync: cancelTransactionAsync,
    ...rest
  } = mutation

  return {
    cancelTransaction,
    cancelTransactionAsync,
    ...rest,
  }
}
