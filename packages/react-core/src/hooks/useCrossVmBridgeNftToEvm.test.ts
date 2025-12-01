import {renderHook, act, waitFor} from "@testing-library/react"
import * as fcl from "@onflow/fcl"
import {
  TestProvider,
  setMockFlowClient,
  queryClient,
} from "../__mocks__/TestProvider"
import {
  getCrossVmBridgeNftToEvmTransaction,
  useCrossVmBridgeNftToEvm,
} from "./useCrossVmBridgeNftToEvm"
import {useFlowChainId} from "./useFlowChainId"
import {createMockFclInstance, MockFclInstance} from "../__mocks__/flow-client"

jest.mock("@onflow/fcl", () => require("../__mocks__/fcl").default)
jest.mock("./useFlowChainId", () => ({
  useFlowChainId: jest.fn(),
}))

describe("useCrossVmBridgeNftToEvm", () => {
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
    queryClient.clear()
    jest.clearAllMocks()
    jest.mocked(useFlowChainId).mockReturnValue({
      data: "mainnet",
      isLoading: false,
    } as any)

    mockFcl = createMockFclInstance()
    setMockFlowClient(mockFcl.mockFclInstance)
    jest.mocked(fcl.createFlowClient).mockReturnValue(mockFcl.mockFclInstance)
  })

  describe("getCrossVmBridgeNftToEvmTransaction", () => {
    it("should return correct cadence for mainnet", () => {
      const result = getCrossVmBridgeNftToEvmTransaction("mainnet")
      expect(result).toContain("import EVM from 0xe467b9dd11fa00df")
    })

    it("should return correct cadence for testnet", () => {
      const result = getCrossVmBridgeNftToEvmTransaction("testnet")
      expect(result).toContain("import EVM from 0x8c5303eaa26202d6")
    })

    it("should throw error for unsupported chain", () => {
      expect(() => getCrossVmBridgeNftToEvmTransaction("unsupported")).toThrow(
        "Unsupported chain: unsupported"
      )
    })
  })

  describe("useCrossVmBridgeNftToEvmTx", () => {
    test("should handle successful transaction", async () => {
      jest.mocked(mockFcl.mockFclInstance.mutate).mockResolvedValue(mockTxId)
      jest.mocked(mockFcl.mockFclInstance.tx).mockReturnValue({
        onceExecuted: jest.fn().mockResolvedValue(mockTxResult),
      } as any)

      let result: any
      let rerender: any
      await act(async () => {
        ;({result, rerender} = renderHook(useCrossVmBridgeNftToEvm, {
          wrapper: TestProvider,
        }))
      })

      await act(async () => {
        await result.current.crossVmBridgeNftToEvm({
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
        const {result} = renderHook(() => useCrossVmBridgeNftToEvm(), {
          wrapper: TestProvider,
        })
        hookResult = result
      })

      await act(async () => {
        await hookResult.current.crossVmBridgeNftToEvm({calls: mockCalls})
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
        const {result} = renderHook(() => useCrossVmBridgeNftToEvm(), {
          wrapper: TestProvider,
        })
        hookResult = result
      })

      await act(async () => {
        await hookResult.current.crossVmBridgeNftToEvm(mockCalls)
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
        const {result} = renderHook(() => useCrossVmBridgeNftToEvm(), {
          wrapper: TestProvider,
        })
        hookResult = result
      })

      await act(async () => {
        await hookResult.current.crossVmBridgeNftToEvm({
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
