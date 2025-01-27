import {
  Eip1193Provider,
  EventCallback,
  ProviderEvents,
  ProviderRequest,
  ProviderResponse,
} from "./types/provider"
import {RpcProcessor} from "./rpc/rpc-processor"
import {EventManager} from "./events/event-manager"

export class FclEthereumProvider implements Eip1193Provider {
  constructor(
    private rpcProcessor: RpcProcessor,
    private eventService: EventManager
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
      const result = await this.rpcProcessor.handleRequest({method, params})
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
