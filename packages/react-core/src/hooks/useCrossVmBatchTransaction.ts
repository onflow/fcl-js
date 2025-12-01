import {Abi, encodeFunctionData} from "viem"
import {
  UseMutateAsyncFunction,
  UseMutateFunction,
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query"
import {useFlowChainId} from "./useFlowChainId"
import {useFlowQueryClient} from "../provider/FlowQueryClient"
import {CONTRACT_ADDRESSES, DEFAULT_EVM_GAS_LIMIT} from "../constants"
import type {FlowClient} from "../types"
import {useFlowClient} from "./useFlowClient"

// Helper function to remove "0x" prefix
function sansPrefix(address: string): string {
  return address.replace(/^0x/, "")
}

interface UseCrossVmBatchTransactionMutateArgs {
  calls: EvmBatchCall[]
  mustPass?: boolean
}

export interface UseCrossVmBatchTransactionArgs {
  mutation?: Omit<
    UseMutationOptions<string, Error, UseCrossVmBatchTransactionMutateArgs>,
    "mutationFn"
  >
  flowClient?: FlowClient
}

export interface UseCrossVmBatchTransactionResult
  extends Omit<
    UseMutationResult<string, Error, UseCrossVmBatchTransactionMutateArgs>,
    "mutate" | "mutateAsync"
  > {
  sendBatchTransaction: UseMutateFunction<
    string,
    Error,
    UseCrossVmBatchTransactionMutateArgs
  >
  sendBatchTransactionAsync: UseMutateAsyncFunction<
    string,
    Error,
    UseCrossVmBatchTransactionMutateArgs
  >
}

export interface EvmBatchCall {
  // The target EVM contract address (as a string)
  address: string
  // The contract ABI fragment
  abi: Abi
  // The name of the function to call
  functionName: string
  // The function arguments
  args?: readonly unknown[]
  // The gas limit for the call
  gasLimit?: bigint
  // The value to send with the call
  value?: bigint
}

export function encodeCalls(
  calls: EvmBatchCall[]
): Array<{to: string; data: string; gasLimit: string; value: string}> {
  return calls.map(call => {
    const encodedData = encodeFunctionData({
      abi: call.abi,
      functionName: call.functionName,
      args: call.args,
    })

    return {
      to: call.address,
      data: sansPrefix(encodedData) ?? "",
      gasLimit: call.gasLimit?.toString() ?? DEFAULT_EVM_GAS_LIMIT,
      value: call.value?.toString() ?? "0",
    }
  })
}

// Takes a chain id and returns the cadence tx with addresses set
export const getCadenceBatchTransaction = (chainId: string) => {
  const contractAddresses =
    CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]
  if (!contractAddresses) {
    throw new Error(`Unsupported chain: ${chainId}`)
  }

  return `
import EVM from ${contractAddresses.EVM}

transaction(calls: [{String: AnyStruct}], mustPass: Bool) {

    let coa: auth(EVM.Call) &EVM.CadenceOwnedAccount

    prepare(signer: auth(BorrowValue) & Account) {
        let storagePath = /storage/evm
        self.coa = signer.storage.borrow<auth(EVM.Call) &EVM.CadenceOwnedAccount>(from: storagePath)
            ?? panic("No CadenceOwnedAccount (COA) found at ".concat(storagePath.toString()))
    }

    execute {
        for i, call in calls {
            let to = call["to"] as! String
            let data = call["data"] as! String
            let gasLimit = call["gasLimit"] as! UInt64
            let value = call["value"] as! UInt

            let result = self.coa.call(
                to: EVM.addressFromString(to),
                data: data.decodeHex(),
                gasLimit: gasLimit,
                value: EVM.Balance(attoflow: value)
            )
            
            if mustPass {
                assert(
                  result.status == EVM.Status.successful,
                  message: "Call index ".concat(i.toString()).concat(" to ").concat(to)
                    .concat(" with calldata ").concat(data).concat(" failed: ")
                    .concat(result.errorMessage)
                )
            }
        }
    }
}
`
}

/**
 * Hook to send an EVM batch transaction using a Cadence-compatible wallet.  This function will
 * bundle multiple EVM calls into one atomic Cadence transaction and return both the Cadence
 * transaction ID as well as the result of each EVM call.
 *
 * @returns The query mutation object used to send the transaction and get the result.
 */
export function useCrossVmBatchTransaction({
  mutation: mutationOptions = {},
  flowClient,
}: UseCrossVmBatchTransactionArgs = {}): UseCrossVmBatchTransactionResult {
  const chainId = useFlowChainId()
  const cadenceTx = chainId.data
    ? getCadenceBatchTransaction(chainId.data)
    : null

  const queryClient = useFlowQueryClient()
  const fcl = useFlowClient({flowClient})
  const mutation = useMutation(
    {
      mutationFn: async ({
        calls,
        mustPass = true,
      }: {
        calls: EvmBatchCall[]
        mustPass?: boolean
      }) => {
        if (!cadenceTx) {
          throw new Error("No current chain found")
        }
        const encodedCalls = encodeCalls(calls)

        const txId = await fcl.mutate({
          cadence: cadenceTx,
          args: (arg: any, t: any) => [
            arg(
              encodedCalls.map(call => [
                {key: "to", value: call.to},
                {key: "data", value: call.data},
                {
                  key: "gasLimit",
                  value: call.gasLimit,
                },
                {key: "value", value: call.value},
              ]),
              t.Array(
                t.Dictionary([
                  {key: t.String, value: t.String},
                  {key: t.String, value: t.String},
                  {key: t.String, value: t.UInt64},
                  {key: t.String, value: t.UInt},
                ] as any)
              )
            ),
            arg(mustPass, t.Bool),
          ],
          limit: 9999,
        })

        return txId
      },
      retry: false,
      ...mutationOptions,
    },
    queryClient
  )

  const {
    mutate: sendBatchTransaction,
    mutateAsync: sendBatchTransactionAsync,
    ...rest
  } = mutation

  return {
    sendBatchTransaction,
    sendBatchTransactionAsync,
    ...rest,
  }
}
