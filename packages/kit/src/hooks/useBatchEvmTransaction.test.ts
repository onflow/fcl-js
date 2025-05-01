import {renderHook, act, waitFor} from "@testing-library/react"
import * as fcl from "@onflow/fcl"
import {FlowProvider} from "../provider"
import {useEvmBatchTransaction, encodeCalls} from "./useBatchEvmTransaction"
import {useFlowChainId} from "./useFlowChainId"

jest.mock("@onflow/fcl", () => require("../__mocks__/fcl").default)
jest.mock("viem", () => ({
  encodeFunctionData: jest.fn(),
  bytesToHex: jest.fn(x => `0x${x}`),
}))
jest.mock("./useFlowChainId", () => ({
  useFlowChainId: jest.fn(),
}))

describe("useBatchEvmTransaction", () => {
  const mockCalls = [
    {
      address: "0x123",
      abi: [{type: "function", name: "test"}],
      functionName: "test",
      args: [1, 2],
      gasLimit: BigInt(100000),
      value: BigInt(0),
    },
  ]

  const mockTxId = "0x123"
  const mockTxResult = {
    events: [
      {
        type: "TransactionExecuted",
        data: {
          hash: ["1", "2", "3"],
          errorCode: "0",
          errorMessage: "",
        },
      },
    ],
  }

  beforeEach(() => {
    jest.clearAllMocks()
    jest.mocked(useFlowChainId).mockReturnValue({
      data: "mainnet",
      isLoading: false,
    } as any)
  })

  describe("encodeCalls", () => {
    it("should encode calls correctly", () => {
      const result = encodeCalls(mockCalls as any)

      expect(result).toEqual([
        [
          {key: "to", value: "0x123"},
          {key: "data", value: ""},
          {key: "gasLimit", value: "100000"},
          {key: "value", value: "0"},
        ],
      ])
    })
  })

  /*describe("getCadenceBatchTransaction", () => {
    it("should return correct cadence for mainnet", () => {
      const result = getCadenceBatchTransaction("mainnet")
      expect(result).toContain("import EVM from 0xe467b9dd11fa00df")
    })

    it("should return correct cadence for testnet", () => {
      const result = getCadenceBatchTransaction("testnet")
      expect(result).toContain("import EVM from 0x8c5303eaa26202d6")
    })

    it("should throw error for unsupported chain", () => {
      expect(() => getCadenceBatchTransaction("unsupported")).toThrow(
        "Unsupported chain ID for EVM batch transaction"
      )
    })
  })*/

  describe("useEvmBatchTransaction", () => {
    it("should handle successful transaction", async () => {
      jest.mocked(fcl.mutate).mockResolvedValue(mockTxId)
      jest.mocked(fcl.tx).mockReturnValue({
        onceExecuted: jest.fn().mockResolvedValue(mockTxResult),
      } as any)

      let hookResult: any

      await act(async () => {
        const {result} = renderHook(() => useEvmBatchTransaction(), {
          wrapper: FlowProvider,
        })
        hookResult = result
      })

      await act(async () => {
        await hookResult.current.sendBatchTransaction(mockCalls)
      })

      await waitFor(() => expect(hookResult.current.isPending).toBe(false))

      expect(hookResult.current.isError).toBe(false)
      expect(hookResult.current.data?.txId).toBe(mockTxId)
      expect(hookResult.current.data?.results).toHaveLength(1)
      expect(hookResult.current.data?.results[0].status).toBe("passed")
    })

    it("should handle failed transaction", async () => {
      jest.mocked(fcl.mutate).mockResolvedValue(mockTxId)
      jest.mocked(fcl.tx).mockReturnValue({
        onceExecuted: jest
          .fn()
          .mockRejectedValue(new Error("Transaction failed")),
      } as any)

      let hookResult: any

      await act(async () => {
        const {result} = renderHook(() => useEvmBatchTransaction(), {
          wrapper: FlowProvider,
        })
        hookResult = result
      })

      await act(async () => {
        await hookResult.current.sendBatchTransaction(mockCalls)
      })

      await waitFor(() => expect(hookResult.current.isPending).toBe(false))

      expect(hookResult.current.isError).toBe(false)
      expect(hookResult.current.data?.results[0].status).toBe("failed")
      expect(hookResult.current.data?.results[0].errorMessage).toBe(
        "Transaction reverted"
      )
    })

    it("should handle skipped calls", async () => {
      jest.mocked(fcl.mutate).mockResolvedValue(mockTxId)
      jest.mocked(fcl.tx).mockReturnValue({
        onceExecuted: jest.fn().mockResolvedValue({events: []}),
      } as any)

      let hookResult: any

      await act(async () => {
        const {result} = renderHook(() => useEvmBatchTransaction(), {
          wrapper: FlowProvider,
        })
        hookResult = result
      })

      await act(async () => {
        await hookResult.current.sendBatchTransaction(mockCalls)
      })

      await waitFor(() => expect(hookResult.current.isPending).toBe(false))

      expect(hookResult.current.data?.results[0].status).toBe("skipped")
    })

    it("should handle missing chain ID", async () => {
      ;(useFlowChainId as jest.Mock).mockReturnValue({
        data: null,
        isLoading: false,
      })

      let hookResult: any

      await act(async () => {
        const {result} = renderHook(() => useEvmBatchTransaction(), {
          wrapper: FlowProvider,
        })
        hookResult = result
      })

      await act(async () => {
        await hookResult.current.sendBatchTransaction(mockCalls)
      })

      await waitFor(() => expect(hookResult.current.isError).toBe(true))
      expect(hookResult.current.error?.message).toBe("No current chain found")
    })

    it("should handle loading chain ID", async () => {
      ;(useFlowChainId as jest.Mock).mockReturnValue({
        data: null,
        isLoading: true,
      })

      let hookResult: any

      await act(async () => {
        const {result} = renderHook(() => useEvmBatchTransaction(), {
          wrapper: FlowProvider,
        })
        hookResult = result
      })

      await act(async () => {
        await hookResult.current.sendBatchTransaction(mockCalls)
      })

      await waitFor(() => expect(hookResult.current.isError).toBe(true))
      expect(hookResult.current.error?.message).toBe("No current chain found")
    })

    it("should handle mutation error", async () => {
      ;(fcl.mutate as jest.Mock).mockRejectedValue(new Error("Mutation failed"))

      let hookResult: any

      await act(async () => {
        const {result} = renderHook(() => useEvmBatchTransaction(), {
          wrapper: FlowProvider,
        })
        hookResult = result
      })

      await act(async () => {
        await hookResult.current.sendBatchTransaction(mockCalls)
      })

      await waitFor(() => expect(hookResult.current.isError).toBe(true))
      expect(hookResult.current.error?.message).toBe("Mutation failed")
    })
  })
})
