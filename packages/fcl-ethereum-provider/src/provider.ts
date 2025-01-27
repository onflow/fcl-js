import EventEmitter from "events"
import {
  Eip1193Provider,
  EventCallback,
  FLOW_CHAIN_ID,
  ProviderEvents,
  RpcRequest,
  RpcResponse,
} from "./types/provider"
import {RpcController} from "./rpc/rpc-controller"
import * as fcl from "@onflow/fcl"
import {CurrentUser, Service} from "@onflow/typedefs"
import {EventService} from "./events/event-service"

export class FclEthereumProvider implements Eip1193Provider {
  constructor(
    private rpcController: RpcController,
    private eventService: EventService
  ) {}

  // Handle requests
  async request<T = unknown>({
    method,
    params,
  }: RpcRequest): Promise<RpcResponse<T>> {
    try {
      if (!method) {
        throw new Error("Method is required")
      }
      const result = await this.rpcController.handleRequest({method, params})
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
    this.eventService.on(event, listener)
  }

  // Remove event listeners
  removeListener<E extends keyof ProviderEvents>(
    event: E,
    listener: EventCallback<ProviderEvents[E]>
  ): void {
    this.eventService.off(event, listener)
  }
}
