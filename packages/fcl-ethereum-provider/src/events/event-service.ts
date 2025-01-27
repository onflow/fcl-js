import * as fcl from "@onflow/fcl"
import {EventCallback, FLOW_CHAIN_ID, ProviderEvents} from "../types/provider"
import {CurrentUser} from "@onflow/typedefs"
import EventEmitter from "events"

export class EventService {
  private currentUser: CurrentUser | null = null
  private eventEmitter = new EventEmitter()

  constructor(private user: ReturnType<typeof fcl.currentUser>) {
    this.setupUserEvents()
  }

  // Setup event listeners for user changes
  private setupUserEvents() {
    this.user.subscribe((currentUser: CurrentUser) => {
      const addrChanged = currentUser.addr !== this.currentUser?.addr
      const loggedInChanged =
        currentUser?.loggedIn !== this.currentUser?.loggedIn
      const isConnected = currentUser?.loggedIn && currentUser?.addr
      const wasConnected = this.currentUser?.loggedIn && this.currentUser?.addr

      // Emit accounts changed event if user changes
      if (addrChanged || loggedInChanged) {
        this.emit("accountsChanged", isConnected ? [currentUser.addr!] : [])

        // Emit connect event if user connects
        if (isConnected && !wasConnected) {
          this.emit("connect", {chainId: FLOW_CHAIN_ID.TESTNET.toString()})
        }

        // Emit disconnect event if user changes
        if (!isConnected && wasConnected) {
          this.emit("disconnect", {reason: "User changed"})
        }
      }

      // Update current user
      this.currentUser = currentUser

      // Emit chain changed event if chain id changes
      /* TODO
      if (currentUser?.chainId !== this.currentUser?.chainId) {
        this.emit("chainChanged", currentUser.chainId)
      }*/
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
