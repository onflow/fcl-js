import type {FCLContext, ConfigService} from "../context"
import type {StorageProvider} from "../utils/storage"
import type {CurrentUserServiceApi} from "../current-user"
import * as sdk from "@onflow/sdk"
import type {createSdkClient} from "@onflow/sdk"
import {
  createPluginRegistry,
  createServiceRegistry,
} from "../current-user/exec-service/plugins"

/**
 * Creates a mock SDK client for testing
 *
 * This provides a fully mocked version of the SDK client with jest mock functions
 * for all methods. Each method is mocked to use the actual SDK implementation by default,
 * but you can override any method's behavior by providing custom implementations
 * in the overrides parameter.
 *
 * @example
 * // Mock the send method to return a specific response
 * const sdk = createMockSdkClient({
 *   send: jest.fn().mockResolvedValue({
 *     blockId: "123",
 *     transactionId: "abc"
 *   })
 * })
 *
 * @param overrides - Custom implementations for SDK methods
 * @returns A mocked SDK client instance
 */
export function createMockSdkClient(
  overrides: Partial<ReturnType<typeof createSdkClient>> = {}
): jest.Mocked<ReturnType<typeof createSdkClient>> {
  // Create a mock for each SDK method we use
  const mockSdk = {
    send: jest.fn().mockResolvedValue({}),
    decode: jest.fn().mockImplementation(sdk.decode),
    subscribe: jest.fn().mockReturnValue(() => {}),
    transaction: jest.fn().mockImplementation(sdk.transaction),
    script: jest.fn().mockImplementation(sdk.script),
    args: jest.fn().mockImplementation(sdk.args),
    arg: jest.fn().mockImplementation(sdk.arg),
    limit: jest.fn().mockImplementation(sdk.limit),
    proposer: jest.fn().mockImplementation(sdk.proposer),
    payer: jest.fn().mockImplementation(sdk.payer),
    authorizations: jest.fn().mockImplementation(sdk.authorizations),
    authorization: jest.fn().mockImplementation(sdk.authorization),
    atBlockHeight: jest.fn().mockImplementation(sdk.atBlockHeight),
    atBlockId: jest.fn().mockImplementation(sdk.atBlockId),
    getAccount: jest.fn().mockImplementation(sdk.getAccount),
    getEvents: jest.fn().mockImplementation(sdk.getEvents),
    getEventsAtBlockHeightRange: jest
      .fn()
      .mockImplementation(sdk.getEventsAtBlockHeightRange),
    getEventsAtBlockIds: jest.fn().mockImplementation(sdk.getEventsAtBlockIds),
    getBlock: jest.fn().mockImplementation(sdk.getBlock),
    getBlockHeader: jest.fn().mockImplementation(sdk.getBlockHeader),
    getCollection: jest.fn().mockImplementation(sdk.getCollection),
    getTransactionStatus: jest
      .fn()
      .mockImplementation(sdk.getTransactionStatus),
    getTransaction: jest.fn().mockImplementation(sdk.getTransaction),
    getNetworkParameters: jest
      .fn()
      .mockImplementation(sdk.getNetworkParameters),
    ...overrides,
  } as any

  return mockSdk
}

/**
 * Creates an in-memory storage provider for testing
 */
export function createMockStorage(): StorageProvider {
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

/**
 * Creates a mock config service for testing
 */
export function createMockConfigService(
  initialValues: Record<string, any> = {}
): ConfigService {
  const configStore = new Map<string, any>(Object.entries(initialValues))
  const subscribers = new Set<(config: Record<string, any>) => void>()

  const configService: ConfigService = {
    get: async (key: string, defaultValue?: any) => {
      return configStore.has(key) ? configStore.get(key) : defaultValue
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

/**
 * Creates a mock current user for testing
 */
export function createMockCurrentUser(
  override: Partial<CurrentUserServiceApi> = {}
): CurrentUserServiceApi {
  return {
    authenticate: jest.fn().mockResolvedValue({}),
    unauthenticate: jest.fn().mockResolvedValue({}),
    authorization: jest.fn().mockResolvedValue({}),
    signUserMessage: jest.fn().mockResolvedValue([]),
    subscribe: jest.fn().mockReturnValue(() => {}),
    snapshot: jest.fn().mockResolvedValue({}),
    resolveArgument: jest.fn().mockResolvedValue("0x0"),
    ...override,
  }
}

/**
 * Creates a mock service registry for testing
 */
export function createMockServiceRegistry(
  overrides: any = {}
): ReturnType<typeof createServiceRegistry> {
  const mockServices = new Set()

  return {
    add: jest.fn().mockImplementation(servicePlugin => {
      // Mock implementation that just stores the service
      mockServices.add(servicePlugin)
    }),
    getServices: jest.fn().mockReturnValue([]),
    getStrategy: jest.fn().mockReturnValue(null),
    getStrategies: jest.fn().mockReturnValue([]),
    ...overrides,
  }
}

/**
 * Creates a mock plugin registry for testing
 */
export function createMockPluginRegistry(
  overrides: any = {}
): ReturnType<typeof createPluginRegistry> {
  const mockPlugins = new Map()

  return {
    add: jest.fn().mockImplementation(plugins => {
      if (Array.isArray(plugins)) {
        plugins.forEach(plugin => mockPlugins.set(plugin.name, plugin))
      } else {
        mockPlugins.set(plugins.name, plugins)
      }
    }),
    getPlugins: jest.fn().mockReturnValue(mockPlugins),
    ...overrides,
  }
}

/**
 * Creates a fully mocked FCL context for testing
 *
 * This creates a complete mock context with all dependencies needed for testing FCL
 * functions that require an FCLContext. Each component (storage, config, currentUser, sdk)
 * is mocked with reasonable defaults that can be customized through the options parameter.
 *
 * @example
 * // Create a mock context with customized config values and SDK behavior
 * const context = createMockContext({
 *   configValues: {
 *     "accessNode.api": "https://rest-testnet.onflow.org",
 *     "flowNetwork": "testnet"
 *   },
 *   sdkOverrides: {
 *     send: jest.fn().mockResolvedValue({ ... }),
 *     getAccount: jest.fn().mockResolvedValue({ ... })
 *   }
 * })
 *
 * // Use with a context-aware function
 * const result = await myContextAwareFunction(context)
 */
export function createMockContext(
  options: {
    configValues?: {
      platform?: string
      discoveryWallet?: string
      discoveryWalletMethod?: string
      defaultComputeLimit?: number
      flowNetwork?: string
      serviceOpenIdScopes?: string[]
      walletconnectProjectId?: string
      walletconnectDisableNotifications?: boolean
      "accessNode.api"?: string
      "fcl.limit"?: number
      "discovery.authn.endpoint"?: string
      "discovery.authn.include"?: string[]
      "discovery.authn.exclude"?: string[]
      "discovery.features.suggested"?: string[]
      "fcl.authz"?: any
      [key: string]: any // Allow additional custom config values
    }
    currentUser?: Partial<CurrentUserServiceApi>
    storage?: StorageProvider
    sdkOverrides?: Partial<ReturnType<typeof createSdkClient>>
    serviceRegistryOverrides?: any
    pluginRegistryOverrides?: any
  } = {}
) {
  const storage = options.storage || createMockStorage()
  const config = createMockConfigService(options.configValues || {})
  const currentUser = createMockCurrentUser(options.currentUser || {})
  const sdk = createMockSdkClient(options.sdkOverrides || {})
  const serviceRegistry = createMockServiceRegistry(
    options.serviceRegistryOverrides || {}
  )
  const pluginRegistry = createMockPluginRegistry(
    options.pluginRegistryOverrides || {}
  )

  return {
    storage,
    config,
    currentUser,
    sdk,
    serviceRegistry,
    pluginRegistry,
  }
}
