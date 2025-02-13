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
import {formatChainId} from "../util/eth"
import {withPrefix} from "@onflow/fcl"
import {ProviderError, ProviderErrorCode} from "../util/errors"

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
      accountsChanged: new Observable(subscriber => {
        return accountManager.subscribe(accounts => {
          subscriber.next(accounts.map(x => withPrefix(x)))
        })
      }),
      // Emit changes to the chainId as a chainChanged event
      chainChanged: networkManager.$chainId.pipe(
        filter(({isLoading, error}) => !isLoading && !error),
        map(({chainId}) => {
          return formatChainId(chainId!)
        }),
        skip(1)
      ) as Observable<string>,
      // Emit the first chainId as a connect event
      connect: networkManager.$chainId.pipe(
        filter(({isLoading, error}) => !isLoading && !error),
        map(({chainId}) => {
          return {chainId: formatChainId(chainId!)}
        }),
        takeFirst()
      ),
      disconnect: new Observable<ProviderError>(subscriber => {
        subscriber.next(
          new ProviderError({code: ProviderErrorCode.Disconnected})
        )
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
