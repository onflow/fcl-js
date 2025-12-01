import * as fcl from "@onflow/fcl"
import {renderHook, waitFor} from "@testing-library/react"
import {createMockFclInstance, MockFclInstance} from "../__mocks__/flow-client"
import {
  TestProvider,
  setMockFlowClient,
  queryClient,
} from "../__mocks__/TestProvider"
import {useFlowChainId} from "./useFlowChainId"
import {useFlowScheduledTransactionSetup} from "./useFlowScheduledTransactionSetup"

jest.mock("@onflow/fcl", () => require("../__mocks__/fcl").default)
jest.mock("./useFlowChainId", () => ({
  useFlowChainId: jest.fn(),
}))

describe("useFlowScheduledTransactionSetup", () => {
  let mockFcl: MockFclInstance

  beforeEach(() => {
    queryClient.clear()
    jest.clearAllMocks()
    jest.mocked(useFlowChainId).mockReturnValue({
      data: "testnet",
      isLoading: false,
    } as any)

    mockFcl = createMockFclInstance()
    setMockFlowClient(mockFcl.mockFclInstance)
    jest.mocked(fcl.createFlowClient).mockReturnValue(mockFcl.mockFclInstance)
  })

  test("sets up manager successfully", async () => {
    const resultTxId = "setup-tx-id-123"
    jest
      .mocked(mockFcl.mockFclInstance.mutate)
      .mockResolvedValueOnce(resultTxId)

    const {result} = renderHook(() => useFlowScheduledTransactionSetup(), {
      wrapper: TestProvider,
    })

    const returnedTxId = await result.current.setupAsync()

    expect(returnedTxId).toBe(resultTxId)
    expect(mockFcl.mockFclInstance.mutate).toHaveBeenCalled()
  })

  test("handles setup errors", async () => {
    const error = new Error("Setup failed")
    jest.mocked(mockFcl.mockFclInstance.mutate).mockRejectedValueOnce(error)

    const {result} = renderHook(() => useFlowScheduledTransactionSetup(), {
      wrapper: TestProvider,
    })

    await expect(result.current.setupAsync()).rejects.toThrow("Setup failed")
  })

  test("throws error when chain ID not detected", async () => {
    jest.mocked(useFlowChainId).mockReturnValue({
      data: null,
      isLoading: false,
    } as any)

    const {result} = renderHook(() => useFlowScheduledTransactionSetup(), {
      wrapper: TestProvider,
    })

    await expect(result.current.setupAsync()).rejects.toThrow(
      "Chain ID not detected"
    )
  })

  test("uses custom flowClient when provided", async () => {
    const customMockFcl = createMockFclInstance()
    const customFlowClient = customMockFcl.mockFclInstance as any
    const resultTxId = "setup-tx-id-456"

    jest.mocked(customFlowClient.mutate).mockResolvedValueOnce(resultTxId)

    const {result} = renderHook(
      () => useFlowScheduledTransactionSetup({flowClient: customFlowClient}),
      {
        wrapper: TestProvider,
      }
    )

    const returnedTxId = await result.current.setupAsync()

    expect(returnedTxId).toBe(resultTxId)
    expect(customFlowClient.mutate).toHaveBeenCalled()
  })

  test("calls onSuccess callback when provided", async () => {
    const resultTxId = "setup-tx-id-789"
    const onSuccess = jest.fn()
    jest
      .mocked(mockFcl.mockFclInstance.mutate)
      .mockResolvedValueOnce(resultTxId)

    const {result} = renderHook(
      () =>
        useFlowScheduledTransactionSetup({
          mutation: {onSuccess},
        }),
      {
        wrapper: TestProvider,
      }
    )

    await result.current.setupAsync()

    await waitFor(() =>
      expect(onSuccess).toHaveBeenCalledWith(resultTxId, undefined, undefined)
    )
  })

  test("calls onError callback when provided", async () => {
    const error = new Error("Setup failed")
    const onError = jest.fn()
    jest.mocked(mockFcl.mockFclInstance.mutate).mockRejectedValueOnce(error)

    const {result} = renderHook(
      () =>
        useFlowScheduledTransactionSetup({
          mutation: {onError},
        }),
      {
        wrapper: TestProvider,
      }
    )

    await expect(result.current.setupAsync()).rejects.toThrow()

    await waitFor(() => expect(onError).toHaveBeenCalled())
  })

  test("isPending is true while mutation is in progress", async () => {
    const resultTxId = "setup-tx-id-abc"
    jest.mocked(mockFcl.mockFclInstance.mutate).mockImplementation(
      () =>
        new Promise(resolve => {
          setTimeout(() => resolve(resultTxId), 100)
        })
    )

    const {result} = renderHook(() => useFlowScheduledTransactionSetup(), {
      wrapper: TestProvider,
    })

    expect(result.current.isPending).toBe(false)

    const promise = result.current.setupAsync()

    await waitFor(() => expect(result.current.isPending).toBe(true))

    await promise

    await waitFor(() => expect(result.current.isPending).toBe(false))
  })
})
