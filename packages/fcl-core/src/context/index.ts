import {createUser, type CurrentUserServiceApi} from "../current-user"
import {StorageProvider} from "../fcl-core"
import {createSdkClient, SdkClientOptions} from "@onflow/sdk"

interface FCLConfig {
  accessNodeUrl: string
  transport: SdkClientOptions["transport"]
  customResolver?: SdkClientOptions["customResolver"]
  customDecoders?: SdkClientOptions["customDecoders"]
  contracts?: Record<string, string>
  computeLimit: number
  platform: string
  discoveryWallet?: string
  discoveryWalletMethod?: string
  flowNetwork?: string
  walletconnectProjectId?: string
  walletconnectDisableNotifications?: boolean
  storage: StorageProvider
  discovery?: {
    execStrategy?: (...args: any[]) => any
  }
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
  first: (keys: string[], defaultValue?: any) => Promise<any> | any
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
  platform: string
}

/**
 * Factory function to create an FCL context
 */
export function createFCLContext(config: FCLConfig): FCLContext {
  const sdk = createSdkClient({
    accessNodeUrl: config.accessNodeUrl,
    transport: config.transport,
    computeLimit: config.computeLimit,
    customResolver: config.customResolver,
    customDecoders: config.customDecoders,
    contracts: config.contracts,
  })

  const configService = createConfigService(config)

  const currentUser = createUser({
    platform: config.platform,
    storage: config.storage,
    config: configService,
    discovery: {
      execStrategy: config.discovery?.execStrategy,
    },
    sdk,
  })

  return {
    storage: config.storage,
    currentUser: currentUser,
    sdk: sdk,
    config: configService,
    platform: config.platform,
  }
}

export function createConfigService(config: FCLConfig): ConfigService {
  // Create internal config store based on provided typed config
  const configStore = new Map<string, any>([
    ["platform", config.platform],
    ["discovery.wallet", config.discoveryWallet],
    ["discovery.wallet.method", config.discoveryWalletMethod],
    ["flow.network", config.flowNetwork],
    ["walletconnectProjectId", config.walletconnectProjectId],
    [
      "walletconnect.disableNotifications",
      config.walletconnectDisableNotifications,
    ],
    ["accessNode.api", config.accessNodeUrl],
    ["fcl.limit", config.computeLimit],
  ])

  // Filter out undefined values
  for (const [key, value] of configStore.entries()) {
    if (value === undefined) {
      configStore.delete(key)
    }
  }

  // Create subscribers registry
  const subscribers = new Set<(config: Record<string, any>) => void>()

  // Create compatibility config layer
  const configService: ConfigService = {
    get: async (key: string) => configStore.get(key),
    put: async (key: string, value: any) => {
      configStore.set(key, value)
      subscribers.forEach(fn => fn(configStore))
      return configService
    },
    update: async (key: string, updateFn: (oldValue: any) => any) => {
      const oldValue = configStore.get(key)
      const newValue = updateFn(oldValue)
      configStore.set(key, newValue)
      subscribers.forEach(fn => fn(configStore))
      return configService
    },
    delete: async (key: string) => {
      configStore.delete(key)
      subscribers.forEach(fn => fn(configStore))
      return configService
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
    first: async (keys: string[], defaultValue?: any) => {
      if (typeof keys === "string") keys = [keys]
      for (const key of keys) {
        if (configStore.has(key)) {
          return configStore.get(key)
        }
      }
      return defaultValue
    },
    subscribe: (callback: (config: Record<string, any>) => void) => {
      subscribers.add(callback)
      return () => {
        subscribers.delete(callback)
      }
    },
    all: async () => {
      return Object.fromEntries(configStore.entries())
    },
  }

  return configService
}
