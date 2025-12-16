import {renderHook, act, waitFor} from "@testing-library/react"
import {
  TestProvider,
  setMockFlowClient,
  queryClient,
} from "../__mocks__/TestProvider"
import {useFlowTransaction} from "./useFlowTransaction"
import type {Transaction} from "@onflow/typedefs"
import {createMockFclInstance, MockFclInstance} from "../__mocks__/flow-client"

describe("useFlowTransaction", () => {
  let mockFcl: MockFclInstance
  beforeEach(() => {
    queryClient.clear()
    mockFcl = createMockFclInstance()
    setMockFlowClient(mockFcl.mockFclInstance)
  })

  afterEach(() => {
    setMockFlowClient(null)
    jest.clearAllMocks()
  })

  test("does nothing when no txId is provided", () => {
    const {result} = renderHook(() => useFlowTransaction({}), {
      wrapper: TestProvider,
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

    // Set up mock to return transaction via send/decode pattern
    mockFcl.setMockSendResponse(mockTransaction)

    let hookResult: any

    await act(async () => {
      const {result} = renderHook(() => useFlowTransaction({txId: "abc123"}), {
        wrapper: TestProvider,
      })
      hookResult = result
    })

    expect(hookResult.current.data).toBeNull()

    await waitFor(() => expect(hookResult.current.isLoading).toBe(false))

    expect(hookResult.current.data).toEqual(mockTransaction)
    expect(hookResult.current.error).toBeNull()
    expect(mockFcl.mockFclInstance.send).toHaveBeenCalled()
    expect(mockFcl.mockFclInstance.decode).toHaveBeenCalled()
  })

  test("handles error when fetching transaction fails", async () => {
    const testError = new Error("Failed to fetch transaction")

    // Make send reject with error
    mockFcl.mockFclInstance.send = jest.fn().mockRejectedValue(testError)

    let hookResult: any

    await act(async () => {
      const {result} = renderHook(() => useFlowTransaction({txId: "def456"}), {
        wrapper: TestProvider,
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
    expect(mockFcl.mockFclInstance.send).toHaveBeenCalled()
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

    // Set initial response
    mockFcl.setMockSendResponse(mockTransaction)

    let hookResult: any
    await act(async () => {
      const {result} = renderHook(() => useFlowTransaction({txId: "abc123"}), {
        wrapper: TestProvider,
      })
      hookResult = result
    })

    await waitFor(() => {
      expect(hookResult.current.isLoading).toBe(false)
    })

    expect(hookResult.current.data).toEqual(mockTransaction)

    // Update response for refetch
    mockFcl.setMockSendResponse(updatedTransaction)

    act(() => {
      hookResult.current.refetch()
    })

    await waitFor(() => {
      expect(hookResult.current.data?.gasLimit).toBe(2000)
    })

    expect(hookResult.current.data).toEqual(updatedTransaction)
    expect(mockFcl.mockFclInstance.send).toHaveBeenCalledTimes(2)
  })
})
