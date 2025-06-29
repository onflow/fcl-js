import {FCLContext, createFCLContext, type ConfigService} from "./index"
import type {StorageProvider} from "../utils/storage"

// Default configuration values
const DEFAULT_PLATFORM = typeof window !== "undefined" ? "web" : "node"

// In-memory storage implementation
const createMemoryStorage = (): StorageProvider => {
  const store = new Map<string, any>()
  return {
    can: true,
    get: async (key: string) => store.get(key),
    put: async (key: string, value: any) => {
      store.set(key, value)
    },
    removeItem: async (key: string) => {
      store.delete(key)
    },
  }
}

// Global context instance - will be lazily initialized
let globalContext: FCLContext | undefined

// Global config store for backward compatibility
const globalConfigStore = new Map<string, any>()
const globalConfigSubscribers = new Set<(key: string, value: any) => void>()

// Create a config service that operates on the global config store
const globalConfigService: ConfigService = {
  get: async (key: string) => globalConfigStore.get(key),
  put: async (key: string, value: any) => {
    globalConfigStore.set(key, value)
    // Rebuild context when config changes
    invalidateGlobalContext()
    // Notify subscribers
    globalConfigSubscribers.forEach(fn => fn(key, value))
    return globalConfigService
  },
  update: async (key: string, updateFn: (oldValue: any) => any) => {
    const oldValue = globalConfigStore.get(key)
    const newValue = updateFn(oldValue)
    globalConfigStore.set(key, newValue)
    // Rebuild context when config changes
    invalidateGlobalContext()
    // Notify subscribers
    globalConfigSubscribers.forEach(fn => fn(key, newValue))
    return globalConfigService
  },
  delete: async (key: string) => {
    globalConfigStore.delete(key)
    // Rebuild context when config changes
    invalidateGlobalContext()
    // Notify subscribers
    globalConfigSubscribers.forEach(fn => fn(key, undefined))
    return globalConfigService
  },
  where: async (pattern: RegExp) => {
    const result: Record<string, any> = {}
    for (const [key, value] of globalConfigStore.entries()) {
      if (pattern.test(key)) {
        result[key] = value
      }
    }
    return result
  },
  subscribe: (callback: (key: string, value: any) => void) => {
    globalConfigSubscribers.add(callback)
    return () => {
      globalConfigSubscribers.delete(callback)
    }
  },
  all: async () => {
    return Object.fromEntries(globalConfigStore.entries())
  },
}

/**
 * Invalidate the global context, forcing it to be recreated on next access
 */
function invalidateGlobalContext() {
  globalContext = undefined
}

/**
 * Create a global FCL Context based on the current global config
 */
export async function createGlobalFCLContext(): Promise<FCLContext> {
  // Get all config values
  const configValues = Object.fromEntries(globalConfigStore.entries())

  // Determine platform
  const platform = configValues.platform || DEFAULT_PLATFORM

  // Create in-memory storage provider
  const storage = createMemoryStorage()

  // Create context from current config
  return createFCLContext({
    platform,
    storage,
    // Convert accessNode.api string to object if needed
    accessNode: configValues["accessNode.api"] as string | undefined,
    transport: configValues["transport"],
    computeLimit: configValues["fcl.limit"],
    discoveryWallet: configValues["discovery.wallet"] as string,
    discoveryWalletMethod: configValues["discovery.wallet.method"] as string,
    defaultComputeLimit: configValues["defaultComputeLimit"] as number,
    flowNetwork: configValues["flow.network"] as string,
    serviceOpenIdScopes: configValues["service.OpenID.scopes"] as string[],
    walletconnectProjectId: configValues["walletconnect.projectId"] as string,
    walletconnectDisableNotifications: configValues[
      "walletconnect.disableNotifications"
    ] as boolean,
    customResolver: configValues["sdk.resolve"] as (args: any) => Promise<any>,
    customDecoders: Object.fromEntries(
      Object.entries(configValues).filter(([key]) => key.startsWith("decoder."))
    ),
    debug: Object.fromEntries(
      Object.entries(configValues).filter(([key]) => key.startsWith("debug."))
    ),
    discovery: {
      execStrategy: configValues["discovery.execStrategy"] as (
        ...args: any[]
      ) => any,
    },
  })
}

/**
 * Get the global FCL Context, creating it if it doesn't exist
 */
export async function getGlobalFCLContext(): Promise<FCLContext> {
  if (!globalContext) {
    globalContext = await createGlobalFCLContext()
  }
  return globalContext
}

/**
 * Export the global config service for legacy code
 */
export const config = () => globalConfigService

/**
 * Higher-order function that wraps a context-aware function with the global context
 */
export function withGlobalFCLContext<
  T extends (context: FCLContext) => (...args: any[]) => Promise<any>,
>(
  fn: T
): (
  ...args: Parameters<ReturnType<T>>
) => Promise<Awaited<ReturnType<ReturnType<T>>>> {
  return async (
    ...args: Parameters<ReturnType<T>>
  ): Promise<Awaited<ReturnType<ReturnType<T>>>> => {
    const context = await getGlobalFCLContext()
    return fn(context)(...args)
  }
}

/**
 * Utility to create context-aware function overloads
 */
export function withContextOrGlobal<T, R>(
  implementation: (context: FCLContext, opts: T) => R
): {
  (context: FCLContext, opts: T): R
  (opts: T): Promise<R>
} {
  return async function (
    contextOrOpts: FCLContext | T,
    maybeOpts?: T
  ): Promise<R> {
    // If first argument is a context, use it
    if (
      contextOrOpts &&
      typeof contextOrOpts === "object" &&
      "currentUser" in contextOrOpts &&
      "sdkClient" in contextOrOpts
    ) {
      return implementation(contextOrOpts as FCLContext, maybeOpts as T)
    }
    // Otherwise use global context
    else {
      const context = await getGlobalFCLContext()
      return implementation(context, contextOrOpts as T)
    }
  } as any // Type assertion needed for overloads
}
