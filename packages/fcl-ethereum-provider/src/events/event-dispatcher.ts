import {EventCallback, ProviderEvents} from "../types/provider"
import {AccountManager} from "../accounts/account-manager"
import {NetworkManager} from "../network/network-manager"
import {Observable, Subscription} from "../util/observable"

export class EventDispatcher {
  private $emitters: {
    [E in keyof ProviderEvents]: Observable<ProviderEvents[E]>
  }
  private subscriptions: {
    [E in keyof ProviderEvents]: Map<
      EventCallback<ProviderEvents[E]>,
      Subscription
    >
  }

  constructor(accountManager: AccountManager, networkManager: NetworkManager) {
    this.$emitters = {
      accountsChanged: new Observable(subscriber => {
        return accountManager.subscribe(accounts => {
          subscriber.next(accounts)
        })
      }),
      chainChanged: new Observable(subscriber => {
        return networkManager.subscribe(chainId => {
          if (!chainId) return
          subscriber.next(`0x${chainId.toString(16)}`)
        })
      }),
      connect: new Observable(subscriber => {
        subscriber.complete?.()
        return () => {}
      }),
      disconnect: new Observable(subscriber => {
        subscriber.complete?.()
        return () => {}
      }),
    }

    this.subscriptions = {
      accountsChanged: new Map(),
      chainChanged: new Map(),
      connect: new Map(),
      disconnect: new Map(),
    }
  }

  // Listen to events
  on<E extends keyof ProviderEvents>(
    event: E,
    listener: EventCallback<ProviderEvents[E]>
  ): void {
    const unsub = this.$emitters[event].subscribe(listener)
    this.subscriptions[event].set(listener, unsub)
  }

  // Remove event listeners
  off<E extends keyof ProviderEvents>(
    event: E,
    listener: EventCallback<ProviderEvents[E]>
  ): void {
    this.subscriptions[event].get(listener)?.()
    this.subscriptions[event].delete(listener)
  }
}
