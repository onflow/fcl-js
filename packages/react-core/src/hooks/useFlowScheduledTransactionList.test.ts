import * as fcl from "@onflow/fcl"
import {renderHook, waitFor} from "@testing-library/react"
import {createMockFclInstance, MockFclInstance} from "../__mocks__/flow-client"
import {
  TestProvider,
  setMockFlowClient,
  queryClient,
} from "../__mocks__/TestProvider"
import {useFlowChainId} from "./useFlowChainId"
import {
  useFlowScheduledTransactionList,
  ScheduledTransactionPriority,
  ScheduledTransactionStatus,
} from "./useFlowScheduledTransactionList"

jest.mock("@onflow/fcl", () => require("../__mocks__/fcl").default)
jest.mock("./useFlowChainId", () => ({
  useFlowChainId: jest.fn(),
}))

describe("useFlowScheduledTransactionList", () => {
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

  test("lists transactions for an account", async () => {
    const mockTransactions = [
      {
        id: "1",
        priority: 1,
        executionEffort: "100",
        status: 0,
        fees: "0.001",
        scheduledTimestamp: "1234567890.0",
        handlerTypeIdentifier: "A.123.Handler",
        handlerAddress: "0x123",
      },
    ]

    jest
      .mocked(mockFcl.mockFclInstance.query)
      .mockResolvedValueOnce(mockTransactions)

    const {result} = renderHook(
      () => useFlowScheduledTransactionList({account: "0xACCOUNT"}),
      {
        wrapper: TestProvider,
      }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toHaveLength(1)
    expect(result.current.data?.[0].id).toBe("1")
    expect(result.current.data?.[0].priority).toBe(
      ScheduledTransactionPriority.Medium
    )
    expect(result.current.data?.[0].status).toBe(
      ScheduledTransactionStatus.Pending
    )
    expect(mockFcl.mockFclInstance.query).toHaveBeenCalled()
  })

  test("lists transactions with handler data", async () => {
    const mockTransactionsWithHandler = [
      {
        id: "1",
        priority: 2,
        executionEffort: "200",
        status: 1,
        fees: "0.002",
        scheduledTimestamp: "1234567890.0",
        handlerTypeIdentifier: "A.456.Handler",
        handlerAddress: "0x456",
        handlerUUID: "9999",
        handlerResolvedViews: {display: {name: "Test"}},
      },
    ]

    jest
      .mocked(mockFcl.mockFclInstance.query)
      .mockResolvedValueOnce(mockTransactionsWithHandler)

    const {result} = renderHook(
      () =>
        useFlowScheduledTransactionList({
          account: "0xACCOUNT",
          includeHandlerData: true,
        }),
      {
        wrapper: TestProvider,
      }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toHaveLength(1)
    expect(result.current.data?.[0].id).toBe("1")
    expect(result.current.data?.[0].handlerUUID).toBe("9999")
    expect(result.current.data?.[0].handlerResolvedViews).toEqual({
      display: {name: "Test"},
    })
    expect(mockFcl.mockFclInstance.query).toHaveBeenCalled()
  })

  test("returns empty array when no transactions", async () => {
    jest.mocked(mockFcl.mockFclInstance.query).mockResolvedValueOnce([])

    const {result} = renderHook(
      () => useFlowScheduledTransactionList({account: "0xACCOUNT"}),
      {
        wrapper: TestProvider,
      }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual([])
    expect(mockFcl.mockFclInstance.query).toHaveBeenCalled()
  })

  test("is disabled when no account provided", async () => {
    const {result} = renderHook(() => useFlowScheduledTransactionList(), {
      wrapper: TestProvider,
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
      () => useFlowScheduledTransactionList({account: "0xACCOUNT"}),
      {
        wrapper: TestProvider,
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
      () => useFlowScheduledTransactionList({account: "0xACCOUNT"}),
      {
        wrapper: TestProvider,
      }
    )

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(result.current.error).toEqual(error)
  })

  test("uses custom flowClient when provided", async () => {
    const customMockFcl = createMockFclInstance()
    const customFlowClient = customMockFcl.mockFclInstance as any

    jest.mocked(customFlowClient.query).mockResolvedValueOnce([])

    const {result} = renderHook(
      () =>
        useFlowScheduledTransactionList({
          account: "0xACCOUNT",
          flowClient: customFlowClient,
        }),
      {
        wrapper: TestProvider,
      }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(customFlowClient.query).toHaveBeenCalled()
  })

  test("respects query options enabled flag", async () => {
    const {result} = renderHook(
      () =>
        useFlowScheduledTransactionList({
          account: "0xACCOUNT",
          query: {enabled: false},
        }),
      {
        wrapper: TestProvider,
      }
    )

    await waitFor(() => expect(result.current.isPending).toBe(true))

    expect(result.current.data).toBeUndefined()
    expect(mockFcl.mockFclInstance.query).not.toHaveBeenCalled()
  })
})
