import {SdkTransport} from "@onflow/typedefs"

export interface SdkContext {
  // TODO: should we include more properties about the chain like viem... e.g. chainId, network, etc.?
  get accessNode(): string
  get transport(): SdkTransport
  get computeLimit(): number
  get customResolver(): ((args: any) => Promise<any>) | undefined
  get customDecoders(): {[key: string]: (data: any) => any}

  // Deprecated properties
  get debug(): {[key: string]: any} // Debug options for internal use
}

export interface SdkContextOptions {
  accessNode: string
  transport: SdkTransport
  computeLimit: number
  customResolver?: (args: any) => Promise<any>
  customDecoders?: {[key: string]: (data: any) => any}
  debug?: {[key: string]: any} // Optional debug options for internal use
}

export function createContext({
  accessNode,
  transport,
  computeLimit,
  customResolver,
  customDecoders = {},
  debug = {},
}: SdkContextOptions): SdkContext {
  if (!transport) {
    throw new Error("Transport must be provided to create SDK context")
  }

  // Ensure transport is an instance of SdkTransport
  if (typeof transport.send !== "function") {
    throw new Error("Invalid transport provided, must implement send method")
  }

  if (typeof transport.subscribe !== "function") {
    throw new Error(
      "Invalid transport provided, must implement subscribe method"
    )
  }

  if (!accessNode) {
    throw new Error("Access node must be provided to create SDK context")
  }

  if (typeof accessNode !== "string") {
    throw new Error("Access node must be a string URL")
  }

  if (typeof computeLimit !== "number" || computeLimit <= 0) {
    throw new Error("Compute limit must be a positive number")
  }

  return {
    transport,
    accessNode,
    computeLimit,
    customResolver,
    customDecoders,
    debug,
  }
}
