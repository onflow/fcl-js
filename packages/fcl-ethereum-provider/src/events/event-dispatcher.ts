import {EventCallback, ProviderEvents} from "../types/provider"
import EventEmitter from "events"
import * as fcl from "@onflow/fcl"
import {CurrentUser} from "@onflow/typedefs"
import {AccountManager} from "../accounts/account-manager"

export class EventDispatcher {
  private eventEmitter = new EventEmitter()

  constructor(config: typeof fcl.config, accountManager: AccountManager) {
    accountManager.subscribe(accounts => {
      this.emit("accountsChanged", accounts)
    })
    config.subscribe(async cfg => {
      const accessNode = cfg?.["accessNode.api"]
      const flowNetwork = await fcl.getChainId({
        node: accessNode,
      })
      this.emit("chainChanged", flowNetwork)
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
