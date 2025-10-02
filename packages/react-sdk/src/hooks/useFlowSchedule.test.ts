import * as fcl from "@onflow/fcl"
import {renderHook} from "@testing-library/react"
import {createMockFclInstance, MockFclInstance} from "../__mocks__/flow-client"
import {FlowProvider} from "../provider"
import {useFlowChainId} from "./useFlowChainId"
import {
  ScheduledTxInfoWithHandler,
  ScheduledTxPriority,
  ScheduledTxStatus,
  useFlowSchedule,
} from "./useFlowSchedule"

jest.mock("@onflow/fcl", () => require("../__mocks__/fcl").default)
jest.mock("./useFlowChainId", () => ({
  useFlowChainId: jest.fn(),
}))

describe("useFlowSchedule", () => {
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

  describe("listScheduledTx", () => {
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

      const {result} = renderHook(() => useFlowSchedule(), {
        wrapper: FlowProvider,
      })

      const transactions = await result.current.listScheduledTx("0xACCOUNT")

      expect(transactions).toHaveLength(1)
      expect(transactions[0].id).toBe(1n)
      expect(transactions[0].priority).toBe(ScheduledTxPriority.Medium)
      expect(transactions[0].status).toBe(ScheduledTxStatus.Pending)
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

      const {result} = renderHook(() => useFlowSchedule(), {
        wrapper: FlowProvider,
      })

      const transactions = (await result.current.listScheduledTx("0xACCOUNT", {
        includeHandlerData: true,
      })) as ScheduledTxInfoWithHandler[]

      expect(transactions).toHaveLength(1)
      expect(transactions[0].id).toBe(1n)
      expect(transactions[0].handlerUUID).toBe(9999n)
      expect(transactions[0].handlerResolvedViews).toEqual({
        display: {name: "Test"},
      })
      expect(mockFcl.mockFclInstance.query).toHaveBeenCalled()
    })

    test("returns empty array when no transactions", async () => {
      jest.mocked(mockFcl.mockFclInstance.query).mockResolvedValueOnce([])

      const {result} = renderHook(() => useFlowSchedule(), {
        wrapper: FlowProvider,
      })

      const transactions = await result.current.listScheduledTx("0xACCOUNT")

      expect(transactions).toEqual([])
      expect(mockFcl.mockFclInstance.query).toHaveBeenCalled()
    })

    test("throws error when chain ID not detected", async () => {
      jest.mocked(useFlowChainId).mockReturnValue({
        data: null,
        isLoading: false,
      } as any)

      const {result} = renderHook(() => useFlowSchedule(), {
        wrapper: FlowProvider,
      })

      await expect(result.current.listScheduledTx("0xACCOUNT")).rejects.toThrow(
        "Chain ID not detected"
      )
    })

    test("handles query errors", async () => {
      const error = new Error("Query failed")
      jest.mocked(mockFcl.mockFclInstance.query).mockRejectedValueOnce(error)

      const {result} = renderHook(() => useFlowSchedule(), {
        wrapper: FlowProvider,
      })

      await expect(result.current.listScheduledTx("0xACCOUNT")).rejects.toThrow(
        "Failed to list transactions: Query failed"
      )
    })
  })

  describe("getScheduledTx", () => {
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

      const {result} = renderHook(() => useFlowSchedule(), {
        wrapper: FlowProvider,
      })

      const transaction = await result.current.getScheduledTx(42n)

      expect(transaction).toBeDefined()
      expect(transaction?.id).toBe(42n)
      expect(transaction?.priority).toBe(ScheduledTxPriority.Low)
      expect(transaction?.status).toBe(ScheduledTxStatus.Completed)
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

      const {result} = renderHook(() => useFlowSchedule(), {
        wrapper: FlowProvider,
      })

      const transaction = (await result.current.getScheduledTx(42n, {
        includeHandlerData: true,
      })) as ScheduledTxInfoWithHandler

      expect(transaction).toBeDefined()
      expect(transaction.id).toBe(42n)
      expect(transaction.handlerUUID).toBe(5555n)
      expect(transaction.handlerResolvedViews).toEqual({
        metadata: {description: "Test handler"},
      })
      expect(mockFcl.mockFclInstance.query).toHaveBeenCalled()
    })

    test("returns null when transaction not found", async () => {
      jest.mocked(mockFcl.mockFclInstance.query).mockResolvedValueOnce(null)

      const {result} = renderHook(() => useFlowSchedule(), {
        wrapper: FlowProvider,
      })

      const transaction = await result.current.getScheduledTx(999n)

      expect(transaction).toBeNull()
      expect(mockFcl.mockFclInstance.query).toHaveBeenCalled()
    })

    test("handles query errors", async () => {
      const error = new Error("Query failed")
      jest.mocked(mockFcl.mockFclInstance.query).mockRejectedValueOnce(error)

      const {result} = renderHook(() => useFlowSchedule(), {
        wrapper: FlowProvider,
      })

      await expect(result.current.getScheduledTx(42n)).rejects.toThrow(
        "Failed to get transaction: Query failed"
      )
    })
  })

  describe("setupScheduler", () => {
    test("sets up manager successfully", async () => {
      const txId = "setup-tx-id-123"
      jest.mocked(mockFcl.mockFclInstance.mutate).mockResolvedValueOnce(txId)

      const {result} = renderHook(() => useFlowSchedule(), {
        wrapper: FlowProvider,
      })

      const returnedTxId = await result.current.setupScheduler()

      expect(returnedTxId).toBe(txId)
      expect(mockFcl.mockFclInstance.mutate).toHaveBeenCalled()
    })

    test("handles setup errors", async () => {
      const error = new Error("Setup failed")
      jest.mocked(mockFcl.mockFclInstance.mutate).mockRejectedValueOnce(error)

      const {result} = renderHook(() => useFlowSchedule(), {
        wrapper: FlowProvider,
      })

      await expect(result.current.setupScheduler()).rejects.toThrow(
        "Failed to setup manager: Setup failed"
      )
    })
  })

  describe("cancelScheduledTx", () => {
    test("cancels a transaction successfully", async () => {
      const txId = "cancel-tx-id-456"
      jest.mocked(mockFcl.mockFclInstance.mutate).mockResolvedValueOnce(txId)

      const {result} = renderHook(() => useFlowSchedule(), {
        wrapper: FlowProvider,
      })

      const returnedTxId = await result.current.cancelScheduledTx(42n)

      expect(returnedTxId).toBe(txId)
      expect(mockFcl.mockFclInstance.mutate).toHaveBeenCalled()
    })

    test("handles cancel errors", async () => {
      const error = new Error("Cancel failed")
      jest.mocked(mockFcl.mockFclInstance.mutate).mockRejectedValueOnce(error)

      const {result} = renderHook(() => useFlowSchedule(), {
        wrapper: FlowProvider,
      })

      await expect(result.current.cancelScheduledTx(42n)).rejects.toThrow(
        "Failed to cancel transaction: Cancel failed"
      )
    })
  })

  test("uses custom flowClient when provided", async () => {
    const customMockFcl = createMockFclInstance()
    const customFlowClient = customMockFcl.mockFclInstance as any

    jest.mocked(customFlowClient.query).mockResolvedValueOnce([])

    const {result} = renderHook(
      () => useFlowSchedule({flowClient: customFlowClient}),
      {
        wrapper: FlowProvider,
      }
    )

    await result.current.listScheduledTx("0xACCOUNT")

    expect(customFlowClient.query).toHaveBeenCalled()
  })
})
