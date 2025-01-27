import {ethAccounts} from "./eth-accounts"
import {AccountManager} from "../../accounts/account-manager"

describe("ethAccounts handler", () => {
  let accountManagerMock: jest.Mocked<AccountManager>

  beforeEach(() => {
    accountManagerMock = {
      getAccounts: jest.fn(),
      subscribe: jest.fn(),
    } as unknown as jest.Mocked<AccountManager>
  });

  it("should return accounts from the AccountManager", () => {
    accountManagerMock.getAccounts.mockReturnValue(["0x1234...", "0x5678..."])

    const accounts = ethAccounts(accountManagerMock)

    expect(accounts).toEqual(["0x1234...", "0x5678..."])
    expect(accountManagerMock.getAccounts).toHaveBeenCalled()
  });

  it("should return an empty array if no accounts are available", () => {
    accountManagerMock.getAccounts.mockReturnValue([])

    const accounts = ethAccounts(accountManagerMock)

    expect(accounts).toEqual([])
    expect(accountManagerMock.getAccounts).toHaveBeenCalled()
  });
});
