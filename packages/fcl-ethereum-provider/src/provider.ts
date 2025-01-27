import {
  Eip1193Provider,
  EventCallback,
  ProviderEvents,
  ProviderRequest,
  ProviderResponse,
} from "./types/provider"
import {RpcService} from "./services/rpc/rpc-service"
import {EventService} from "./services/events/event-service"

export class FclEthereumProvider implements Eip1193Provider {
  constructor(
    private rpcService: RpcService,
    private eventService: EventService
  ) {}

  // Handle requests
  async request<T = unknown>({
    method,
    params,
  }: ProviderRequest): Promise<ProviderResponse<T>> {
    try {
      if (!method) {
        throw new Error("Method is required")
      }
      const result = await this.rpcService.request({method, params})
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
