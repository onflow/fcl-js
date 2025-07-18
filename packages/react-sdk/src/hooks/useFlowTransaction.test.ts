import {renderHook, act, waitFor} from "@testing-library/react"
import * as fcl from "@onflow/fcl"
import {FlowProvider} from "../provider"
import {useFlowTransaction} from "./useFlowTransaction"
import type {Interaction, Transaction} from "@onflow/typedefs"
import {createMockFclInstance, MockFclInstance} from "../__mocks__/fclInstance"

jest.mock("@onflow/fcl", () => require("../__mocks__/fcl").default)

describe("useFlowTransaction", () => {
  let mockFcl: MockFclInstance
  beforeEach(() => {
    mockFcl = createMockFclInstance()
    jest.mocked(fcl.createFcl).mockReturnValue(mockFcl.mockFclInstance)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test("does nothing when no txId is provided", () => {
    const {result} = renderHook(() => useFlowTransaction({}), {
      wrapper: FlowProvider,
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toBeNull()
    expect(result.current.error).toBeNull()
  })

  test("fetches transaction when txId is provided", async () => {
    const mockTransaction: Partial<Transaction> = {
      script: "transaction { }",
      args: [],
      referenceBlockId: "123456",
      gasLimit: 1000,
      proposalKey: {
        address: "0x123",
        keyId: 0,
        sequenceNumber: 1,
      },
      payer: "0x123",
      proposer: "0x123",
      authorizers: ["0x123"],
      payloadSignatures: [],
      envelopeSignatures: [],
    }

    const mockInteraction: Partial<Interaction> = {
      tag: "GET_TRANSACTION" as any,
      transaction: {id: "abc123"},
    }

    const getTransactionMock = jest.mocked(fcl.getTransaction)
    getTransactionMock.mockReturnValue(mockInteraction as any)

    const sendMock = jest.mocked(mockFcl.mockFclInstance.send)
    sendMock.mockResolvedValue(mockTransaction)

    const decodeMock = jest.mocked(mockFcl.mockFclInstance.decode)
    decodeMock.mockResolvedValue(mockTransaction)

    let hookResult: any

    await act(async () => {
      const {result} = renderHook(() => useFlowTransaction({txId: "abc123"}), {
        wrapper: FlowProvider,
      })
      hookResult = result
    })

    expect(hookResult.current.data).toBeNull()

    await waitFor(() => expect(hookResult.current.isLoading).toBe(false))

    expect(hookResult.current.data).toEqual(mockTransaction)
    expect(hookResult.current.error).toBeNull()
    expect(getTransactionMock).toHaveBeenCalledWith("abc123")
    expect(sendMock).toHaveBeenCalledWith([mockInteraction])
  })

  test("handles error when fetching transaction fails", async () => {
    const testError = new Error("Failed to fetch transaction")

    const mockInteraction: Partial<Interaction> = {
      tag: "GET_TRANSACTION" as any,
      transaction: {id: "def456"},
    }

    const getTransactionMock = jest.mocked(fcl.getTransaction)
    getTransactionMock.mockReturnValue(mockInteraction as any)

    const sendMock = jest.mocked(mockFcl.mockFclInstance.send)
    sendMock.mockResolvedValue({})

    const decodeMock = jest.mocked(mockFcl.mockFclInstance.decode)
    decodeMock.mockRejectedValue(testError)

    let hookResult: any

    await act(async () => {
      const {result} = renderHook(() => useFlowTransaction({txId: "def456"}), {
        wrapper: FlowProvider,
      })
      hookResult = result
    })

    expect(hookResult.current.error).toBeNull()
    expect(hookResult.current.data).toBeNull()

    await waitFor(() => expect(hookResult.current.isLoading).toBe(false))

    expect(hookResult.current.data).toBeNull()
    expect(hookResult.current.error).not.toBeNull()
    expect(hookResult.current.error?.message).toEqual(
      "Failed to fetch transaction"
    )
    expect(getTransactionMock).toHaveBeenCalledWith("def456")
    expect(sendMock).toHaveBeenCalledWith([mockInteraction])
  })

  test("refetch function works correctly", async () => {
    const mockTransaction: Partial<Transaction> = {
      script: "transaction { }",
      args: [],
      referenceBlockId: "123456",
      gasLimit: 1000,
      proposalKey: {
        address: "0x123",
        keyId: 0,
        sequenceNumber: 1,
      },
      payer: "0x123",
      proposer: "0x123",
      authorizers: ["0x123"],
      payloadSignatures: [],
      envelopeSignatures: [],
    }

    const updatedTransaction: Partial<Transaction> = {
      ...mockTransaction,
      gasLimit: 2000,
    }

    const mockInteraction: Partial<Interaction> = {
      tag: "GET_TRANSACTION" as any,
      transaction: {id: "abc123"},
    }

    const getTransactionMock = jest.mocked(fcl.getTransaction)
    getTransactionMock.mockReturnValue(mockInteraction as any)

    const sendMock = jest.mocked(mockFcl.mockFclInstance.send)
    sendMock.mockResolvedValue(mockTransaction)

    const decodeMock = jest.mocked(mockFcl.mockFclInstance.decode)
    decodeMock.mockResolvedValueOnce(mockTransaction)
    decodeMock.mockResolvedValueOnce(updatedTransaction)

    let hookResult: any
    await act(async () => {
      const {result} = renderHook(() => useFlowTransaction({txId: "abc123"}), {
        wrapper: FlowProvider,
      })
      hookResult = result
    })

    await waitFor(() => {
      expect(hookResult.current.isLoading).toBe(false)
    })

    expect(hookResult.current.data).toEqual(mockTransaction)

    act(() => {
      hookResult.current.refetch()
    })

    await waitFor(() => {
      expect(hookResult.current.data?.gasLimit).toBe(2000)
    })

    expect(hookResult.current.data).toEqual(updatedTransaction)
    expect(getTransactionMock).toHaveBeenCalledTimes(2)
    expect(sendMock).toHaveBeenCalledTimes(2)
    expect(sendMock).toHaveBeenCalledWith([mockInteraction])
  })
})
