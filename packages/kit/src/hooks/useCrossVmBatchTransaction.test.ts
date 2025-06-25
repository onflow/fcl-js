import {renderHook, act, waitFor} from "@testing-library/react"
import * as fcl from "@onflow/fcl"
import {FlowProvider} from "../provider"
import {
  encodeCalls,
  getCadenceBatchTransaction,
  useCrossVmBatchTransaction,
} from "./useCrossVmBatchTransaction"
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
      abi: [{type: "function", name: "test"} as any],
      functionName: "test",
      args: [1, 2],
      gasLimit: BigInt(100000),
      value: BigInt(0),
    },
  ]

  const mockTxId = "0x123"

  beforeEach(() => {
    jest.clearAllMocks()
    jest.mocked(useFlowChainId).mockReturnValue({
      data: "mainnet",
      isLoading: false,
    } as any)
  })

  describe("encodeCalls", () => {
    it("should encode calls correctly", () => {
      const result = encodeCalls(mockCalls)

      expect(result).toEqual([
        {
          to: "0x123",
          data: "",
          gasLimit: "100000",
          value: "0",
        },
      ])
    })
  })

  describe("getCadenceBatchTransaction", () => {
    it("should return correct cadence for mainnet", () => {
      const result = getCadenceBatchTransaction("mainnet")
      expect(result).toContain("import EVM from 0xe467b9dd11fa00df")
    })

    it("should return correct cadence for testnet", () => {
      const result = getCadenceBatchTransaction("testnet")
      expect(result).toContain("import EVM from 0x8c5303eaa26202d6")
    })

    it("should return correct cadence for local", () => {
      const result = getCadenceBatchTransaction("local")
      expect(result).toContain("import EVM from 0xf8d6e0586b0a20c0")
    })

    it("should throw error for unsupported chain", () => {
      expect(() => getCadenceBatchTransaction("unsupported")).toThrow(
        "Unsupported chain: unsupported"
      )
    })
  })

  describe("useCrossVmBatchTransaction", () => {
    test("should handle successful transaction", async () => {
      jest.mocked(fcl.mutate).mockResolvedValue(mockTxId)

      let result: any
      let rerender: any
      await act(async () => {
        ;({result, rerender} = renderHook(useCrossVmBatchTransaction, {
          wrapper: FlowProvider,
        }))
      })

      await act(async () => {
        await result.current.sendBatchTransaction({calls: mockCalls})
        rerender()
      })

      await waitFor(() => result.current.isPending === false)

      expect(result.current.isError).toBe(false)
      expect(result.current.data).toBe(mockTxId)
    })

    test("should handle error transaction", async () => {
      jest.mocked(fcl.mutate).mockRejectedValue(new Error("Transaction failed"))

      let hookResult: any

      await act(async () => {
        const {result} = renderHook(useCrossVmBatchTransaction, {
          wrapper: FlowProvider,
        })
        hookResult = result
      })

      await act(async () => {
        await hookResult.current.sendBatchTransaction({calls: mockCalls})
      })

      await waitFor(() => expect(hookResult.current.isPending).toBe(false))

      expect(hookResult.current.isError).toBe(true)
      expect(hookResult.current.error?.message).toBe("Transaction failed")
    })

    it("should handle missing chain ID", async () => {
      ;(useFlowChainId as jest.Mock).mockReturnValue({
        data: null,
        isLoading: false,
      })

      let hookResult: any

      await act(async () => {
        const {result} = renderHook(() => useCrossVmBatchTransaction(), {
          wrapper: FlowProvider,
        })
        hookResult = result
      })

      await act(async () => {
        await hookResult.current.sendBatchTransaction({calls: mockCalls})
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
        const {result} = renderHook(() => useCrossVmBatchTransaction(), {
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
        const {result} = renderHook(() => useCrossVmBatchTransaction(), {
          wrapper: FlowProvider,
        })
        hookResult = result
      })

      await act(async () => {
        await hookResult.current.sendBatchTransaction({calls: mockCalls})
      })

      await waitFor(() => expect(hookResult.current.isError).toBe(true))
      expect(hookResult.current.error?.message).toBe("Mutation failed")
    })
  })
})
