import {CurrentUserConfig} from "../current-user"
import {createUser, type CurrentUserServiceApi} from "../current-user"
import {StorageProvider} from "../fcl-core"
import {createSdkClient, SdkClientOptions} from "@onflow/sdk/types/sdk-client"

interface FCLConfig extends SdkClientOptions {
  platform: string
  discoveryWallet?: string
  discoveryWalletMethod?: string
  defaultComputeLimit?: number
  flowNetwork?: string
  serviceOpenIdScopes?: string[]
  walletconnectProjectId?: string
  walletconnectDisableNotifications?: boolean
  storage: StorageProvider
  discovery?: {
    // TODO (jribbink): Define the type for execStrategy
    execStrategy?: (...args: any[]) => any
  }
  currentUserConfig: CurrentUserConfig
}

// Define a compatibility config interface for backward compatibility
export interface ConfigService {
  get: (key: string, defaultValue?: any) => Promise<any>
  put: (key: string, value: any) => Promise<ConfigService> | ConfigService
  update: (
    key: string,
    updateFn: (oldValue: any) => any
  ) => Promise<ConfigService> | ConfigService
  delete: (key: string) => Promise<ConfigService> | ConfigService
  where: (pattern: RegExp) => Promise<Record<string, any>>
  subscribe: (
    callback: (config: Record<string, any> | null) => void
  ) => () => void
  all: () => Promise<Record<string, any>>
}

/**
 * FCL Context contains the core infrastructure dependencies
 */
export interface FCLContext {
  /** Configuration service for network settings, endpoints, etc. */
  currentUser: CurrentUserServiceApi
  sdk: ReturnType<typeof createSdkClient>
  storage: StorageProvider
  /** Legacy config compatibility layer */
  config: ConfigService
}

/**
 * Factory function to create an FCL context
 */
export function createFCLContext(config: FCLConfig): FCLContext {
  const currentUser = createUser({
    platform: config.platform,
    getStorageProvider: async () => config.storage,
    discovery: {
      execStrategy: config.discovery?.execStrategy,
    },
  })

  // Create internal config store based on provided typed config
  const configStore = new Map<string, any>([
    ["platform", config.platform],
    ["discoveryWallet", config.discoveryWallet],
    ["discoveryWalletMethod", config.discoveryWalletMethod],
    ["defaultComputeLimit", config.defaultComputeLimit],
    ["flowNetwork", config.flowNetwork],
    ["serviceOpenIdScopes", config.serviceOpenIdScopes],
    ["walletconnectProjectId", config.walletconnectProjectId],
    [
      "walletconnectDisableNotifications",
      config.walletconnectDisableNotifications,
    ],
    ["accessNode.api", config.accessNode],
    ["fcl.limit", config.computeLimit],
  ])

  // Filter out undefined values
  for (const [key, value] of configStore.entries()) {
    if (value === undefined) {
      configStore.delete(key)
    }
  }

  // Create subscribers registry
  const subscribers = new Set<(key: string, value: any) => void>()

  // Create compatibility config layer
  const compatConfig: ConfigService = {
    get: async (key: string) => configStore.get(key),
    put: async (key: string, value: any) => {
      configStore.set(key, value)
      subscribers.forEach(fn => fn(key, value))
      return compatConfig
    },
    update: async (key: string, updateFn: (oldValue: any) => any) => {
      const oldValue = configStore.get(key)
      const newValue = updateFn(oldValue)
      configStore.set(key, newValue)
      subscribers.forEach(fn => fn(key, newValue))
      return compatConfig
    },
    delete: async (key: string) => {
      configStore.delete(key)
      subscribers.forEach(fn => fn(key, undefined))
      return compatConfig
    },
    where: async (pattern: RegExp) => {
      const result: Record<string, any> = {}
      for (const [key, value] of configStore.entries()) {
        if (pattern.test(key)) {
          result[key] = value
        }
      }
      return result
    },
    subscribe: (callback: (key: string, value: any) => void) => {
      subscribers.add(callback)
      return () => {
        subscribers.delete(callback)
      }
    },
    all: async () => {
      return Object.fromEntries(configStore.entries())
    },
  }

  return {
    storage: config.storage,
    currentUser: currentUser,
    sdk: createSdkClient({
      accessNode: config.accessNode,
      transport: config.transport,
      computeLimit: config.computeLimit,
      customResolver: config.customResolver,
      customDecoders: config.customDecoders,
      debug: config.debug,
    }),
    config: compatConfig,
  }
}

export function createConfigService(config: FCLConfig): ConfigService {
  const configStore = new Map<string, any>([
    ["platform", config.platform],
    ["discoveryWallet", config.discoveryWallet],
    ["discoveryWalletMethod", config.discoveryWalletMethod],
    ["defaultComputeLimit", config.defaultComputeLimit],
    ["flowNetwork", config.flowNetwork],
    ["serviceOpenIdScopes", config.serviceOpenIdScopes],
    ["walletconnectProjectId", config.walletconnectProjectId],
    [
      "walletconnectDisableNotifications",
      config.walletconnectDisableNotifications,
    ],
    ["accessNode.api", config.accessNode],
    ["fcl.limit", config.computeLimit],
  ])

  // Filter out undefined values
  for (const [key, value] of configStore.entries()) {
    if (value === undefined) {
      configStore.delete(key)
    }
  }

  return {
    get: async (key: string) => configStore.get(key),
    put: async (key: string, value: any) => {
      configStore.set(key, value)
      return createConfigService(config)
    },
    update: async (key: string, updateFn: (oldValue: any) => any) => {
      const oldValue = configStore.get(key)
      const newValue = updateFn(oldValue)
      configStore.set(key, newValue)
      return createConfigService(config)
    },
    delete: async (key: string) => {
      configStore.delete(key)
      return createConfigService(config)
    },
    where: async (pattern: RegExp) => {
      const result: Record<string, any> = {}
      for (const [key, value] of configStore.entries()) {
        if (pattern.test(key)) {
          result[key] = value
        }
      }
      return result
    },
    subscribe: (callback: (key: string, value: any) => void) => {
      // No subscribers in this context
      return () => {}
    },
    all: async () => {
      return Object.fromEntries(configStore.entries())
    },
  }
}
