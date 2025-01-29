import {AccountManager} from "../accounts/account-manager"
import {EventDispatcher} from "./event-dispatcher"

jest.mock("../accounts/account-manager")

describe("event dispatcher", () => {
  test("unsubscribe should remove listener", () => {
    const accountManager: jest.Mocked<AccountManager> =
      new (AccountManager as any)()

    let mockSubscribeCallback: (accounts: string[]) => void
    accountManager.subscribe.mockImplementation(cb => {
      mockSubscribeCallback = cb
    })
    const listener = jest.fn()

    const eventDispatcher = new EventDispatcher(accountManager)
    eventDispatcher.on("accountsChanged", listener)

    expect(accountManager.subscribe).toHaveBeenCalled()
    expect(accountManager.subscribe).toHaveBeenCalledTimes(1)
    expect(accountManager.subscribe).toHaveBeenCalledWith(expect.any(Function))

    // Simulate account change from account manager
    mockSubscribeCallback!(["0x1234"])

    expect(listener).toHaveBeenCalled()
    expect(listener).toHaveBeenCalledTimes(1)
    expect(listener).toHaveBeenCalledWith(["0x1234"])

    eventDispatcher.off("accountsChanged", listener)

    // Simulate account change from account manager
    mockSubscribeCallback!(["0x5678"])

    expect(listener).toHaveBeenCalledTimes(1)
  })

  test("should emit accountsChanged", () => {
    const accountManager: jest.Mocked<AccountManager> =
      new (AccountManager as any)()

    let mockSubscribeCallback: (accounts: string[]) => void
    accountManager.subscribe.mockImplementation(cb => {
      mockSubscribeCallback = cb
    })
    const listener = jest.fn()

    const eventDispatcher = new EventDispatcher(accountManager)
    eventDispatcher.on("accountsChanged", listener)

    expect(accountManager.subscribe).toHaveBeenCalled()
    expect(accountManager.subscribe).toHaveBeenCalledTimes(1)
    expect(accountManager.subscribe).toHaveBeenCalledWith(expect.any(Function))

    // Simulate account change from account manager
    mockSubscribeCallback!(["0x1234"])

    expect(listener).toHaveBeenCalled()
    expect(listener).toHaveBeenCalledTimes(1)
    expect(listener).toHaveBeenCalledWith(["0x1234"])
  })

  test("should emit accountsChanged multiple times", () => {
    const accountManager: jest.Mocked<AccountManager> =
      new (AccountManager as any)()

    let mockSubscribeCallback: (accounts: string[]) => void
    accountManager.subscribe.mockImplementation(cb => {
      mockSubscribeCallback = cb
    })
    const listener = jest.fn()

    const eventDispatcher = new EventDispatcher(accountManager)
    eventDispatcher.on("accountsChanged", listener)

    expect(accountManager.subscribe).toHaveBeenCalled()
    expect(accountManager.subscribe).toHaveBeenCalledTimes(1)
    expect(accountManager.subscribe).toHaveBeenCalledWith(expect.any(Function))

    // Simulate account change from account manager
    mockSubscribeCallback!(["0x1234"])
    mockSubscribeCallback!(["0x5678"])

    expect(listener).toHaveBeenCalled()
    expect(listener).toHaveBeenCalledTimes(2)
    expect(listener).toHaveBeenNthCalledWith(1, ["0x1234"])
    expect(listener).toHaveBeenNthCalledWith(2, ["0x5678"])
  })
})
