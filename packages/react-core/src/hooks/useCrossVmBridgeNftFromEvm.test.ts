import {renderHook, act, waitFor} from "@testing-library/react"
import * as fcl from "@onflow/fcl"
import {
  TestProvider,
  setMockFlowClient,
  queryClient,
} from "../__mocks__/TestProvider"
import {
  getCrossVmBridgeNftFromEvmTransaction,
  useCrossVmBridgeNftFromEvm,
} from "./useCrossVmBridgeNftFromEvm"
import {useFlowChainId} from "./useFlowChainId"
import {createMockFclInstance, MockFclInstance} from "../__mocks__/flow-client"

jest.mock("@onflow/fcl", () => require("../__mocks__/fcl").default)
jest.mock("./useFlowChainId", () => ({
  useFlowChainId: jest.fn(),
}))

describe("useCrossVmBridgeNftFromEvm", () => {
  let mockFcl: MockFclInstance

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
    mockFcl = createMockFclInstance()
    setMockFlowClient(mockFcl.mockFclInstance)
    jest.mocked(fcl.createFlowClient).mockReturnValue(mockFcl.mockFclInstance)
    jest.mocked(useFlowChainId).mockReturnValue({
      data: "testnet",
      isLoading: false,
    } as any)
  })

  describe("getCrossVmBridgeNftFromEvmTransaction", () => {
    it("should return correct cadence for mainnet", () => {
      const result = getCrossVmBridgeNftFromEvmTransaction("mainnet")
      expect(result).toContain("import EVM from 0xe467b9dd11fa00df")
    })

    it("should return correct cadence for testnet", () => {
      const result = getCrossVmBridgeNftFromEvmTransaction("testnet")
      expect(result).toContain("import EVM from 0x8c5303eaa26202d6")
    })

    it("should throw error for unsupported chain", () => {
      expect(() =>
        getCrossVmBridgeNftFromEvmTransaction("unsupported")
      ).toThrow("Unsupported chain: unsupported")
    })
  })

  describe("useCrossVmBridgeNftFromEvmTx", () => {
    test("should handle successful transaction", async () => {
      jest.mocked(mockFcl.mockFclInstance.mutate).mockResolvedValue(mockTxId)
      jest.mocked(mockFcl.mockFclInstance.tx).mockReturnValue({
        onceExecuted: jest.fn().mockResolvedValue(mockTxResult),
      } as any)

      let result: any
      let rerender: any
      await act(async () => {
        ;({result, rerender} = renderHook(useCrossVmBridgeNftFromEvm, {
          wrapper: TestProvider,
        }))
      })

      await act(async () => {
        await result.current.crossVmBridgeNftFromEvm({
          nftIdentifier: "A.dfc20aee650fcbdf.ExampleNFT.NFT",
          nftId: "123",
        })
        rerender()
      })

      await waitFor(() => result.current.isPending === false)

      expect(result.current.isError).toBe(false)
      expect(result.current.data).toBe(mockTxId)
    })

    it("should handle missing chain ID", async () => {
      ;(useFlowChainId as jest.Mock).mockReturnValue({
        data: null,
        isLoading: false,
      })

      let hookResult: any

      await act(async () => {
        const {result} = renderHook(() => useCrossVmBridgeNftFromEvm(), {
          wrapper: TestProvider,
        })
        hookResult = result
      })

      await act(async () => {
        await hookResult.current.crossVmBridgeNftFromEvm({
          nftIdentifier: "A.dfc20aee650fcbdf.ExampleNFT.NFT",
          nftId: "123",
        })
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
        const {result} = renderHook(() => useCrossVmBridgeNftFromEvm(), {
          wrapper: TestProvider,
        })
        hookResult = result
      })

      await act(async () => {
        await hookResult.current.crossVmBridgeNftFromEvm({
          nftIdentifier: "A.dfc20aee650fcbdf.ExampleNFT.NFT",
          nftId: "123",
        })
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
        const {result} = renderHook(() => useCrossVmBridgeNftFromEvm(), {
          wrapper: TestProvider,
        })
        hookResult = result
      })

      await act(async () => {
        await hookResult.current.crossVmBridgeNftFromEvm({
          nftIdentifier: "A.dfc20aee650fcbdf.ExampleNFT.NFT",
          nftId: "123",
        })
      })

      await waitFor(() => expect(hookResult.current.isError).toBe(true))
      expect(hookResult.current.error?.message).toBe("Mutation failed")
    })
  })
})
