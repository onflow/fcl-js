import {renderHook, act, waitFor} from "@testing-library/react"
import * as fcl from "@onflow/fcl"
import {FlowProvider} from "../provider"
import {useFlowChainId} from "./useFlowChainId"
import {createMockFclInstance, MockFclInstance} from "../__mocks__/flow-client"

jest.mock("@onflow/fcl", () => require("../__mocks__/fcl").default)

describe("useFlowChainId", () => {
  let mockFcl: MockFclInstance
  const mockChainId = "mainnet"

  beforeEach(() => {
    mockFcl = createMockFclInstance()
    jest.mocked(fcl.createFlowClient).mockReturnValue(mockFcl.mockFclInstance)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test("fetches the chain ID successfully", async () => {
    const getChainIdMock = jest.mocked(mockFcl.mockFclInstance.getChainId)
    getChainIdMock.mockResolvedValueOnce(mockChainId)

    let hookResult: any

    await act(async () => {
      const {result} = renderHook(() => useFlowChainId(), {
        wrapper: FlowProvider,
      })
      hookResult = result
    })

    expect(hookResult.current.data).toBeNull()

    // Wait for the hook to finish loading
    await waitFor(() => expect(hookResult.current.isLoading).toBe(false))

    // After update, the data should be available
    expect(hookResult.current.data).toEqual(mockChainId)
    expect(hookResult.current.error).toBeNull()
    expect(getChainIdMock).toHaveBeenCalledTimes(1)
  })

  test("handles error when fetching chain ID fails", async () => {
    const testError = new Error("Failed to fetch chain ID")
    const getChainIdMock = jest.mocked(mockFcl.mockFclInstance.getChainId)
    getChainIdMock.mockRejectedValueOnce(testError)

    let hookResult: any

    await act(async () => {
      const {result} = renderHook(() => useFlowChainId(), {
        wrapper: FlowProvider,
      })
      hookResult = result
    })

    await waitFor(() => expect(hookResult.current.isLoading).toBe(false))

    expect(hookResult.current.data).toBeNull()
    expect(hookResult.current.error).toEqual(testError)
    expect(getChainIdMock).toHaveBeenCalledTimes(1)
  })

  test("refetch function works correctly", async () => {
    const getChainIdMock = jest.mocked(mockFcl.mockFclInstance.getChainId)
    getChainIdMock.mockResolvedValueOnce(mockChainId)

    let hookResult: any

    await act(async () => {
      const {result} = renderHook(() => useFlowChainId(), {
        wrapper: FlowProvider,
      })
      hookResult = result
    })

    await waitFor(() => expect(hookResult.current.data).toEqual(mockChainId))

    const newChainId = "testnet"
    getChainIdMock.mockResolvedValueOnce(newChainId)

    act(() => {
      hookResult.current.refetch()
    })

    await waitFor(() => expect(hookResult.current.data).toEqual(newChainId))

    expect(mockFcl.mockFclInstance.getChainId).toHaveBeenCalledTimes(2)
  })

  test("respects custom query options", async () => {
    const getChainIdMock = jest.mocked(mockFcl.mockFclInstance.getChainId)
    getChainIdMock.mockResolvedValueOnce(mockChainId)

    const customOptions = {
      enabled: false,
      staleTime: 1000,
    }

    let hookResult: any

    await act(async () => {
      const {result} = renderHook(
        () => useFlowChainId({query: customOptions}),
        {
          wrapper: FlowProvider,
        }
      )
      hookResult = result
    })

    // Since enabled is false, the query should not run
    expect(getChainIdMock).not.toHaveBeenCalled()
    expect(hookResult.current.data).toBeNull()
  })
})
