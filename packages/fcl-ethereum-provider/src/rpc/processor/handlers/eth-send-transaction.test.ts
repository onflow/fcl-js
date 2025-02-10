import {AccountManager} from "../../accounts/account-manager"
import {ethSendTransaction} from "./eth-send-transaction"

jest.mock("../../accounts/account-manager")

describe("eth_sendTransaction handler", () => {
  test("should call the AccountManager to send a transaction", async () => {
    const mockAccountManager = new (AccountManager as any)()
    mockAccountManager.sendTransaction.mockResolvedValue("0x123456")

    const params = {
      from: "0x1234",
      to: "0x5678",
      value: "0x100",
    }

    const evmTxHash = await ethSendTransaction(mockAccountManager, params)

    expect(mockAccountManager.sendTransaction).toHaveBeenCalled()
    expect(mockAccountManager.sendTransaction).toHaveBeenCalledTimes(1)
    expect(mockAccountManager.sendTransaction).toHaveBeenCalledWith(params)
    expect(evmTxHash).toEqual("0x123456")
  })
})
