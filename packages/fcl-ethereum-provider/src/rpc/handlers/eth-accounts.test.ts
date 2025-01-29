// eth-accounts.spec.ts
import {ethAccounts, ethRequestAccounts} from "./eth-accounts"
import {AccountManager} from "../../accounts/account-manager"
import * as fcl from "@onflow/fcl"
import {CurrentUser} from "@onflow/typedefs"

// Mock FCL at the top-level
jest.mock("@onflow/fcl", () => ({
  currentUser: jest.fn().mockReturnValue({
    authenticate: jest.fn(),
    snapshot: jest.fn(),
  }),
}))

describe("ethAccounts handler", () => {
  let accountManagerMock: jest.Mocked<AccountManager>

  beforeEach(() => {
    accountManagerMock = {
      getAddress: jest.fn(),
      subscribe: jest.fn(),
      updateCOAAddress: jest.fn(),
    } as unknown as jest.Mocked<AccountManager>
  })

  it("should return accounts from the AccountManager", async () => {
    accountManagerMock.getAddress.mockResolvedValue("0x1234")

    const accounts = await ethAccounts(accountManagerMock)

    expect(accounts).toEqual(["0x1234"])
    expect(accountManagerMock.getAddress).toHaveBeenCalled()
  })

  it("should return an empty array if no accounts are available", async () => {
    accountManagerMock.getAddress.mockResolvedValue(null)

    const accounts = await ethAccounts(accountManagerMock)

    expect(accounts).toEqual([])
    expect(accountManagerMock.getAddress).toHaveBeenCalled()
  })
})

describe("ethRequestAccounts handler", () => {
  let accountManagerMock: jest.Mocked<AccountManager>
  let userMock: ReturnType<typeof fcl.currentUser>

  beforeEach(() => {
    userMock = fcl.currentUser()

    userMock.snapshot.mockResolvedValue({addr: null})

    accountManagerMock = {
      getAccounts: jest.fn(),
      updateCOAAddress: jest.fn(),
      subscribe: jest.fn(),
    } as unknown as jest.Mocked<AccountManager>
  })

  it("should call authenticate, updateCOAAddress, and return the manager's accounts", async () => {
    accountManagerMock.getAccounts.mockReturnValue(["0x1234..."])

    const accounts = await ethRequestAccounts(accountManagerMock)

    expect(userMock.authenticate).toHaveBeenCalled()
    expect(accountManagerMock.updateCOAAddress).toHaveBeenCalled()
    expect(accountManagerMock.getAccounts).toHaveBeenCalled()
    expect(accounts).toEqual(["0x1234..."])
  })

  it("should handle empty accounts scenario", async () => {
    accountManagerMock.getAccounts.mockReturnValue([])

    const accounts = await ethRequestAccounts(accountManagerMock)

    expect(userMock.authenticate).toHaveBeenCalled()
    expect(accountManagerMock.updateCOAAddress).toHaveBeenCalled()
    expect(accountManagerMock.getAccounts).toHaveBeenCalled()
    expect(accounts).toEqual([])
  })
})
