import { AccountManager } from "./account-manager"
import * as fcl from "@onflow/fcl"

jest.mock("@onflow/fcl", () => ({
  currentUser: {
    subscribe: jest.fn(),
    snapshot: jest.fn(),
  },
  query: jest.fn(),
  arg: jest.fn(),
  t: {
    Address: "Address",
  },
}))

describe("AccountManager", () => {
  let accountManager: AccountManager
  let mockSnapshot: jest.Mock
  let mockSubscribe: jest.Mock
  let mockQuery: jest.Mock

  beforeEach(() => {
    mockSnapshot = jest.fn().mockResolvedValue({ addr: undefined })
    mockSubscribe = jest.fn()
    mockQuery = jest.fn()

    jest.spyOn(fcl, "query").mockImplementation(mockQuery)
    jest.spyOn(fcl.currentUser, "snapshot").mockImplementation(mockSnapshot)
    jest.spyOn(fcl.currentUser, "subscribe").mockImplementation(mockSubscribe)

    accountManager = new AccountManager(fcl.currentUser)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("should initialize with null COA address", () => {
    expect(accountManager.getCOAAddress()).toBeNull()
    expect(accountManager.getAccounts()).toEqual([])
  })

  it("should reset state when the user is not logged in", async () => {
    mockSnapshot.mockResolvedValueOnce({ addr: undefined })

    await accountManager.updateCOAAddress()

    expect(accountManager.getCOAAddress()).toBeNull()
    expect(accountManager.getAccounts()).toEqual([])
  })

  it("should fetch and update COA address when user logs in", async () => {
    mockSnapshot.mockResolvedValueOnce({ addr: "0x1" })
    mockQuery.mockResolvedValueOnce("0x123")

    await accountManager.updateCOAAddress()

    expect(accountManager.getCOAAddress()).toBe("0x123")
    expect(accountManager.getAccounts()).toEqual(["0x123"])
    expect(fcl.query).toHaveBeenCalledWith({
      cadence: expect.any(String),
      args: expect.any(Function),
    })
  })
})
