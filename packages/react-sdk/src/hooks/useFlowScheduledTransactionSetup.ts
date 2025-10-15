import {
  UseMutateAsyncFunction,
  UseMutateFunction,
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query"
import {CONTRACT_ADDRESSES} from "../constants"
import {useFlowClient} from "./useFlowClient"
import {useFlowChainId} from "./useFlowChainId"
import {useFlowQueryClient} from "../provider/FlowQueryClient"

export interface UseFlowScheduledTransactionSetupArgs {
  mutation?: Omit<UseMutationOptions<string, Error, void>, "mutationFn">
  flowClient?: ReturnType<typeof useFlowClient>
}

export interface UseFlowScheduledTransactionSetupResult
  extends Omit<UseMutationResult<string, Error>, "mutate" | "mutateAsync"> {
  setup: UseMutateFunction<string, Error, void>
  setupAsync: UseMutateAsyncFunction<string, Error, void>
}

const setupSchedulerMutation = (chainId: string) => {
  const contractAddresses =
    CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]
  if (!contractAddresses) {
    throw new Error(`Unsupported chain: ${chainId}`)
  }

  return `
import FlowTransactionSchedulerUtils from ${contractAddresses.FlowTransactionSchedulerUtils}

/// Sets up a Manager resource in the signer's account if not already done
/// This transaction is used by: flow schedule setup [--signer account]
transaction() {
    prepare(signer: auth(BorrowValue, IssueStorageCapabilityController, SaveValue, PublishCapability) &Account) {
        // Save a manager resource to storage if not already present
        if signer.storage.borrow<&AnyResource>(from: FlowTransactionSchedulerUtils.managerStoragePath) == nil {
            let manager <- FlowTransactionSchedulerUtils.createManager()
            signer.storage.save(<-manager, to: FlowTransactionSchedulerUtils.managerStoragePath)
        }

        // Create a capability for the Manager
        let managerCap = signer.capabilities.storage.issue<&{FlowTransactionSchedulerUtils.Manager}>(FlowTransactionSchedulerUtils.managerStoragePath)
        signer.capabilities.publish(managerCap, at: FlowTransactionSchedulerUtils.managerPublicPath)
    }
}
`
}

/**
 * Hook for setting up a Flow Transaction Scheduler Manager resource.
 *
 * @param {UseFlowScheduledTransactionSetupArgs} args Optional configuration including mutation options
 * @returns {UseFlowScheduledTransactionSetupResult} Mutation result with setup/setupAsync functions
 *
 * @example
 * const { setupAsync, isPending } = useFlowScheduledTransactionSetup()
 *
 * const handleSetup = async () => {
 *   try {
 *     const txId = await setupAsync()
 *     console.log("Setup transaction ID:", txId)
 *   } catch (error) {
 *     console.error("Setup failed:", error)
 *   }
 * }
 *
 * @example
 * // With mutation options
 * const { setup } = useFlowScheduledTransactionSetup({
 *   mutation: {
 *     onSuccess: (txId) => console.log("Setup successful:", txId),
 *     onError: (error) => console.error("Setup failed:", error)
 *   }
 * })
 */
export function useFlowScheduledTransactionSetup({
  mutation: mutationOptions = {},
  flowClient,
}: UseFlowScheduledTransactionSetupArgs = {}): UseFlowScheduledTransactionSetupResult {
  const chainIdResult = useFlowChainId()
  const chainId = chainIdResult.data
  const cadenceTx = chainId ? setupSchedulerMutation(chainId) : null

  const queryClient = useFlowQueryClient()
  const fcl = useFlowClient({flowClient})

  const mutation = useMutation(
    {
      mutationFn: async () => {
        if (!cadenceTx) {
          throw new Error("Chain ID not detected")
        }

        const txId = await fcl.mutate({
          cadence: cadenceTx,
          args: () => [],
        })

        return txId
      },
      retry: false,
      ...mutationOptions,
    },
    queryClient
  )

  const {mutate: setup, mutateAsync: setupAsync, ...rest} = mutation

  return {
    setup,
    setupAsync,
    ...rest,
  }
}
