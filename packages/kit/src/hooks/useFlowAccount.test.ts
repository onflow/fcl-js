import {renderHook, act, waitFor} from "@testing-library/react"
import * as fcl from "@onflow/fcl"
import {FlowProvider} from "../provider"
import {useFlowAccount} from "./useFlowAccount"
import {Account} from "@onflow/typedefs"

jest.mock("@onflow/fcl", () => require("../__mocks__/fcl").default)

describe("useFlowAccount", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test("does nothing when no address is provided", () => {
    const {result} = renderHook(() => useFlowAccount(), {
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
      const {result} = renderHook(() => useFlowAccount("0x1234"), {
        wrapper: FlowProvider,
      })
      hookResult = result
    })

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
      const {result} = renderHook(() => useFlowAccount("0x5678"), {
        wrapper: FlowProvider,
      })
      hookResult = result
    })

    expect(hookResult.current.error).toBeNull()
    expect(hookResult.current.data).toBeNull()

    // Wait for the loading to finish and error to appear
    await waitFor(() => expect(hookResult.current.isLoading).toBe(false))

    // After loading is complete, we should have an error
    expect(hookResult.current.data).toBeNull()
    expect(hookResult.current.error).not.toBeNull()
    expect(hookResult.current.error?.message).toEqual("Failed to fetch account")
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

    let hookResult: any
    await act(async () => {
      const {result} = renderHook(() => useFlowAccount("0x1234"), {
        wrapper: FlowProvider,
      })
      hookResult = result
    })

    await waitFor(() => {
      expect(hookResult.current.isLoading).toBe(false)
    })

    expect(hookResult.current.data).toEqual(mockAccount)

    const updatedAccount = {...mockAccount, balance: 200}
    accountMock.mockResolvedValueOnce(updatedAccount)

    act(() => {
      hookResult.current.refetch()
    })

    await waitFor(() => {
      expect(hookResult.current.data?.balance).toBe(200)
    })

    expect(hookResult.current.data).toEqual(updatedAccount)
    expect(accountMock).toHaveBeenCalledTimes(2)
  })
})
