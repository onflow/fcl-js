// Types for RPC request and events
export type RpcRequest = {
  method: string
  params?: unknown[] | Record<string, unknown>
}

export type RpcResponse<T = unknown> = T

// Event types for the provider
export type ProviderEvents = {
  connect: {chainId: string}
  disconnect: {reason: string}
  chainChanged: string
  accountsChanged: string[]
}

// Event callback
export type EventCallback<T> = (event: T) => void

// Base EIP-1193 Provider Interface
export interface Eip1193Provider {
  request<T = unknown>(args: RpcRequest): Promise<RpcResponse<T>>
  on<E extends keyof ProviderEvents>(
    event: E,
    listener: EventCallback<ProviderEvents[E]>
  ): void
  removeListener<E extends keyof ProviderEvents>(
    event: E,
    listener: EventCallback<ProviderEvents[E]>
  ): void
}

export enum FLOW_CHAIN_ID {
  MAINNET = 747,
  TESTNET = 646,
}
