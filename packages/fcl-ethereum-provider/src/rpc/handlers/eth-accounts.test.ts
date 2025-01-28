import {ethAccounts} from "./eth-accounts"
import {AccountManager} from "../../accounts/account-manager"

describe("ethAccounts handler", () => {
  let accountManagerMock: jest.Mocked<AccountManager>

  beforeEach(() => {
    accountManagerMock = {
      getAddress: jest.fn(),
      subscribe: jest.fn(),
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
