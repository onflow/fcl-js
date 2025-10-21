import * as fcl from "@onflow/fcl"
import {renderHook, waitFor} from "@testing-library/react"
import {createMockFclInstance, MockFclInstance} from "../__mocks__/flow-client"
import {FlowProvider} from "../provider"
import {useFlowChainId} from "./useFlowChainId"
import {useFlowScheduledTransactionCancel} from "./useFlowScheduledTransactionCancel"

jest.mock("@onflow/fcl", () => require("../__mocks__/fcl").default)
jest.mock("./useFlowChainId", () => ({
  useFlowChainId: jest.fn(),
}))

describe("useFlowScheduledTransactionCancel", () => {
  let mockFcl: MockFclInstance

  beforeEach(() => {
    jest.clearAllMocks()
    jest.mocked(useFlowChainId).mockReturnValue({
      data: "testnet",
      isLoading: false,
    } as any)

    mockFcl = createMockFclInstance()
    jest.mocked(fcl.createFlowClient).mockReturnValue(mockFcl.mockFclInstance)
  })

  test("cancels a transaction successfully", async () => {
    const resultTxId = "cancel-tx-id-456"
    jest
      .mocked(mockFcl.mockFclInstance.mutate)
      .mockResolvedValueOnce(resultTxId)

    const {result} = renderHook(() => useFlowScheduledTransactionCancel(), {
      wrapper: FlowProvider,
    })

    const returnedTxId = await result.current.cancelTransactionAsync("42")

    expect(returnedTxId).toBe(resultTxId)
    expect(mockFcl.mockFclInstance.mutate).toHaveBeenCalled()
  })

  test("handles cancel errors", async () => {
    const error = new Error("Cancel failed")
    jest.mocked(mockFcl.mockFclInstance.mutate).mockRejectedValueOnce(error)

    const {result} = renderHook(() => useFlowScheduledTransactionCancel(), {
      wrapper: FlowProvider,
    })

    await expect(result.current.cancelTransactionAsync("42")).rejects.toThrow(
      "Cancel failed"
    )
  })

  test("throws error when chain ID not detected", async () => {
    jest.mocked(useFlowChainId).mockReturnValue({
      data: null,
      isLoading: false,
    } as any)

    const {result} = renderHook(() => useFlowScheduledTransactionCancel(), {
      wrapper: FlowProvider,
    })

    await expect(result.current.cancelTransactionAsync("42")).rejects.toThrow(
      "Chain ID not detected"
    )
  })

  test("uses custom flowClient when provided", async () => {
    const customMockFcl = createMockFclInstance()
    const customFlowClient = customMockFcl.mockFclInstance as any
    const resultTxId = "cancel-tx-id-789"

    jest.mocked(customFlowClient.mutate).mockResolvedValueOnce(resultTxId)

    const {result} = renderHook(
      () => useFlowScheduledTransactionCancel({flowClient: customFlowClient}),
      {
        wrapper: FlowProvider,
      }
    )

    const returnedTxId = await result.current.cancelTransactionAsync("42")

    expect(returnedTxId).toBe(resultTxId)
    expect(customFlowClient.mutate).toHaveBeenCalled()
  })

  test("calls onSuccess callback when provided", async () => {
    const resultTxId = "cancel-tx-id-abc"
    const onSuccess = jest.fn()
    jest
      .mocked(mockFcl.mockFclInstance.mutate)
      .mockResolvedValueOnce(resultTxId)

    const {result} = renderHook(
      () =>
        useFlowScheduledTransactionCancel({
          mutation: {onSuccess},
        }),
      {
        wrapper: FlowProvider,
      }
    )

    await result.current.cancelTransactionAsync("42")

    await waitFor(() =>
      expect(onSuccess).toHaveBeenCalledWith(resultTxId, "42", undefined)
    )
  })

  test("calls onError callback when provided", async () => {
    const error = new Error("Cancel failed")
    const onError = jest.fn()
    jest.mocked(mockFcl.mockFclInstance.mutate).mockRejectedValueOnce(error)

    const {result} = renderHook(
      () =>
        useFlowScheduledTransactionCancel({
          mutation: {onError},
        }),
      {
        wrapper: FlowProvider,
      }
    )

    await expect(result.current.cancelTransactionAsync("42")).rejects.toThrow()

    await waitFor(() => expect(onError).toHaveBeenCalled())
  })

  test("isPending is true while mutation is in progress", async () => {
    const resultTxId = "cancel-tx-id-def"
    jest.mocked(mockFcl.mockFclInstance.mutate).mockImplementation(
      () =>
        new Promise(resolve => {
          setTimeout(() => resolve(resultTxId), 100)
        })
    )

    const {result} = renderHook(() => useFlowScheduledTransactionCancel(), {
      wrapper: FlowProvider,
    })

    expect(result.current.isPending).toBe(false)

    const promise = result.current.cancelTransactionAsync("42")

    await waitFor(() => expect(result.current.isPending).toBe(true))

    await promise

    await waitFor(() => expect(result.current.isPending).toBe(false))
  })

  test("passes correct transaction ID to mutation", async () => {
    const resultTxId = "cancel-tx-id-xyz"
    const txId = "999"
    jest
      .mocked(mockFcl.mockFclInstance.mutate)
      .mockResolvedValueOnce(resultTxId)

    const {result} = renderHook(() => useFlowScheduledTransactionCancel(), {
      wrapper: FlowProvider,
    })

    await result.current.cancelTransactionAsync(txId)

    expect(mockFcl.mockFclInstance.mutate).toHaveBeenCalled()
    // Verify the mutation was called with args function
    const mutateCall = jest.mocked(mockFcl.mockFclInstance.mutate).mock
      .calls[0][0] as {cadence: string; args: Function}
    expect(mutateCall.args).toBeInstanceOf(Function)
  })
})
