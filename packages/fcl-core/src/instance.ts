import {httpTransport} from "@onflow/transport-http"
import {createVerifyUserSignatures} from "./app-utils/verify-signatures"
import {createFCLContext} from "./context/index"
import {createMutate} from "./exec/mutate"
import {createQuery} from "./exec/query"
import {createQueryRaw} from "./exec/query-raw"
import {createTransaction} from "./transaction"
import {createEvents} from "./events"
import {createGetChainId} from "./utils"

type WithOptionalProperties<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>

/**
 * @description Creates a configured FCL (Flow Client Library) core instance.
 * This function initializes FCL with the core functionality needed to interact
 * with the Flow blockchain, providing a complete interface for blockchain operations.
 *
 * The created FCL instance includes all core functionality for:
 * - User authentication and wallet connections
 * - Transaction submission and monitoring
 * - Blockchain queries and event subscriptions
 * - Configuration management
 * - Discovery service integration
 * - SDK method access
 *
 * This function automatically configures the HTTP transport and creates all necessary
 * services and utilities. The transport parameter is optional and defaults to HTTP transport.
 *
 * @param params Configuration parameters for the FCL instance
 * @param params.accessNodeUrl URL of the Flow access node (e.g., "https://rest-testnet.onflow.org")
 * @param params.computeLimit Default compute limit for transactions and queries
 * @param params.customResolver Optional custom resolver for address replacement
 * @param params.customDecoders Optional custom decoders for response parsing
 * @param params.contracts Optional contract address mappings
 * @param params.platform Platform identifier (e.g., "web", "mobile", "extension")
 * @param params.discoveryWallet Optional discovery wallet endpoint
 * @param params.discoveryWalletMethod Optional discovery wallet method
 * @param params.defaultComputeLimit Optional default compute limit override
 * @param params.flowNetwork Optional Flow network identifier
 * @param params.serviceOpenIdScopes Optional OpenID scopes for services
 * @param params.walletconnectProjectId Optional WalletConnect project ID
 * @param params.walletconnectDisableNotifications Optional flag to disable WalletConnect notifications
 * @param params.storage Storage provider for session persistence
 * @param params.discovery Optional discovery configuration with execStrategy
 * @param params.transport Optional transport layer (defaults to HTTP transport)
 *
 * @returns A fully configured FCL instance with all core methods and services including:
 * - currentUser: User authentication and management service
 * - config: Configuration management service
 * - mutate: Transaction submission function
 * - query: Blockchain query function
 * - queryRaw: Raw blockchain query function
 * - verifyUserSignatures: User signature verification
 * - getChainId: Chain ID retrieval
 * - tx: Transaction monitoring utilities
 * - events: Event subscription utilities
 * - authenticate: User authentication method
 * - unauthenticate: User logout method
 * - signUserMessage: Message signing method
 * - All SDK methods (send, decode, subscribe, etc.)
 *
 * @example
 * // Basic FCL instance creation
 * import { createFcl } from "@onflow/fcl-core"
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
 *
 * // Submit a transaction
 * const txId = await fcl.mutate({
 *   cadence: `
 *     transaction {
 *       execute { log("Hello, Flow!") }
 *     }
 *   `
 * })
 *
 * // Query the blockchain
 * const result = await fcl.query({
 *   cadence: `
 *     pub fun main(): Int {
 *       return 42
 *     }
 *   `
 * })
 */
export function createFcl(
  params: WithOptionalProperties<
    Parameters<typeof createFCLContext>[0],
    "transport"
  >
) {
  const context = createFCLContext({...params, transport: httpTransport})

  return {
    // Global services
    currentUser: context.currentUser,
    config: context.config,

    // Execution methods
    mutate: createMutate(context),
    query: createQuery(context),
    queryRaw: createQueryRaw(context),
    verifyUserSignatures: createVerifyUserSignatures(context),
    getChainId: createGetChainId(context),

    // Streaming helpers
    tx: createTransaction(context),
    events: createEvents(context),

    // Authentication methods
    authenticate: context.currentUser.authenticate,
    unauthenticate: context.currentUser.unauthenticate,
    signUserMessage: context.currentUser.signUserMessage,

    // Re-export the SDK methods
    ...context.sdk,
  }
}
