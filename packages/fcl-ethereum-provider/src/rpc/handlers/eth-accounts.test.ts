import {ethAccounts, ethRequestAccounts} from "./eth-accounts"
import {AccountManager} from "../../accounts/account-manager"
import * as fcl from "@onflow/fcl"
import {CurrentUser} from "@onflow/typedefs"

describe("ethAccounts handler", () => {
  let accountManagerMock: jest.Mocked<AccountManager>

  beforeEach(() => {
    accountManagerMock = {
      getAccounts: jest.fn(),
      subscribe: jest.fn(),
      updateCOAAddress: jest.fn(),
    } as unknown as jest.Mocked<AccountManager>
  })

  it("should return accounts from the AccountManager", async () => {
    accountManagerMock.getAccounts.mockResolvedValue(["0x1234...", "0x5678..."])

    const accounts = await ethAccounts(accountManagerMock)

    expect(accounts).toEqual(["0x1234...", "0x5678..."])
    expect(accountManagerMock.getAccounts).toHaveBeenCalled()
  })

  it("should return an empty array if no accounts are available", async () => {
    accountManagerMock.getAccounts.mockResolvedValue([])

    const accounts = await ethAccounts(accountManagerMock)

    expect(accounts).toEqual([])
    expect(accountManagerMock.getAccounts).toHaveBeenCalled()
  })
})

describe("ethRequestAccounts handler", () => {
  let accountManagerMock: jest.Mocked<AccountManager>
  let userMock: jest.Mocked<typeof fcl.currentUser>

  beforeEach(() => {
    userMock = fcl.currentUser() as jest.Mocked<typeof fcl.currentUser>

    userMock.snapshot.mockResolvedValue({addr: null} as unknown as CurrentUser)

    accountManagerMock = {
      getAccounts: jest.fn(),
      updateCOAAddress: jest.fn(),
      subscribe: jest.fn(),
    } as unknown as jest.Mocked<AccountManager>
  })

  it("should call authenticate, updateCOAAddress, and return the manager's accounts", async () => {
    accountManagerMock.getAccounts.mockResolvedValue(["0x1234..."])

    const accounts = await ethRequestAccounts(accountManagerMock)

    expect(accountManagerMock.authenticate).toHaveBeenCalled()
    expect(accountManagerMock.getAccounts).toHaveBeenCalled()
    expect(accounts).toEqual(["0x1234..."])
  })

  it("should handle empty accounts scenario", async () => {
    accountManagerMock.getAccounts.mockResolvedValue([])

    const accounts = await ethRequestAccounts(accountManagerMock)

    expect(accountManagerMock.authenticate).toHaveBeenCalled()
    expect(accountManagerMock.getAccounts).toHaveBeenCalled()
    expect(accounts).toEqual([])
  })
})
