import type {CurrentUserService, CurrentUserServiceApi} from "../current-user"
import {config} from "@onflow/config"
import {StorageProvider} from "../fcl-core"

interface FCLCoreConfigOptions {
  accessNodeUrl?: string
  discoveryWallet?: string
  discoveryWalletMethod?: string
  defaultComputeLimit?: number
  flowNetwork?: string
  serviceOpenIdScopes?: string[]
  walletconnectProjectId?: string
  walletconnectDisableNotifications?: boolean
  storageProvider?: StorageProvider
}

/**
 * FCL Context contains the core infrastructure dependencies
 */
export interface FCLContext {
  /** Configuration service for network settings, endpoints, etc. */
  config: ReturnType<typeof config>
  currentUser: CurrentUserServiceApi
  //storage: StorageProvider
}

/**
 * FCL Instance binds context with user state and operations
 * This solves the bidirectional dependency issue between user and mutate()
 */
export interface FCLInstance {
  /** The context this instance operates within */
  context: FCLContext

  /** Current user service bound to this context */
  currentUser: CurrentUserService

  /** Mutate function bound to both context and currentUser */
  mutate: (opts?: any) => Promise<string>

  /** Query function bound to context */
  query: (opts?: any) => Promise<any>

  /** Send function bound to context */
  send: (opts?: any) => Promise<any>

  /** Decode function bound to context */
  decode: (response: any) => any
}

/**
 * Factory function to create an FCL context
 */
export function createFCLContext(
  options: {
    config?: Partial<ConfigService>
    network?: Partial<FCLContext["network"]>
    storage?: Partial<FCLContext["storage"]>
    serviceRegistry?: Partial<FCLContext["serviceRegistry"]>
  } = {}
): FCLContext {
  // Default storage implementation (can be overridden)
  const defaultStorage: FCLContext["storage"] = {
    get: async (key: string) => {
      if (typeof window !== "undefined" && window.localStorage) {
        return window.localStorage.getItem(key)
      }
      return null
    },
    set: async (key: string, value: string) => {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(key, value)
      }
    },
    remove: async (key: string) => {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.removeItem(key)
      }
    },
  }

  // Default service registry implementation
  const defaultServiceRegistry: FCLContext["serviceRegistry"] = {
    services: new Map(),
    discover: async () => [],
    register: (service: any) => {
      // Implementation would register service
    },
    unregister: (serviceId: string) => {
      // Implementation would unregister service
    },
  }

  return {
    config: (options.config as ConfigService) || ({} as ConfigService),
    network: {
      id: "mainnet",
      endpoint: "https://rest-mainnet.onflow.org",
      name: "Flow Mainnet",
      ...options.network,
    },
    storage: {
      ...defaultStorage,
      ...options.storage,
    },
    serviceRegistry: {
      ...defaultServiceRegistry,
      ...options.serviceRegistry,
    },
  }
}

/**
 * Factory function to create an FCL instance with bound context and user
 */
export function createFCLInstance(context: FCLContext): FCLInstance {
  // Import these dynamically to avoid circular dependencies
  const {createCurrentUser} = require("../current-user")
  const {getMutate} = require("../exec/mutate")
  const {getQuery} = require("../exec/query")
  const {getSend} = require("../exec/send")
  const {getDecode} = require("../exec/decode")

  // Create currentUser that consumes the context
  const currentUser = createCurrentUser(context)

  // Create bound functions
  const mutate = getMutate(currentUser)
  const query = getQuery(context)
  const send = getSend(context)
  const decode = getDecode(context)

  return {
    context,
    currentUser,
    mutate,
    query,
    send,
    decode,
  }
}

/**
 * Default global instance for backward compatibility
 * This allows existing code to continue working while new code can use explicit contexts
 */
let defaultInstance: FCLInstance | null = null

/**
 * Get or create the default FCL instance
 */
export function getDefaultInstance(): FCLInstance {
  if (!defaultInstance) {
    const defaultContext = createFCLContext()
    defaultInstance = createFCLInstance(defaultContext)
  }
  return defaultInstance
}

/**
 * Set a new default instance (useful for testing or explicit configuration)
 */
export function setDefaultInstance(instance: FCLInstance): void {
  defaultInstance = instance
}

/**
 * Reset the default instance to null (useful for testing)
 */
export function resetDefaultInstance(): void {
  defaultInstance = null
}
