import {createUser, type CurrentUserServiceApi} from "../current-user"
import {StorageProvider} from "../fcl-core"
import {createSdkClient, SdkClientOptions} from "@onflow/sdk"
import {getContracts} from "@onflow/config"
import {invariant} from "@onflow/util-invariant"
interface FCLConfig {
  accessNodeUrl: string
  transport: SdkClientOptions["transport"]
  customResolver?: SdkClientOptions["customResolver"]
  customDecoders?: SdkClientOptions["customDecoders"]
  flowJson?: any
  computeLimit: number
  platform: string
  discoveryWallet?: string
  discoveryWalletMethod?: string
  discoveryAuthnEndpoint?: string
  flowNetwork?: string
  walletconnectProjectId?: string
  walletconnectDisableNotifications?: boolean
  storage: StorageProvider
  discovery?: {
    execStrategy?: (...args: any[]) => any
  }
  // App detail properties
  appDetailTitle?: string
  appDetailIcon?: string
  appDetailDescription?: string
  appDetailUrl?: string
  // Service configuration
  serviceOpenIdScopes?: string[]
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
  let contracts: Record<string, string> | undefined

  if (config.flowJson) {
    invariant(
      !!config.flowNetwork,
      "If flowJson is provided, flowNetwork must also be specified."
    )

    const cleanedNetwork = config.flowNetwork
      .toLowerCase()
      .replace(/^local$/, "emulator")

    invariant(
      cleanedNetwork === "mainnet" ||
        cleanedNetwork === "testnet" ||
        cleanedNetwork === "emulator",
      `Invalid flowNetwork: ${config.flowNetwork}. Must be one of: mainnet, testnet, emulator.`
    )

    contracts = getContracts(config.flowJson, cleanedNetwork)
  }

  const sdk = createSdkClient({
    accessNodeUrl: config.accessNodeUrl,
    transport: config.transport,
    computeLimit: config.computeLimit,
    customResolver: config.customResolver,
    customDecoders: config.customDecoders,
    contracts: contracts,
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
    ["discovery.authn.endpoint", config.discoveryAuthnEndpoint],
    ["flow.network", config.flowNetwork],
    ["walletconnectProjectId", config.walletconnectProjectId],
    [
      "walletconnect.disableNotifications",
      config.walletconnectDisableNotifications,
    ],
    ["accessNode.api", config.accessNodeUrl],
    ["fcl.limit", config.computeLimit],
    ["app.detail.title", config.appDetailTitle],
    ["app.detail.icon", config.appDetailIcon],
    ["app.detail.description", config.appDetailDescription],
    ["app.detail.url", config.appDetailUrl],
    ["service.OpenID.scopes", config.serviceOpenIdScopes],
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
    get: async (key: string, fallback?: any) => {
      return configStore.has(key) ? configStore.get(key) : fallback
    },
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
