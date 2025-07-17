import {createFcl as createFclCore} from "@onflow/fcl-core"
import {LOCAL_STORAGE} from "./fcl"
import {execStrategyHook} from "./discovery/exec-hook"

export const discoveryOpts = {
  execStrategy: execStrategyHook,
}

type WithOptionalProperties<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>

/**
 * @description Creates a configured FCL (Flow Client Library) instance for web applications.
 * This function initializes FCL with web-specific defaults and discovery configuration,
 * providing a complete interface for interacting with the Flow blockchain.
 *
 * The created FCL instance includes all core functionality for:
 * - User authentication and wallet connections
 * - Transaction submission and monitoring
 * - Blockchain queries and event subscriptions
 * - Configuration management
 * - Discovery service integration
 *
 * This function automatically configures the platform as "web" and uses localStorage
 * for session persistence by default, while allowing customization of other parameters.
 *
 * @param params Configuration parameters for the FCL instance
 * @param params.accessNodeUrl URL of the Flow access node (e.g., "https://rest-testnet.onflow.org")
 * @param params.computeLimit Default compute limit for transactions and queries
 * @param params.customResolver Optional custom resolver for address replacement
 * @param params.customDecoders Optional custom decoders for response parsing
 * @param params.contracts Optional contract address mappings
 * @param params.discoveryWallet Optional discovery wallet endpoint
 * @param params.discoveryWalletMethod Optional discovery wallet method
 * @param params.defaultComputeLimit Optional default compute limit override
 * @param params.flowNetwork Optional Flow network identifier
 * @param params.serviceOpenIdScopes Optional OpenID scopes for services
 * @param params.walletconnectProjectId Optional WalletConnect project ID
 * @param params.walletconnectDisableNotifications Optional flag to disable WalletConnect notifications
 * @param params.storage Optional custom storage provider (defaults to localStorage)
 * @param params.discovery Optional discovery configuration
 *
 * @returns A fully configured FCL instance with all core methods and services
 *
 * @example
 * // Basic FCL instance creation
 * import { createFcl } from "@onflow/fcl"
 *
 * const fcl = createFcl({
 *   accessNodeUrl: "https://rest-testnet.onflow.org",
 *   computeLimit: 1000,
 *   flowNetwork: "testnet"
 * })
 *
 * // Use the instance for authentication
 * const user = await fcl.currentUser.authenticate()
 * console.log("Authenticated user:", user.addr)
 */
export function createFcl(
  params: WithOptionalProperties<
    Parameters<typeof createFclCore>[0],
    "platform" | "storage"
  >
) {
  const fclCore = createFclCore({
    ...params,
    platform: "web",
    storage: params.storage || LOCAL_STORAGE,
  })

  return {
    ...fclCore,
  }
}
