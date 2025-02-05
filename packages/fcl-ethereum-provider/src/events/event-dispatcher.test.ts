import {AccountManager} from "../accounts/account-manager"
import {ChainIdStore, NetworkManager} from "../network/network-manager"
import {BehaviorSubject} from "../util/observable"
import {EventDispatcher} from "./event-dispatcher"

jest.mock("../accounts/account-manager")
jest.mock("../network/network-manager")

describe("event dispatcher", () => {
  let $chainIdMock: BehaviorSubject<ChainIdStore>
  let networkManager: jest.Mocked<NetworkManager>
  let $accountsMock: BehaviorSubject<string[]>
  let accountManager: jest.Mocked<AccountManager>

  beforeEach(() => {
    jest.clearAllMocks()

    $chainIdMock = new BehaviorSubject<ChainIdStore>({
      isLoading: false,
      chainId: 0x1,
      error: null,
    })
    networkManager = {
      subscribe: jest.fn(),
      $chainId: $chainIdMock,
    } as unknown as jest.Mocked<NetworkManager>

    $accountsMock = new BehaviorSubject<string[]>([])
    accountManager = {
      subscribe: jest.fn().mockImplementation(cb => {
        return $accountsMock.subscribe(cb)
      }),
    } as unknown as jest.Mocked<AccountManager>
  })

  test("unsubscribe should remove listener", () => {
    const listener = jest.fn()

    const eventDispatcher = new EventDispatcher(accountManager, networkManager)
    eventDispatcher.on("accountsChanged", listener)

    expect(accountManager.subscribe).toHaveBeenCalled()
    expect(accountManager.subscribe).toHaveBeenCalledTimes(1)
    expect(accountManager.subscribe).toHaveBeenCalledWith(expect.any(Function))

    // Simulate account change from account manager
    $accountsMock.next(["0x1234"])

    expect(listener).toHaveBeenCalled()
    expect(listener).toHaveBeenCalledTimes(1)
    expect(listener).toHaveBeenCalledWith(["0x1234"])

    eventDispatcher.off("accountsChanged", listener)

    // Simulate account change from account manager
    $accountsMock.next(["0x5678"])

    expect(listener).toHaveBeenCalledTimes(1)
  })

  test("should emit accountsChanged", () => {
    const listener = jest.fn()

    const eventDispatcher = new EventDispatcher(accountManager, networkManager)
    eventDispatcher.on("accountsChanged", listener)

    expect(accountManager.subscribe).toHaveBeenCalled()
    expect(accountManager.subscribe).toHaveBeenCalledTimes(1)
    expect(accountManager.subscribe).toHaveBeenCalledWith(expect.any(Function))

    // Simulate account change from account manager
    $accountsMock.next(["0x1234"])

    expect(listener).toHaveBeenCalled()
    expect(listener).toHaveBeenCalledTimes(1)
    expect(listener).toHaveBeenCalledWith(["0x1234"])
  })

  test("should emit accountsChanged multiple times", () => {
    const listener = jest.fn()

    const eventDispatcher = new EventDispatcher(accountManager, networkManager)
    eventDispatcher.on("accountsChanged", listener)

    expect(accountManager.subscribe).toHaveBeenCalled()
    expect(accountManager.subscribe).toHaveBeenCalledTimes(1)
    expect(accountManager.subscribe).toHaveBeenCalledWith(expect.any(Function))

    // Simulate account change from account manager
    $accountsMock.next(["0x1234"])
    $accountsMock.next(["0x5678"])

    expect(listener).toHaveBeenCalled()
    expect(listener).toHaveBeenCalledTimes(2)
    expect(listener).toHaveBeenNthCalledWith(1, ["0x1234"])
    expect(listener).toHaveBeenNthCalledWith(2, ["0x5678"])
  })

  test("should emit chainChanged", () => {
    const listener = jest.fn()

    const eventDispatcher = new EventDispatcher(accountManager, networkManager)
    eventDispatcher.on("chainChanged", listener)

    // Simulate network change from network manager
    $chainIdMock.next({isLoading: false, chainId: 0x2eb, error: null})

    expect(listener).toHaveBeenCalled()
    expect(listener).toHaveBeenCalledTimes(1)
    expect(listener).toHaveBeenCalledWith("0x2eb")
  })

  test("should emit connect", () => {
    const listener = jest.fn()

    const eventDispatcher = new EventDispatcher(accountManager, networkManager)
    eventDispatcher.on("connect", listener)

    // Simulate network change from network manager
    // Should be ignored because connect only emits the first chainId
    $chainIdMock.next({isLoading: false, chainId: 0x2eb, error: null})

    expect(listener).toHaveBeenCalled()
    expect(listener).toHaveBeenCalledTimes(1)
    expect(listener).toHaveBeenCalledWith({chainId: "0x1"})
  })
})
