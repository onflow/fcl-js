import {renderHook, act, waitFor} from "@testing-library/react"
import * as fcl from "@onflow/fcl"
import {FlowProvider} from "../provider"
import {useAccount} from "./useAccount"
import {Account} from "@onflow/typedefs"

jest.mock("@onflow/fcl", () => {
  const actualFcl = jest.requireActual("@onflow/fcl")
  return {
    ...actualFcl,
    account: jest.fn(),
    config: () => ({
      subscribe: jest.fn(() => () => {}), // Mock subscription to avoid act warning
      load: jest.fn(),
    }),
  }
})

describe("useAccount", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test("does nothing when no address is provided", () => {
    const {result} = renderHook(() => useAccount(), {
      wrapper: FlowProvider,
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toBeNull()
    expect(result.current.error).toBeNull()
  })

  test("fetches account when address is provided", async () => {
    const mockAccount: Account = {
      address: "0x1234",
      balance: 100,
      code: 0,
      contracts: {},
      keys: [],
    }

    const accountMock = jest.mocked(fcl.account)
    accountMock.mockResolvedValueOnce(mockAccount)

    let hookResult: any

    await act(async () => {
      const {result} = renderHook(() => useAccount("0x1234"), {
        wrapper: FlowProvider,
      })
      hookResult = result
    })

    // The query starts running but since we're in an act() block,
    // we need to wait for it to complete
    expect(hookResult.current.data).toBeNull()

    // Wait for the hook to finish loading
    await waitFor(() => expect(hookResult.current.isLoading).toBe(false))

    // After update, the data should be available
    expect(hookResult.current.data).toEqual(mockAccount)
    expect(hookResult.current.error).toBeNull()
    expect(accountMock).toHaveBeenCalledWith("0x1234")
  })

  test("handles error when fetching account fails", async () => {
    const testError = new Error("Failed to fetch account")
    const accountMock = jest.mocked(fcl.account)
    accountMock.mockRejectedValueOnce(testError)

    let hookResult: any

    await act(async () => {
      const {result} = renderHook(() => useAccount("0x5678"), {
        wrapper: FlowProvider,
      })
      hookResult = result
    })

    // Wait until an error appears.
    await waitFor(() => {
      expect(hookResult.current.error).not.toBeNull()
    })

    expect(hookResult.current.data).toBeNull()
    expect(hookResult.current.error?.message).toEqual("Failed to fetch account")
    expect(accountMock).toHaveBeenCalledWith("0x5678")
  })

  // test("refetch function works correctly", async () => {
  //   const mockAccount: Account = {
  //     address: "0x1234",
  //     balance: 100,
  //     code: 0,
  //     contracts: {},
  //     keys: [],
  //   }

  //   const accountMock = jest.mocked(fcl.account)
  //   accountMock.mockResolvedValueOnce(mockAccount)

  //   const {result} = renderHook(() => useAccount("0x1234"))

  //   await waitFor(() => {
  //     expect(result.current.loading).toBe(false)
  //   })

  //   const updatedAccount = {...mockAccount, balance: 200}
  //   accountMock.mockResolvedValueOnce(updatedAccount)

  //   act(() => {
  //     result.current.refetch()
  //   })

  //   // Should be loading again
  //   expect(result.current.loading).toBe(true)

  //   // Wait for refetch to complete
  //   await waitFor(() => {
  //     expect(result.current.loading).toBe(false)
  //   })

  //   // After refetching, it should have the updated account data
  //   expect(result.current.account).toEqual(updatedAccount)
  //   expect(accountMock).toHaveBeenCalledTimes(2)
  // })
})
