import {AccountManager} from "./account-manager"
import {mockUser} from "../__mocks__/fcl"
import * as fcl from "@onflow/fcl"
import {CurrentUser} from "@onflow/typedefs"

jest.mock("@onflow/fcl", () => {
  const fcl = jest.requireActual("@onflow/fcl")
  return {
    withPrefix: fcl.withPrefix,
    sansPrefix: fcl.sansPrefix,
    tx: jest.fn(),
    mutate: jest.fn(),
    query: jest.fn(),
  }
})

const mockFcl = jest.mocked(fcl)
const mockQuery = jest.mocked(fcl.query)

describe("AccountManager", () => {
  let accountManager: AccountManager
  let user: jest.Mocked<typeof fcl.currentUser>

  beforeEach(() => {
    user = mockUser()
    accountManager = new AccountManager(user)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should initialize with null COA address", () => {
    expect(accountManager.getCOAAddress()).toBeNull()
    expect(accountManager.getAccounts()).toEqual([])
  })

  it("should reset state when the user is not logged in", async () => {
    user.snapshot.mockResolvedValueOnce({addr: undefined} as CurrentUser)

    await accountManager.updateCOAAddress()

    expect(accountManager.getCOAAddress()).toBeNull()
    expect(accountManager.getAccounts()).toEqual([])
  })

  it("should fetch and update COA address when user logs in", async () => {
    user.snapshot.mockResolvedValue({addr: "0x1"} as CurrentUser)
    mockQuery.mockResolvedValue("0x123")

    await accountManager.updateCOAAddress()

    expect(accountManager.getCOAAddress()).toBe("0x123")
    expect(accountManager.getAccounts()).toEqual(["0x123"])
    expect(fcl.query).toHaveBeenCalledWith({
      cadence: expect.any(String),
      args: expect.any(Function),
    })
  })

  it("should not update COA address if user has not changed and force is false", async () => {
    user.snapshot.mockResolvedValue({addr: "0x1"} as CurrentUser)
    mockQuery.mockResolvedValue("0x123")
    user.subscribe.mockImplementation(fn => {
      fn({addr: "0x1"})
      return () => {}
    })

    await accountManager.updateCOAAddress()
    expect(accountManager.getCOAAddress()).toBe("0x123")
    expect(fcl.query).toHaveBeenCalledTimes(1)

    // Re-run without changing the address
    await accountManager.updateCOAAddress()
    expect(accountManager.getCOAAddress()).toBe("0x123")
    expect(fcl.query).toHaveBeenCalledTimes(1) // Should not have fetched again
  })

  it("should force update COA address even if user has not changed", async () => {
    user.snapshot.mockResolvedValue({addr: "0x1"} as CurrentUser)
    mockQuery.mockResolvedValue("0x123")
    user.subscribe.mockImplementation(fn => {
      fn({addr: "0x1"})
      return () => {}
    })

    await accountManager.updateCOAAddress()
    expect(fcl.query).toHaveBeenCalledTimes(1)

    // Force update
    await accountManager.updateCOAAddress(true)
    expect(fcl.query).toHaveBeenCalledTimes(2)
  })

  it("should not update COA address if fetch is outdated when user changes", async () => {
    // Simulates the user address changing from 0x1 to 0x2
    user.snapshot
      .mockResolvedValueOnce({addr: "0x1"} as CurrentUser) // for 1st call
      .mockResolvedValueOnce({addr: "0x2"} as CurrentUser) // for 2nd call

    mockQuery
      // 1st fetch: delayed
      .mockImplementationOnce(
        () => new Promise(resolve => setTimeout(() => resolve("0x123"), 500))
      )
      // 2nd fetch: immediate
      .mockResolvedValueOnce("0x456")

    const updatePromise1 = accountManager.updateCOAAddress()
    const updatePromise2 = accountManager.updateCOAAddress()
    await Promise.all([updatePromise1, updatePromise2])

    // The second fetch (for address 0x2) is the latest, so "0x456"
    expect(accountManager.getCOAAddress()).toBe("0x456")
  })

  it("should clear COA address if fetch fails and is the latest", async () => {
    user.snapshot.mockResolvedValueOnce({addr: "0x1"} as CurrentUser)
    mockQuery.mockRejectedValueOnce(new Error("Fetch failed"))

    await expect(accountManager.updateCOAAddress()).rejects.toThrow(
      "Fetch failed"
    )

    expect(await accountManager.getCOAAddress()).toBeNull()
  })

  it("should handle user changes correctly", async () => {
    user.snapshot
      .mockResolvedValueOnce({addr: "0x1"} as CurrentUser)
      .mockResolvedValueOnce({addr: "0x2"} as CurrentUser)

    mockQuery
      .mockResolvedValueOnce("0x123") // for user 0x1
      .mockResolvedValueOnce("0x456") // for user 0x2

    await accountManager.updateCOAAddress()
    expect(accountManager.getCOAAddress()).toBe("0x123")

    await accountManager.updateCOAAddress()
    expect(accountManager.getCOAAddress()).toBe("0x456")
  })

  it("should call the callback with updated accounts in subscribe", async () => {
    user.snapshot.mockResolvedValue({addr: "0x1"} as CurrentUser)
    mockQuery.mockResolvedValue("0x123")

    const callback = jest.fn()
    user.subscribe.mockImplementation(fn => {
      fn({addr: "0x1"})
      return () => {}
    })

    mockQuery.mockResolvedValueOnce("0x123")

    accountManager.subscribe(callback)

    await new Promise(setImmediate)

    expect(callback).toHaveBeenCalledWith(["0x123"])
  })

  it("should reset accounts in subscribe if user is not authenticated", () => {
    mockQuery.mockResolvedValue("0x123")
    user.snapshot.mockResolvedValue({addr: undefined} as CurrentUser)

    const callback = jest.fn()

    user.subscribe.mockImplementation(fn => {
      fn({addr: null})
      return () => {}
    })

    accountManager.subscribe(callback)

    expect(callback).toHaveBeenCalledWith([])
  })

  it("should call the callback when COA address is updated", async () => {
    const callback = jest.fn()

    user.snapshot.mockResolvedValueOnce({addr: "0x1"} as CurrentUser)

    user.subscribe.mockImplementation(fn => {
      fn({addr: "0x1"} as CurrentUser)
      return () => {}
    })

    mockQuery.mockResolvedValueOnce("0x123")

    accountManager.subscribe(callback)

    await new Promise(setImmediate)

    expect(callback).toHaveBeenCalledWith(["0x123"])
  })

  it("should return an empty array when COA address is null", () => {
    expect(accountManager.getAccounts()).toEqual([])
  })

  it("should return COA address array when available", async () => {
    user.snapshot.mockResolvedValueOnce({addr: "0x1"} as CurrentUser)
    mockQuery.mockResolvedValueOnce("0x123")

    await accountManager.updateCOAAddress()
    expect(accountManager.getAccounts()).toEqual(["0x123"])
  })
})

describe("send transaction", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("send transaction mainnet", async () => {
    const user = mockUser()
    const accountManager = new AccountManager(user)

    const mockTxResult = {
      onceExecuted: jest.fn().mockResolvedValue({
        events: [
          {
            type: "A.e467b9dd11fa00df.EVM.TransactionExecuted",
            data: {
              hash: ["12", "34"],
            },
          },
        ],
      }),
    } as any as jest.Mocked<ReturnType<typeof fcl.tx>>

    jest.mocked(fcl.tx).mockReturnValue(mockTxResult)
    jest.mocked(fcl.mutate).mockResolvedValue("1111")

    const tx = {
      to: "0x1234",
      value: "0",
      data: "0x1234",
      nonce: "0",
      gasLimit: "0",
      chainId: "747",
    }

    const result = await accountManager.sendTransaction(tx)

    expect(result).toEqual("1234")
    expect(fcl.mutate).toHaveBeenCalled()
    expect(mockFcl.mutate.mock.calls[0][0]).toMatchObject({
      cadence: expect.any(String),
      args: expect.any(Function),
      authz: user,
      limit: 9999,
    })

    expect(mockFcl.tx).toHaveBeenCalledWith("1111")
    expect(mockFcl.tx).toHaveBeenCalledTimes(1)
    expect(mockTxResult.onceExecuted).toHaveBeenCalledTimes(1)
  })

  test("send transaction testnet", async () => {
    const user = mockUser()
    const accountManager = new AccountManager(user)

    const mockTxResult = {
      onceExecuted: jest.fn().mockResolvedValue({
        events: [
          {
            type: "A.8c5303eaa26202d6.EVM.TransactionExecuted",
            data: {
              hash: ["12", "34"],
            },
          },
        ],
      }),
    } as any as jest.Mocked<ReturnType<typeof fcl.tx>>

    jest.mocked(fcl.tx).mockReturnValue(mockTxResult)
    jest.mocked(fcl.mutate).mockResolvedValue("1111")

    const tx = {
      to: "0x1234",
      value: "0",
      data: "0x1234",
      nonce: "0",
      gasLimit: "0",
      chainId: "646",
    }

    const result = await accountManager.sendTransaction(tx)

    expect(result).toEqual("1234")
    expect(fcl.mutate).toHaveBeenCalled()
    expect(mockFcl.mutate.mock.calls[0][0]).toMatchObject({
      cadence: expect.any(String),
      args: expect.any(Function),
      authz: user,
      limit: 9999,
    })

    expect(mockFcl.tx).toHaveBeenCalledWith("1111")
    expect(mockFcl.tx).toHaveBeenCalledTimes(1)
    expect(mockTxResult.onceExecuted).toHaveBeenCalledTimes(1)
  })

  test("throws error if no executed event not found", async () => {
    const user = mockUser()
    const accountManager = new AccountManager(user)

    const mockTxResult = {
      onceExecuted: jest.fn().mockResolvedValue({
        events: [],
      }),
    } as any as jest.Mocked<ReturnType<typeof fcl.tx>>

    jest.mocked(fcl.tx).mockReturnValue(mockTxResult)
    jest.mocked(fcl.mutate).mockResolvedValue("1111")

    const tx = {
      to: "0x1234",
      value: "0",
      data: "0x1234",
      nonce: "0",
      gasLimit: "0",
      chainId: "646",
    }

    await expect(accountManager.sendTransaction(tx)).rejects.toThrow(
      "EVM transaction hash not found"
    )
  })
})
