import * as fcl from "@onflow/fcl"
import {renderHook, waitFor} from "@testing-library/react"
import {createMockFclInstance, MockFclInstance} from "../__mocks__/flow-client"
import {FlowProvider} from "../provider"
import {useFlowChainId} from "./useFlowChainId"
import {
  ScheduledTransactionPriority,
  ScheduledTransactionStatus,
} from "./useFlowScheduledTransactionList"
import {useFlowScheduledTransaction} from "./useFlowScheduledTransaction"

jest.mock("@onflow/fcl", () => require("../__mocks__/fcl").default)
jest.mock("./useFlowChainId", () => ({
  useFlowChainId: jest.fn(),
}))

describe("useFlowScheduledTransaction", () => {
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

  test("gets a transaction by ID", async () => {
    const mockTransaction = {
      id: "42",
      priority: 0,
      executionEffort: "50",
      status: 2,
      fees: "0.0005",
      scheduledTimestamp: "1234567890.0",
      handlerTypeIdentifier: "A.789.Handler",
      handlerAddress: "0x789",
    }

    jest
      .mocked(mockFcl.mockFclInstance.query)
      .mockResolvedValueOnce(mockTransaction)

    const {result} = renderHook(
      () => useFlowScheduledTransaction({txId: "42"}),
      {
        wrapper: FlowProvider,
      }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toBeDefined()
    expect(result.current.data?.id).toBe("42")
    expect(result.current.data?.priority).toBe(ScheduledTransactionPriority.Low)
    expect(result.current.data?.status).toBe(
      ScheduledTransactionStatus.Completed
    )
    expect(mockFcl.mockFclInstance.query).toHaveBeenCalled()
  })

  test("gets a transaction with handler data", async () => {
    const mockTransactionWithHandler = {
      id: "42",
      priority: 1,
      executionEffort: "100",
      status: 0,
      fees: "0.001",
      scheduledTimestamp: "1234567890.0",
      handlerTypeIdentifier: "A.789.Handler",
      handlerAddress: "0x789",
      handlerUUID: "5555",
      handlerResolvedViews: {metadata: {description: "Test handler"}},
    }

    jest
      .mocked(mockFcl.mockFclInstance.query)
      .mockResolvedValueOnce(mockTransactionWithHandler)

    const {result} = renderHook(
      () =>
        useFlowScheduledTransaction({
          txId: "42",
          includeHandlerData: true,
        }),
      {
        wrapper: FlowProvider,
      }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toBeDefined()
    expect(result.current.data?.id).toBe("42")
    expect(result.current.data?.handlerUUID).toBe("5555")
    expect(result.current.data?.handlerResolvedViews).toEqual({
      metadata: {description: "Test handler"},
    })
    expect(mockFcl.mockFclInstance.query).toHaveBeenCalled()
  })

  test("returns null when transaction not found", async () => {
    jest.mocked(mockFcl.mockFclInstance.query).mockResolvedValueOnce(null)

    const {result} = renderHook(
      () => useFlowScheduledTransaction({txId: "999"}),
      {
        wrapper: FlowProvider,
      }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toBeNull()
    expect(mockFcl.mockFclInstance.query).toHaveBeenCalled()
  })

  test("is disabled when no transaction ID provided", async () => {
    const {result} = renderHook(() => useFlowScheduledTransaction(), {
      wrapper: FlowProvider,
    })

    await waitFor(() => expect(result.current.isPending).toBe(true))

    expect(result.current.data).toBeUndefined()
    expect(mockFcl.mockFclInstance.query).not.toHaveBeenCalled()
  })

  test("is disabled when chain ID not detected", async () => {
    jest.mocked(useFlowChainId).mockReturnValue({
      data: null,
      isLoading: false,
    } as any)

    const {result} = renderHook(
      () => useFlowScheduledTransaction({txId: "42"}),
      {
        wrapper: FlowProvider,
      }
    )

    await waitFor(() => expect(result.current.isPending).toBe(true))

    expect(result.current.data).toBeUndefined()
    expect(mockFcl.mockFclInstance.query).not.toHaveBeenCalled()
  })

  test("handles query errors", async () => {
    const error = new Error("Query failed")
    jest.mocked(mockFcl.mockFclInstance.query).mockRejectedValueOnce(error)

    const {result} = renderHook(
      () => useFlowScheduledTransaction({txId: "42"}),
      {
        wrapper: FlowProvider,
      }
    )

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(result.current.error).toEqual(error)
  })

  test("uses custom flowClient when provided", async () => {
    const customMockFcl = createMockFclInstance()
    const customFlowClient = customMockFcl.mockFclInstance as any

    jest.mocked(customFlowClient.query).mockResolvedValueOnce(null)

    const {result} = renderHook(
      () =>
        useFlowScheduledTransaction({
          txId: "42",
          flowClient: customFlowClient,
        }),
      {
        wrapper: FlowProvider,
      }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(customFlowClient.query).toHaveBeenCalled()
  })

  test("respects query options enabled flag", async () => {
    const {result} = renderHook(
      () =>
        useFlowScheduledTransaction({
          txId: "42",
          query: {enabled: false},
        }),
      {
        wrapper: FlowProvider,
      }
    )

    await waitFor(() => expect(result.current.isPending).toBe(true))

    expect(result.current.data).toBeUndefined()
    expect(mockFcl.mockFclInstance.query).not.toHaveBeenCalled()
  })
})
