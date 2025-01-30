import {EventCallback, ProviderEvents} from "../types/provider"
import EventEmitter from "events"
import {AccountManager} from "../accounts/account-manager"
import {NetworkManager} from "../network/network"

export class EventDispatcher {
  private eventEmitter = new EventEmitter()

  constructor(accountManager: AccountManager, networkManager: NetworkManager) {
    accountManager.subscribe(accounts => {
      this.emit("accountsChanged", accounts)
    })
    networkManager.subscribe(chainId => {
      if (!chainId) return
      this.emit("chainChanged", `0x${chainId.toString(16)}`)
    })
  }

  // Listen to events
  on<E extends keyof ProviderEvents>(
    event: E,
    listener: EventCallback<ProviderEvents[E]>
  ): void {
    this.eventEmitter.on(event, listener)
  }

  // Remove event listeners
  off<E extends keyof ProviderEvents>(
    event: E,
    listener: EventCallback<ProviderEvents[E]>
  ): void {
    this.eventEmitter.off(event, listener)
  }

  // Emit events (to be called internally)
  protected emit<E extends keyof ProviderEvents>(
    event: E,
    data: ProviderEvents[E]
  ) {
    this.eventEmitter.emit(event, data)
  }
}
