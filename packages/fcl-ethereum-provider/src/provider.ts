import EventEmitter from "events"
import {
  Eip1193Provider,
  EventCallback,
  FLOW_CHAIN_ID,
  ProviderEvents,
  RpcRequest,
  RpcResponse,
} from "./types/provider"
import {RpcService} from "./services/rpc"
import * as fcl from "@onflow/fcl"
import {CurrentUser, Service} from "@onflow/typedefs"

export class Provider implements Eip1193Provider {
  private eventEmitter = new EventEmitter()
  private currentUser: CurrentUser | null = null

  constructor(
    private user: typeof fcl.currentUser,
    private service: Service | undefined,
    private rpcService: RpcService
  ) {
    this.setupEvents()
  }

  // Setup event listeners for user changes
  private setupEvents() {
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

  // Handle requests
  async request<T = unknown>({
    method,
    params,
  }: RpcRequest): Promise<RpcResponse<T>> {
    try {
      if (!method) {
        throw new Error("Method is required")
      }
      const result = await this.rpcService.handleRequest({method, params})
      return result
    } catch (error) {
      throw new Error(`Request failed: ${(error as Error).message}`)
    }
  }

  // Listen to events
  on<E extends keyof ProviderEvents>(
    event: E,
    listener: EventCallback<ProviderEvents[E]>
  ): void {
    this.eventEmitter.on(event, listener)
  }

  // Remove event listeners
  removeListener<E extends keyof ProviderEvents>(
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
