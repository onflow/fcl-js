import {renderHook, act, waitFor} from "@testing-library/react"
import * as fcl from "@onflow/fcl"
import {FlowProvider} from "../provider"
import {useCrossVmSpendFt} from "./useCrossVmSpendFt"
import {useFlowChainId} from "./useFlowChainId"

jest.mock("@onflow/fcl", () => require("../__mocks__/fcl").default)
jest.mock("./useFlowChainId", () => ({
  useFlowChainId: jest.fn(),
}))

describe("useCrossVmSpendFt", () => {
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

  describe("useCrossVmSpendFt", () => {
    test("should handle successful transaction", async () => {
      jest.mocked(fcl.mutate).mockResolvedValue(mockTxId)
      jest.mocked(fcl.tx).mockReturnValue({
        onceExecuted: jest.fn().mockResolvedValue(mockTxResult),
      } as any)

      let result: any
      let rerender: any
      await act(async () => {
        ;({result, rerender} = renderHook(useCrossVmSpendFt, {
          wrapper: FlowProvider,
        }))
      })

      await act(async () => {
        await result.current.spendFtAsync({
          vaultIdentifier: "A.123.FlowToken.Vault",
          amount: "1.0",
          calls: mockCalls,
        })
        rerender()
      })

      await waitFor(() => result.current.isPending === false)

      expect(result.current.isError).toBe(false)
      expect(result.current.data).toBe(mockTxId)
    })

    test("should handle failed transaction", async () => {
      jest.mocked(fcl.mutate).mockResolvedValue(mockTxId)
      jest.mocked(fcl.tx).mockReturnValue({
        onceExecuted: jest
          .fn()
          .mockRejectedValue(new Error("Transaction failed")),
      } as any)

      let hookResult: any

      await act(async () => {
        const {result} = renderHook(useCrossVmSpendFt, {
          wrapper: FlowProvider,
        })
        hookResult = result
      })

      await act(async () => {
        await hookResult.current.spendFtAsync({
          vaultIdentifier: "A.123.FlowToken.Vault",
          amount: "1.0",
          calls: mockCalls,
        })
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
        const {result} = renderHook(useCrossVmSpendFt, {
          wrapper: FlowProvider,
        })
        hookResult = result
      })

      await act(async () => {
        await hookResult.current.spendFtAsync({
          vaultIdentifier: "A.123.FlowToken.Vault",
          amount: "1.0",
          calls: mockCalls,
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
        const {result} = renderHook(useCrossVmSpendFt, {
          wrapper: FlowProvider,
        })
        hookResult = result
      })

      await act(async () => {
        await hookResult.current.spendFtAsync({
          vaultIdentifier: "A.123.FlowToken.Vault",
          amount: "1.0",
          calls: mockCalls,
        })
      })

      await waitFor(() => expect(hookResult.current.isError).toBe(true))
      expect(hookResult.current.error?.message).toBe("No current chain found")
    })

    it("should handle mutation error", async () => {
      ;(fcl.mutate as jest.Mock).mockRejectedValue(new Error("Mutation failed"))

      let hookResult: any

      await act(async () => {
        const {result} = renderHook(useCrossVmSpendFt, {
          wrapper: FlowProvider,
        })
        hookResult = result
      })

      await act(async () => {
        await hookResult.current.spendFtAsync({
          vaultIdentifier: "A.123.FlowToken.Vault",
          amount: "1.0",
          calls: mockCalls,
        })
      })

      await waitFor(() => expect(hookResult.current.isError).toBe(true))
      expect(hookResult.current.error?.message).toBe("Mutation failed")
    })
  })
})
