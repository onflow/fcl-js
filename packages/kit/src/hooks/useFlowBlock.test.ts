import {renderHook, act, waitFor} from "@testing-library/react"
import * as fcl from "@onflow/fcl"
import {FlowProvider} from "../provider"
import {useFlowBlock} from "./useFlowBlock"
import {Block} from "@onflow/typedefs"

jest.mock("@onflow/fcl", () => {
  const actualFcl = jest.requireActual("@onflow/fcl")
  return {
    ...actualFcl,
    block: jest.fn(),
    config: () => ({
      subscribe: jest.fn(() => () => {}),
      load: jest.fn(),
    }),
  }
})

describe("useFlowBlock", () => {
  const mockLatestBlock: Block = {
    id: "latest-block-id",
    parentId: "parent-id",
    height: 100,
    timestamp: "2023-01-01T00:00:00Z",
    collectionGuarantees: [],
    blockSeals: [],
    signatures: [],
  }

  const mockSealedBlock: Block = {
    id: "sealed-block-id",
    parentId: "parent-id",
    height: 99,
    timestamp: "2023-01-01T00:00:00Z",
    collectionGuarantees: [],
    blockSeals: [],
    signatures: [],
  }

  const mockBlockById: Block = {
    id: "specific-block-id",
    parentId: "parent-id",
    height: 50,
    timestamp: "2023-01-01T00:00:00Z",
    collectionGuarantees: [],
    blockSeals: [],
    signatures: [],
  }

  const mockBlockByHeight: Block = {
    id: "block-at-height-75",
    parentId: "parent-id",
    height: 75,
    timestamp: "2023-01-01T00:00:00Z",
    collectionGuarantees: [],
    blockSeals: [],
    signatures: [],
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  test("fetches the latest block when no parameters are provided", async () => {
    const blockMock = jest.mocked(fcl.block)
    blockMock.mockResolvedValueOnce(mockLatestBlock)

    let hookResult: any

    await act(async () => {
      const {result} = renderHook(() => useFlowBlock(), {
        wrapper: FlowProvider,
      })
      hookResult = result
    })

    expect(hookResult.current.data).toBeNull()

    // Wait for the hook to finish loading
    await waitFor(() => expect(hookResult.current.isLoading).toBe(false))

    // After update, the data should be available
    expect(hookResult.current.data).toEqual(mockLatestBlock)
    expect(hookResult.current.error).toBeNull()
    expect(hookResult.current.data).toEqual(mockLatestBlock)
  })

  test("fetches the latest sealed block when sealed is true", async () => {
    const blockMock = jest.mocked(fcl.block)
    blockMock.mockResolvedValueOnce(mockSealedBlock)

    let hookResult: any

    await act(async () => {
      const {result} = renderHook(() => useFlowBlock({sealed: true}), {
        wrapper: FlowProvider,
      })
      hookResult = result
    })

    await waitFor(() => expect(hookResult.current.isLoading).toBe(false))

    expect(hookResult.current.data).toEqual(mockSealedBlock)
    expect(blockMock).toHaveBeenCalledWith({sealed: true})
  })

  test("fetches a block by ID", async () => {
    const blockId = "specific-block-id"
    const blockMock = jest.mocked(fcl.block)
    blockMock.mockResolvedValueOnce(mockBlockById)

    let hookResult: any

    await act(async () => {
      const {result} = renderHook(() => useFlowBlock({id: blockId}), {
        wrapper: FlowProvider,
      })
      hookResult = result
    })

    await waitFor(() => expect(hookResult.current.isLoading).toBe(false))

    expect(hookResult.current.data).toEqual(mockBlockById)
    expect(blockMock).toHaveBeenCalledWith({id: blockId})
  })

  test("fetches a block by height", async () => {
    const height = 75
    const blockMock = jest.mocked(fcl.block)
    blockMock.mockResolvedValueOnce(mockBlockByHeight)

    let hookResult: any

    await act(async () => {
      const {result} = renderHook(() => useFlowBlock({height}), {
        wrapper: FlowProvider,
      })
      hookResult = result
    })

    await waitFor(() => expect(hookResult.current.isLoading).toBe(false))

    expect(hookResult.current.data).toEqual(mockBlockByHeight)
    expect(blockMock).toHaveBeenCalledWith({height})
  })

  test("handles error when fetching block fails", async () => {
    const testError = new Error("Failed to fetch block")

    const blockMock = jest.mocked(fcl.block)
    blockMock.mockRejectedValueOnce(testError)

    let hookResult: any

    await act(async () => {
      const {result} = renderHook(() => useFlowBlock({id: "invalid-id"}), {
        wrapper: FlowProvider,
      })
      hookResult = result
    })

    await waitFor(() => expect(hookResult.current.isLoading).toBe(false))

    expect(hookResult.current.data).toBeNull()
    expect(hookResult.current.error).toEqual(testError)
  })

  test("refetch function works correctly", async () => {
    const blockMock = jest.mocked(fcl.block)
    blockMock.mockResolvedValueOnce(mockLatestBlock)

    let hookResult: any

    await act(async () => {
      const {result} = renderHook(() => useFlowBlock(), {
        wrapper: FlowProvider,
      })
      hookResult = result
    })

    await waitFor(() =>
      expect(hookResult.current.data).toEqual(mockLatestBlock)
    )

    const newLatestBlock = {...mockLatestBlock, height: 101}
    blockMock.mockResolvedValueOnce(newLatestBlock)

    act(() => {
      hookResult.current.refetch()
    })

    await waitFor(() => expect(hookResult.current.data).toEqual(newLatestBlock))

    expect(fcl.block).toHaveBeenCalledTimes(2)
  })

  test("updates when parameters change", async () => {
    const blockMock = jest.mocked(fcl.block)
    blockMock.mockResolvedValueOnce(mockLatestBlock)

    let hookResult: any

    await act(async () => {
      const {result} = renderHook(() => useFlowBlock(), {
        wrapper: FlowProvider,
      })
      hookResult = result
    })

    await waitFor(() =>
      expect(hookResult.current.data).toEqual(mockLatestBlock)
    )

    const newLatestBlock = {...mockLatestBlock, height: 101}
    blockMock.mockResolvedValueOnce(newLatestBlock)

    act(() => {
      hookResult.current.refetch()
    })

    await waitFor(() => expect(hookResult.current.data).toEqual(newLatestBlock))

    expect(fcl.block).toHaveBeenCalledTimes(2)
  })
})
