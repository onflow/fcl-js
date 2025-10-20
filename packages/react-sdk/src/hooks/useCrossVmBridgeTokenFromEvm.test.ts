import {renderHook, act, waitFor} from "@testing-library/react"
import * as fcl from "@onflow/fcl"
import {FlowProvider} from "../provider"
import {
  getCrossVmBridgeTokenFromEvmTransaction,
  useCrossVmBridgeTokenFromEvm,
} from "./useCrossVmBridgeTokenFromEvm"
import {useFlowChainId} from "./useFlowChainId"
import {createMockFclInstance, MockFclInstance} from "../__mocks__/flow-client"

jest.mock("@onflow/fcl", () => require("../__mocks__/fcl").default)
jest.mock("./useFlowChainId", () => ({
  useFlowChainId: jest.fn(),
}))

describe("useCrossVmBridgeTokenFromEvm", () => {
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
    jest.clearAllMocks()
    jest.mocked(useFlowChainId).mockReturnValue({
      data: "testnet",
      isLoading: false,
    } as any)

    mockFcl = createMockFclInstance()
    jest.mocked(fcl.createFlowClient).mockReturnValue(mockFcl.mockFclInstance)
  })

  describe("getCrossVmBridgeTokenFromEvmTransaction", () => {
    it("should return correct cadence for mainnet", () => {
      const result = getCrossVmBridgeTokenFromEvmTransaction("mainnet")
      expect(result).toContain("import EVM from 0xe467b9dd11fa00df")
    })

    it("should return correct cadence for testnet", () => {
      const result = getCrossVmBridgeTokenFromEvmTransaction("testnet")
      expect(result).toContain("import EVM from 0x8c5303eaa26202d6")
    })

    it("should throw error for unsupported chain", () => {
      expect(() =>
        getCrossVmBridgeTokenFromEvmTransaction("unsupported")
      ).toThrow("Unsupported chain: unsupported")
    })
  })

  describe("useCrossVmBridgeTokenFromEvmTx", () => {
    test("should handle successful transaction", async () => {
      mockFcl.mockFclInstance.mutate.mockResolvedValue(mockTxId)
      mockFcl.mockTx.mockReturnValue({
        onceExecuted: jest.fn().mockResolvedValue(mockTxResult),
      } as any)

      let result: any
      let rerender: any
      await act(async () => {
        ;({result, rerender} = renderHook(useCrossVmBridgeTokenFromEvm, {
          wrapper: FlowProvider,
        }))
      })

      await act(async () => {
        await result.current.crossVmBridgeTokenFromEvm({
          vaultIdentifier: "A.dfc20aee650fcbdf.ClickToken.Vault",
          amount: "1000000000000000000",
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
        const {result} = renderHook(() => useCrossVmBridgeTokenFromEvm(), {
          wrapper: FlowProvider,
        })
        hookResult = result
      })

      await act(async () => {
        await hookResult.current.crossVmBridgeTokenFromEvm({
          vaultIdentifier: "A.dfc20aee650fcbdf.ClickToken.Vault",
          amount: "1000000000000000000",
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
        const {result} = renderHook(() => useCrossVmBridgeTokenFromEvm(), {
          wrapper: FlowProvider,
        })
        hookResult = result
      })

      await act(async () => {
        await hookResult.current.crossVmBridgeTokenFromEvm({
          vaultIdentifier: "A.dfc20aee650fcbdf.ClickToken.Vault",
          amount: "1000000000000000000",
        })
      })

      await waitFor(() => expect(hookResult.current.isError).toBe(true))
      expect(hookResult.current.error?.message).toBe("No current chain found")
    })

    it("should handle mutation error", async () => {
      mockFcl.mockFclInstance.mutate.mockRejectedValue(
        new Error("Mutation failed")
      )

      let hookResult: any

      await act(async () => {
        const {result} = renderHook(() => useCrossVmBridgeTokenFromEvm(), {
          wrapper: FlowProvider,
        })
        hookResult = result
      })

      await act(async () => {
        await hookResult.current.crossVmBridgeTokenFromEvm({
          vaultIdentifier: "A.dfc20aee650fcbdf.ClickToken.Vault",
          amount: "1000000000000000000",
        })
      })

      await waitFor(() => expect(hookResult.current.isError).toBe(true))
      expect(hookResult.current.error?.message).toBe("Mutation failed")
    })
  })
})
