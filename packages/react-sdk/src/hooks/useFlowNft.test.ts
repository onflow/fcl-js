import {renderHook, act, waitFor} from "@testing-library/react"
import * as fcl from "@onflow/fcl"
import {FlowProvider} from "../provider"
import {useFlowNft, NftViewResult} from "./useFlowNft"
import {createMockFclInstance, MockFclInstance} from "../__mocks__/flow-client"

jest.mock("@onflow/fcl", () => require("../__mocks__/fcl").default)

describe("useFlowNft", () => {
  let mockFcl: MockFclInstance

  beforeEach(() => {
    mockFcl = createMockFclInstance()
    jest.mocked(fcl.createFlowClient).mockReturnValue(mockFcl.mockFclInstance)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test("returns null data when required params are missing", async () => {
    const queryMock = jest.mocked(mockFcl.mockFclInstance.query)
    queryMock.mockResolvedValueOnce(null)

    let hookResult: any

    await act(async () => {
      const {result} = renderHook(() => useFlowNft({}), {
        wrapper: FlowProvider,
      })
      hookResult = result
    })

    await waitFor(() => expect(hookResult.current.isLoading).toBe(false))

    expect(hookResult.current.data).toBeNull()
    expect(hookResult.current.error).toBeNull()
  })

  test("fetches NFT metadata when all params are provided", async () => {
    const mockNftData = {
      name: "Test NFT",
      description: "A test NFT",
      thumbnail: {url: "https://example.com/nft.png"},
      externalURL: "https://example.com/nft/123",
      collectionDisplay: {
        name: "Test Collection",
        externalURL: {url: "https://example.com/collection"}
      },
      rarity: "Rare",
      traits: {color: "blue", size: "large"},
      serialNumber: "123"
    }

    const queryMock = jest.mocked(mockFcl.mockFclInstance.query)
    queryMock.mockResolvedValueOnce(mockNftData)

    let hookResult: any

    await act(async () => {
      const {result} = renderHook(() => useFlowNft({
        accountAddress: "0x1234",
        tokenId: "123", 
        publicPathIdentifier: "examplenftcollection"
      }), {
        wrapper: FlowProvider,
      })
      hookResult = result
    })

    expect(hookResult.current.data).toBeNull()

    await waitFor(() => expect(hookResult.current.isLoading).toBe(false))

    const expectedResult: NftViewResult = {
      name: "Test NFT",
      description: "A test NFT",
      thumbnailUrl: "https://example.com/nft.png",
      externalUrl: "https://example.com/nft/123",
      collectionName: "Test Collection",
      collectionExternalUrl: "https://example.com/collection",
      tokenID: "123",
      traits: {color: "blue", size: "large"},
      rarity: "Rare",
      serialNumber: "123"
    }

    expect(hookResult.current.data).toEqual(expectedResult)
    expect(hookResult.current.error).toBeNull()
    expect(queryMock).toHaveBeenCalledWith(
      expect.objectContaining({
        cadence: expect.stringContaining("NonFungibleToken"),
        args: expect.any(Function)
      })
    )
  })

  test("handles missing NFT data gracefully", async () => {
    const queryMock = jest.mocked(mockFcl.mockFclInstance.query)
    queryMock.mockResolvedValueOnce(null)

    let hookResult: any

    await act(async () => {
      const {result} = renderHook(() => useFlowNft({
        accountAddress: "0x1234",
        tokenId: "999",
        publicPathIdentifier: "examplenftcollection"
      }), {
        wrapper: FlowProvider,
      })
      hookResult = result
    })

    await waitFor(() => expect(hookResult.current.isLoading).toBe(false))

    expect(hookResult.current.data).toBeNull()
    expect(hookResult.current.error).toBeNull()
  })

  test("handles error when fetching NFT fails", async () => {
    const testError = new Error("Failed to fetch NFT")
    const queryMock = jest.mocked(mockFcl.mockFclInstance.query)
    queryMock.mockRejectedValueOnce(testError)

    let hookResult: any

    await act(async () => {
      const {result} = renderHook(() => useFlowNft({
        accountAddress: "0x5678",
        tokenId: "123",
        publicPathIdentifier: "examplenftcollection"
      }), {
        wrapper: FlowProvider,
      })
      hookResult = result
    })

    expect(hookResult.current.error).toBeNull()
    expect(hookResult.current.data).toBeNull()

    await waitFor(() => expect(hookResult.current.isLoading).toBe(false))

    expect(hookResult.current.data).toBeNull()
    expect(hookResult.current.error).not.toBeNull()
    expect(hookResult.current.error?.message).toEqual("Failed to fetch NFT")
  })

  test("processes IPFS thumbnails correctly", async () => {
    const mockNftData = {
      name: "IPFS NFT",
      description: "An NFT with IPFS thumbnail",
      thumbnail: {
        cid: "QmTest123",
        path: "/image.png"
      },
      externalURL: null,
      collectionDisplay: null,
      rarity: null,
      traits: {},
      serialNumber: null
    }

    const queryMock = jest.mocked(mockFcl.mockFclInstance.query)
    queryMock.mockResolvedValueOnce(mockNftData)

    let hookResult: any

    await act(async () => {
      const {result} = renderHook(() => useFlowNft({
        accountAddress: "0x1234",
        tokenId: "123",
        publicPathIdentifier: "examplenftcollection"
      }), {
        wrapper: FlowProvider,
      })
      hookResult = result
    })

    await waitFor(() => expect(hookResult.current.isLoading).toBe(false))

    expect(hookResult.current.data?.thumbnailUrl).toBe("https://ipfs.io/ipfs/QmTest123/image.png")
    expect(hookResult.current.data?.name).toBe("IPFS NFT")
  })

  test("refetch function works correctly", async () => {
    const initialNftData = {
      name: "Initial NFT",
      description: "Initial description",
      thumbnail: {url: "https://example.com/initial.png"},
      externalURL: null,
      collectionDisplay: null,
      rarity: null,
      traits: {},
      serialNumber: "123"
    }

    const queryMock = jest.mocked(mockFcl.mockFclInstance.query)
    queryMock.mockResolvedValueOnce(initialNftData)

    let hookResult: any
    await act(async () => {
      const {result} = renderHook(() => useFlowNft({
        accountAddress: "0x1234",
        tokenId: "123",
        publicPathIdentifier: "examplenftcollection"
      }), {
        wrapper: FlowProvider,
      })
      hookResult = result
    })

    await waitFor(() => {
      expect(hookResult.current.isLoading).toBe(false)
    })

    expect(hookResult.current.data?.name).toBe("Initial NFT")

    const updatedNftData = {...initialNftData, name: "Updated NFT"}
    queryMock.mockResolvedValueOnce(updatedNftData)

    act(() => {
      hookResult.current.refetch()
    })

    await waitFor(() => {
      expect(hookResult.current.data?.name).toBe("Updated NFT")
    })

    expect(queryMock).toHaveBeenCalledTimes(2)
  })
})