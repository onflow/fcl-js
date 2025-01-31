import {mockConfig} from "../__mocks__/fcl"
import {AccountManager} from "../accounts/account-manager"
import {NetworkManager} from "../network/network"
import {EventDispatcher} from "./event-dispatcher"

jest.mock("../accounts/account-manager")
jest.mock("../network/network")

describe("event dispatcher", () => {
  test("unsubscribe should remove listener", () => {
    const accountManager: jest.Mocked<AccountManager> =
      new (AccountManager as any)()

    const networkManager: jest.Mocked<NetworkManager> =
      new (NetworkManager as any)()

    let subs: ((accounts: string[]) => void)[] = []
    accountManager.subscribe.mockImplementation(cb => {
      subs.push(cb)
      return () => {
        subs = subs.filter(sub => sub !== cb)
      }
    })
    const listener = jest.fn()

    const eventDispatcher = new EventDispatcher(accountManager, networkManager)
    eventDispatcher.on("accountsChanged", listener)

    expect(accountManager.subscribe).toHaveBeenCalled()
    expect(accountManager.subscribe).toHaveBeenCalledTimes(1)
    expect(accountManager.subscribe).toHaveBeenCalledWith(expect.any(Function))

    // Simulate account change from account manager
    subs.forEach(sub => sub(["0x1234"]))

    expect(listener).toHaveBeenCalled()
    expect(listener).toHaveBeenCalledTimes(1)
    expect(listener).toHaveBeenCalledWith(["0x1234"])

    eventDispatcher.off("accountsChanged", listener)

    // Simulate account change from account manager
    subs.forEach(sub => sub(["0x5678"]))

    expect(listener).toHaveBeenCalledTimes(1)
  })

  test("should emit accountsChanged", () => {
    const accountManager: jest.Mocked<AccountManager> =
      new (AccountManager as any)()

    const networkManager: jest.Mocked<NetworkManager> =
      new (NetworkManager as any)()

    let mockMgrSubCb: (accounts: string[]) => void
    accountManager.subscribe.mockImplementation(cb => {
      mockMgrSubCb = cb
      return () => {}
    })
    const listener = jest.fn()

    const eventDispatcher = new EventDispatcher(accountManager, networkManager)
    eventDispatcher.on("accountsChanged", listener)

    expect(accountManager.subscribe).toHaveBeenCalled()
    expect(accountManager.subscribe).toHaveBeenCalledTimes(1)
    expect(accountManager.subscribe).toHaveBeenCalledWith(expect.any(Function))

    // Simulate account change from account manager
    mockMgrSubCb!(["0x1234"])

    expect(listener).toHaveBeenCalled()
    expect(listener).toHaveBeenCalledTimes(1)
    expect(listener).toHaveBeenCalledWith(["0x1234"])
  })

  test("should emit accountsChanged multiple times", () => {
    const accountManager: jest.Mocked<AccountManager> =
      new (AccountManager as any)()

    const networkManager: jest.Mocked<NetworkManager> =
      new (NetworkManager as any)()

    let mockMgrSubCb: (accounts: string[]) => void
    accountManager.subscribe.mockImplementation(cb => {
      mockMgrSubCb = cb
      return () => {}
    })
    const listener = jest.fn()

    const eventDispatcher = new EventDispatcher(accountManager, networkManager)
    eventDispatcher.on("accountsChanged", listener)

    expect(accountManager.subscribe).toHaveBeenCalled()
    expect(accountManager.subscribe).toHaveBeenCalledTimes(1)
    expect(accountManager.subscribe).toHaveBeenCalledWith(expect.any(Function))

    // Simulate account change from account manager
    mockMgrSubCb!(["0x1234"])
    mockMgrSubCb!(["0x5678"])

    expect(listener).toHaveBeenCalled()
    expect(listener).toHaveBeenCalledTimes(2)
    expect(listener).toHaveBeenNthCalledWith(1, ["0x1234"])
    expect(listener).toHaveBeenNthCalledWith(2, ["0x5678"])
  })

  test("should emit chainChanged", () => {
    const accountManager: jest.Mocked<AccountManager> =
      new (AccountManager as any)()

    const networkManager: jest.Mocked<NetworkManager> =
      new (NetworkManager as any)()

    let mockNetMgrSubCb: (chainId: number) => void
    networkManager.subscribe.mockImplementation(cb => {
      mockNetMgrSubCb = cb
      return () => {}
    })
    const listener = jest.fn()

    const eventDispatcher = new EventDispatcher(accountManager, networkManager)
    eventDispatcher.on("chainChanged", listener)

    expect(networkManager.subscribe).toHaveBeenCalled()
    expect(networkManager.subscribe).toHaveBeenCalledTimes(1)
    expect(networkManager.subscribe).toHaveBeenCalledWith(expect.any(Function))

    // Simulate network change from network manager
    mockNetMgrSubCb!(747)

    expect(listener).toHaveBeenCalled()
    expect(listener).toHaveBeenCalledTimes(1)
    expect(listener).toHaveBeenCalledWith("0x2eb")
  })
})
