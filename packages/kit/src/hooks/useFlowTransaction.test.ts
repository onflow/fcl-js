import {renderHook, act, waitFor} from "@testing-library/react"
import * as fcl from "@onflow/fcl"
import {FlowProvider} from "../provider"
import {useFlowTransaction} from "./useFlowTransaction"
import type {Transaction} from "@onflow/typedefs"

jest.mock("@onflow/fcl", () => require("../__mocks__/fcl").default)

describe("useFlowTransaction", () => {
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
    const mockTransaction: Transaction = {
      status: 4,
      statusCode: 0,
      errorMessage: "",
      events: [],
      id: "abc123",
    }

    const getTransactionMock = jest.mocked(fcl.getTransaction)
    getTransactionMock.mockReturnValue({type: "GET_TX"})

    const sendMock = jest.mocked(fcl.send)
    sendMock.mockResolvedValue("txResponse")

    const decodeMock = jest.mocked(fcl.decode)
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
    expect(sendMock).toHaveBeenCalledWith([{type: "GET_TX"}])
  })

  test("handles error when fetching transaction fails", async () => {
    const testError = new Error("Failed to fetch transaction")

    const getTransactionMock = jest.mocked(fcl.getTransaction)
    getTransactionMock.mockReturnValue({type: "GET_TX"})

    const sendMock = jest.mocked(fcl.send)
    sendMock.mockResolvedValue("txResponse")

    const decodeMock = jest.mocked(fcl.decode)
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
    expect(sendMock).toHaveBeenCalledWith([{type: "GET_TX"}])
  })

  test("refetch function works correctly", async () => {
    const mockTransaction: Transaction = {
      status: 1,
      statusCode: 0,
      errorMessage: "",
      events: [],
      id: "abc123",
    }

    const updatedTransaction: Transaction = {
      ...mockTransaction,
      status: 4,
    }

    const getTransactionMock = jest.mocked(fcl.getTransaction)
    getTransactionMock.mockReturnValue({type: "GET_TX"})

    const sendMock = jest.mocked(fcl.send)
    sendMock.mockResolvedValue("txResponse")

    const decodeMock = jest.mocked(fcl.decode)
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
      expect(hookResult.current.data?.status).toBe(4)
    })

    expect(hookResult.current.data).toEqual(updatedTransaction)
    expect(getTransactionMock).toHaveBeenCalledTimes(2)
    expect(sendMock).toHaveBeenCalledTimes(2)
    expect(sendMock).toHaveBeenCalledWith([{type: "GET_TX"}])
  })
})
