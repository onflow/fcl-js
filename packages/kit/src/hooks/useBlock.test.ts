import {renderHook, act, waitFor} from "@testing-library/react"
import * as fcl from "@onflow/fcl"
import {FlowProvider} from "../provider"
import {useBlock} from "./useBlock"
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

describe("useBlock", () => {
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
      const {result} = renderHook(() => useBlock(), {
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
})
