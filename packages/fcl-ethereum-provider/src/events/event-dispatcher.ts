import {EventCallback, ProviderEvents} from "../types/provider"
import {AccountManager} from "../accounts/account-manager"
import {NetworkManager} from "../network/network-manager"
import {
  filter,
  map,
  Observable,
  skip,
  Subscription,
  takeFirst,
} from "../util/observable"

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
      // Emit changes to the accounts as an accountsChanged event
      accountsChanged: new Observable<string[]>(subscriber => {
        return accountManager.subscribe(accounts => {
          subscriber.next(accounts)
        })
      }).pipe(skip(1)),
      // Emit changes to the chainId as a chainChanged event
      chainChanged: networkManager.$chainId.pipe(
        filter(({isLoading, error}) => !isLoading && !error),
        map(({chainId}) => {
          return `0x${chainId!.toString(16)}`
        }),
        skip(1)
      ) as Observable<string>,
      // Emit the first chainId as a connect event
      connect: networkManager.$chainId.pipe(
        filter(({isLoading, error}) => !isLoading && !error),
        map(({chainId}) => {
          return {chainId: `0x${chainId!.toString(16)}`}
        }),
        takeFirst()
      ),
      disconnect: new Observable<{reason: string}>(() => {
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
