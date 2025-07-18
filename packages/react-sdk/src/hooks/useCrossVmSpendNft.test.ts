import {renderHook, act, waitFor} from "@testing-library/react"
import * as fcl from "@onflow/fcl"
import {FlowProvider} from "../provider"
import {
  getCrossVmSpendNftransaction,
  useCrossVmSpendNft,
} from "./useCrossVmSpendNft"
import {useFlowChainId} from "./useFlowChainId"
import {createMockFclInstance, MockFclInstance} from "../__mocks__/fclInstance"

jest.mock("@onflow/fcl", () => require("../__mocks__/fcl").default)
jest.mock("./useFlowChainId", () => ({
  useFlowChainId: jest.fn(),
}))

describe("useBatchEvmTransaction", () => {
  let mockFcl: MockFclInstance

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

    mockFcl = createMockFclInstance()
    jest.mocked(fcl.createFcl).mockReturnValue(mockFcl.mockFclInstance)
  })

  describe("getCrossVmSpendNftTransaction", () => {
    it("should return correct cadence for mainnet", () => {
      const result = getCrossVmSpendNftransaction("mainnet")
      expect(result).toContain("import EVM from 0xe467b9dd11fa00df")
    })

    it("should return correct cadence for testnet", () => {
      const result = getCrossVmSpendNftransaction("testnet")
      expect(result).toContain("import EVM from 0x8c5303eaa26202d6")
    })

    it("should throw error for unsupported chain", () => {
      expect(() => getCrossVmSpendNftransaction("unsupported")).toThrow(
        "Unsupported chain: unsupported"
      )
    })
  })

  describe("useCrossVmBatchTransaction", () => {
    test("should handle successful transaction", async () => {
      jest.mocked(mockFcl.mockFclInstance.mutate).mockResolvedValue(mockTxId)
      jest.mocked(mockFcl.mockFclInstance.tx).mockReturnValue({
        onceExecuted: jest.fn().mockResolvedValue(mockTxResult),
      } as any)

      let result: any
      let rerender: any
      await act(async () => {
        ;({result, rerender} = renderHook(useCrossVmSpendNft, {
          wrapper: FlowProvider,
        }))
      })

      await act(async () => {
        await result.current.spendNft({
          calls: mockCalls,
          nftIdentifier: "nft123",
          nftIds: ["1", "2"],
        })
        rerender()
      })

      await waitFor(() => result.current.isPending === false)

      expect(result.current.isError).toBe(false)
      expect(result.current.data).toBe(mockTxId)
    })

    it("should handle missing chain ID", async () => {
      jest.mocked(useFlowChainId).mockReturnValue({
        data: null,
        isLoading: false,
      } as any)

      let hookResult: any

      await act(async () => {
        const {result} = renderHook(() => useCrossVmSpendNft(), {
          wrapper: FlowProvider,
        })
        hookResult = result
      })

      await act(async () => {
        await hookResult.current.spendNft({calls: mockCalls})
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
        const {result} = renderHook(() => useCrossVmSpendNft(), {
          wrapper: FlowProvider,
        })
        hookResult = result
      })

      await act(async () => {
        await hookResult.current.spendNft(mockCalls)
      })

      await waitFor(() => expect(hookResult.current.isError).toBe(true))
      expect(hookResult.current.error?.message).toBe("No current chain found")
    })

    it("should handle mutation error", async () => {
      jest
        .mocked(mockFcl.mockFclInstance.mutate)
        .mockRejectedValue(new Error("Mutation failed"))

      let hookResult: any

      await act(async () => {
        const {result} = renderHook(() => useCrossVmSpendNft(), {
          wrapper: FlowProvider,
        })
        hookResult = result
      })

      await act(async () => {
        await hookResult.current.spendNft({
          calls: mockCalls,
          nftIdentifier: "nft123",
          nftIds: ["1", "2"],
        })
      })

      await waitFor(() => expect(hookResult.current.isError).toBe(true))
      expect(hookResult.current.error?.message).toBe("Mutation failed")
    })
  })
})
