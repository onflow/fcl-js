import {renderHook, act, waitFor} from "@testing-library/react"
import * as fcl from "@onflow/fcl"
import {useAccount} from "./useAccount"
import {Account} from "@onflow/typedefs"

jest.mock("@onflow/fcl", () => ({
  account: jest.fn(),
}))

describe("useAccount", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test("does nothing when no address is provided", () => {
    const {result} = renderHook(() => useAccount())

    expect(result.current.loading).toBe(false)
    expect(result.current.account).toBeNull()
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

    const {result} = renderHook(() => useAccount("0x1234"))

    // Initially it should be in loading state
    expect(result.current.loading).toBe(true)
    expect(result.current.account).toBeNull()

    // Wait for the async operation to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // After loading, it should have the account data
    expect(result.current.account).toEqual(mockAccount)
    expect(result.current.error).toBeNull()
    expect(accountMock).toHaveBeenCalledWith("0x1234")
  })

  test("handles error when fetching account fails", async () => {
    const testError = new Error("Failed to fetch account")
    const accountMock = jest.mocked(fcl.account)
    accountMock.mockRejectedValueOnce(testError)

    const {result} = renderHook(() => useAccount("0x5678"))

    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.account).toBeNull()
    expect(result.current.error).toEqual(testError)
    expect(accountMock).toHaveBeenCalledWith("0x5678")
  })

  test("refetch function works correctly", async () => {
    const mockAccount: Account = {
      address: "0x1234",
      balance: 100,
      code: 0,
      contracts: {},
      keys: [],
    }

    const accountMock = jest.mocked(fcl.account)
    accountMock.mockResolvedValueOnce(mockAccount)

    const {result} = renderHook(() => useAccount("0x1234"))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    const updatedAccount = {...mockAccount, balance: 200}
    accountMock.mockResolvedValueOnce(updatedAccount)

    act(() => {
      result.current.refetch()
    })

    // Should be loading again
    expect(result.current.loading).toBe(true)

    // Wait for refetch to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // After refetching, it should have the updated account data
    expect(result.current.account).toEqual(updatedAccount)
    expect(accountMock).toHaveBeenCalledTimes(2)
  })
})
