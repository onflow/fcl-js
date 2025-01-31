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
  let user: jest.Mocked<typeof fcl.currentUser>

  beforeEach(() => {
    user = mockUser()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should initialize with null COA address", async () => {
    const accountManager = new AccountManager(user)
    expect(await accountManager.getCOAAddress()).toBeNull()
    expect(await accountManager.getAccounts()).toEqual([])
  })

  it("should reset state when the user is not logged in", async () => {
    user.subscribe.mockImplementation(fn => {
      console.log("subscribing")
      fn({addr: null})
      return () => {}
    })

    const accountManager = new AccountManager(user)

    expect(await accountManager.getCOAAddress()).toBeNull()
    expect(await accountManager.getAccounts()).toEqual([])
  })

  it("should fetch and update COA address when user logs in", async () => {
    let triggerUserEvent: (user: CurrentUser) => void
    user.subscribe.mockImplementation(fn => {
      fn({addr: undefined} as CurrentUser)
      triggerUserEvent = fn as any
      return () => {}
    })
    mockQuery.mockResolvedValue("0x123")

    const accountManager = new AccountManager(user)

    triggerUserEvent!({addr: "0x1"} as CurrentUser)

    expect(await accountManager.getCOAAddress()).toBe("0x123")
    expect(await accountManager.getAccounts()).toEqual(["0x123"])
    expect(fcl.query).toHaveBeenCalledWith({
      cadence: expect.any(String),
      args: expect.any(Function),
    })
  })

  it("should not update COA address if user has not changed", async () => {
    let triggerUserEvent: (user: CurrentUser) => void
    user.subscribe.mockImplementation(fn => {
      triggerUserEvent = fn as any
      fn({addr: undefined} as CurrentUser)
      return () => {}
    })
    mockQuery.mockResolvedValue("0x123")

    const accountManager = new AccountManager(user)

    triggerUserEvent!({addr: "0x1"} as CurrentUser)

    expect(await accountManager.getCOAAddress()).toBe("0x123")
    expect(fcl.query).toHaveBeenCalledTimes(1)

    triggerUserEvent!({addr: "0x1"} as CurrentUser)

    expect(await accountManager.getCOAAddress()).toBe("0x123")
    expect(fcl.query).toHaveBeenCalledTimes(1) // Should not have fetched again
  })

  it("should not update COA address if fetch is outdated when user changes", async () => {
    let triggerUserEvent: (user: CurrentUser) => void
    user.subscribe.mockImplementation(fn => {
      triggerUserEvent = fn as any
      fn({addr: "0x1"} as CurrentUser)
      return () => {}
    })
    mockQuery.mockResolvedValue("0x123")

    mockQuery
      // 1st fetch: delayed
      .mockImplementationOnce(
        () => new Promise(resolve => setTimeout(() => resolve("0x123"), 500))
      )
      // 2nd fetch: immediate
      .mockResolvedValueOnce("0x456")

    const accountManager = new AccountManager(user)

    triggerUserEvent!({addr: "0x1"} as CurrentUser)
    triggerUserEvent!({addr: "0x2"} as CurrentUser)

    // The second fetch (for address 0x2) is the latest, so "0x456"
    expect(await accountManager.getCOAAddress()).toBe("0x456")
  })

  it("should clear COA address if fetch fails and is the latest", async () => {
    let triggerUserEvent: (user: CurrentUser) => void
    user.subscribe.mockImplementation(fn => {
      triggerUserEvent = fn as any
      fn({addr: undefined} as CurrentUser)
      return () => {}
    })
    mockQuery.mockRejectedValueOnce(new Error("Fetch failed"))

    const accountManager = new AccountManager(user)

    triggerUserEvent!({addr: "0x1"} as CurrentUser)

    expect(await accountManager.getCOAAddress()).toBeNull()
  })

  it("should handle user changes correctly", async () => {
    let triggerUserEvent: (user: CurrentUser) => void
    user.subscribe.mockImplementation(fn => {
      triggerUserEvent = fn as any
      fn({addr: undefined} as CurrentUser)
      return () => {}
    })

    mockQuery
      .mockResolvedValueOnce("0x123") // for user 0x1
      .mockResolvedValueOnce("0x456") // for user 0x2

    const accountManager = new AccountManager(user)

    triggerUserEvent!({addr: "0x1"} as CurrentUser)
    expect(await accountManager.getCOAAddress()).toBe("0x123")

    triggerUserEvent!({addr: "0x2"} as CurrentUser)
    expect(await accountManager.getCOAAddress()).toBe("0x456")
  })

  it("should call the callback with updated accounts in subscribe", async () => {
    mockQuery.mockResolvedValue("0x123")

    let triggerUserEvent: (user: CurrentUser) => void
    user.subscribe.mockImplementation(fn => {
      triggerUserEvent = fn as any
      return () => {}
    })

    const accountManager = new AccountManager(user)

    const callback = jest.fn()
    accountManager.subscribe(callback)

    triggerUserEvent!({addr: "0x1"} as CurrentUser)

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

    const accountManager = new AccountManager(user)

    accountManager.subscribe(callback)

    expect(callback).toHaveBeenCalledWith([])
  })

  it("should call the callback when COA address is updated", async () => {
    const callback = jest.fn()

    user.snapshot.mockResolvedValueOnce({addr: "0x1"} as CurrentUser)

    user.subscribe.mockImplementation(fn => {
      console.log("subscribing")
      fn({addr: "0x1"} as CurrentUser)
      return () => {}
    })

    mockQuery.mockResolvedValueOnce("0x123")

    const accountManager = new AccountManager(user)

    accountManager.subscribe(callback)

    await new Promise(setImmediate)

    expect(callback).toHaveBeenCalledWith(["0x123"])
  })

  it("should return an empty array when COA address is null", async () => {
    const accountManager = new AccountManager(user)
    expect(await accountManager.getAccounts()).toEqual([])
  })

  it("should return COA address array when available", async () => {
    user.subscribe.mockImplementation(fn => {
      fn({addr: "0x1"} as CurrentUser)
      return () => {}
    })
    mockQuery.mockResolvedValueOnce("0x123")

    const accountManager = new AccountManager(user)

    expect(await accountManager.getAccounts()).toEqual(["0x123"])
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
      from: "0x1234",
      value: "0",
      data: "0x1234",
      nonce: "0",
      gas: "0",
      chainId: "747",
    }

    const result = await accountManager.sendTransaction(tx)

    expect(result).toEqual("1852")
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
      from: "0x1234",
      value: "0",
      data: "0x1234",
      nonce: "0",
      gas: "0",
      chainId: "646",
    }

    const result = await accountManager.sendTransaction(tx)

    expect(result).toEqual("1852")
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
      from: "0x1234",
      value: "0",
      data: "0x1234",
      nonce: "0",
      gas: "0",
      chainId: "646",
    }

    await expect(accountManager.sendTransaction(tx)).rejects.toThrow(
      "EVM transaction hash not found"
    )
  })
})
