import * as fcl from "@onflow/fcl"
import {Abi, bytesToHex, encodeFunctionData} from "viem"
import {
  UseMutateFunction,
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query"
import {useFlowChainId} from "./useFlowChainId"
import {useFlowQueryClient} from "../provider/FlowQueryClient"

interface UseEvmBatchTransactionArgs {
  mutation?: Omit<
    UseMutationOptions<
      {
        txId: string
        results: CallOutcome[]
      },
      Error,
      {
        calls: EvmBatchCall[]
        mustPass?: boolean
      }
    >,
    "mutationFn"
  >
}

interface UseEvmBatchTransactionResult
  extends Omit<
    UseMutationResult<
      {
        txId: string
        results: CallOutcome[]
      },
      Error
    >,
    "mutate" | "mutateAsync"
  > {
  sendBatchTransaction: UseMutateFunction<
    {
      txId: string
      results: CallOutcome[]
    },
    Error,
    {
      calls: EvmBatchCall[]
      mustPass?: boolean
    }
  >
  sendBatchTransactionAsync: (args: {
    calls: EvmBatchCall[]
    mustPass?: boolean
  }) => Promise<{
    txId: string
    results: CallOutcome[]
  }>
}

interface EvmBatchCall {
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
interface CallOutcome {
  status: "passed" | "failed" | "skipped"
  hash?: string
  errorMessage?: string
}

type EvmTransactionExecutedData = {
  hash: string[]
  index: string
  type: string
  payload: string[]
  errorCode: string
  errorMessage: string
  gasConsumed: string
  contractAddress: string
  logs: string[]
  blockHeight: string
  returnedData: string[]
  precompiledCalls: string[]
  stateUpdateChecksum: string
}

// Helper to encode our ca lls using viem.
// Returns an array of objects with keys "address" and "data" (hex-encoded string without the "0x" prefix).
export function encodeCalls(
  calls: EvmBatchCall[]
): Array<Array<{key: string; value: string}>> {
  return calls.map(call => {
    const encodedData = encodeFunctionData({
      abi: call.abi,
      functionName: call.functionName,
      args: call.args,
    })

    return [
      {key: "to", value: call.address},
      {key: "data", value: fcl.sansPrefix(encodedData) ?? ""},
      {key: "gasLimit", value: call.gasLimit?.toString() ?? "15000000"},
      {key: "value", value: call.value?.toString() ?? "0"},
    ]
  }) as any
}

const EVM_CONTRACT_ADDRESSES = {
  local: "0xf8d6e0586b0a20c0",
  testnet: "0x8c5303eaa26202d6",
  mainnet: "0xe467b9dd11fa00df",
}

// Takes a chain id and returns the cadence tx with addresses set
export const getCadenceBatchTransaction = (chainId: string) => {
  const evmAddress =
    EVM_CONTRACT_ADDRESSES[chainId as keyof typeof EVM_CONTRACT_ADDRESSES]
  if (!evmAddress) {
    throw new Error(`Unsupported chain: ${chainId}`)
  }

  return `
import EVM from ${evmAddress}

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
export function useEvmBatchTransaction({
  mutation: mutationOptions = {},
}: UseEvmBatchTransactionArgs = {}): UseEvmBatchTransactionResult {
  const chainId = useFlowChainId()
  const cadenceTx = chainId.data
    ? getCadenceBatchTransaction(chainId.data)
    : null

  const queryClient = useFlowQueryClient()
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
          args: (arg, t) => [
            arg(
              encodedCalls,
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

        let txResult
        try {
          txResult = await fcl.tx(txId).onceExecuted()
        } catch (txError) {
          // If we land here, the transaction likely reverted.
          // We can return partial or "failed" outcomes for all calls.
          return {
            txId,
            results: calls.map(() => ({
              status: "failed" as const,
              hash: undefined,
              errorMessage: "Transaction reverted",
            })),
          }
        }

        // Filter for TransactionExecuted events
        const executedEvents = txResult.events.filter((e: any) =>
          e.type.includes("TransactionExecuted")
        )

        // Build a full outcomes array for every call.
        // For any call index where no event exists, mark it as "skipped".
        const results: CallOutcome[] = calls.map((_, index) => {
          const eventData = executedEvents[index]
            ?.data as EvmTransactionExecutedData
          if (eventData) {
            return {
              hash: bytesToHex(
                Uint8Array.from(
                  eventData.hash.map((x: string) => parseInt(x, 10))
                )
              ),
              status: eventData.errorCode === "0" ? "passed" : "failed",
              errorMessage: eventData.errorMessage,
            }
          } else {
            return {
              status: "skipped",
            }
          }
        })

        return {txId, results}
      },
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
