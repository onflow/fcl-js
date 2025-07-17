export {
  VERSION,
  query,
  queryRaw,
  verifyUserSignatures,
  serialize,
  tx,
  events,
  pluginRegistry,
  discovery,
  t,
  WalletUtils,
  AppUtils,
  InteractionTemplateUtils,
  getChainId,
  TestUtils,
  config,
  flowMainnet,
  flowTestnet,
  flowEmulator,
  send,
  decode,
  account,
  block,
  isOk,
  isBad,
  why,
  pipe,
  build,
  withPrefix,
  sansPrefix,
  display,
  cadence,
  cdc,
  createSignableVoucher,
  voucherIntercept,
  voucherToTxId,
  transaction,
  script,
  ping,
  atBlockHeight,
  atBlockId,
  getAccount,
  getEvents,
  getEventsAtBlockHeightRange,
  getEventsAtBlockIds,
  getBlock,
  getBlockHeader,
  getCollection,
  getTransactionStatus,
  getTransaction,
  getNetworkParameters,
  getNodeVersionInfo,
  authorizations,
  authorization,
  args,
  arg,
  proposer,
  payer,
  limit,
  ref,
  params,
  param,
  validator,
  invariant,
  subscribeEvents,
  nodeVersionInfo,
  TransactionError,
} from "@onflow/fcl-core"

import {
  getMutate,
  getCurrentUser,
  initServiceRegistry,
  StorageProvider,
} from "@onflow/fcl-core"
import {discoveryOpts} from "./instance"

/**
 * @description The main current user service for managing user authentication and authorization in Flow applications.
 * This service provides a complete interface for wallet connections, user sessions, transaction signing, and user data management.
 * It handles the complexity of connecting to various FCL-compatible wallets, managing authentication state, and providing
 * authorization functions for transaction signing.
 *
 * The currentUser service is configured for web platforms and uses the browser's localStorage by default for session persistence.
 * It integrates with Flow's discovery service to enable wallet selection and supports both authentication and re-authentication flows.
 *
 * This service is reactive and provides subscription capabilities to monitor authentication state changes in real-time.
 * All wallet interactions are handled through FCL's standardized protocols, ensuring compatibility with the Flow ecosystem.
 *
 * Returns an object with the following methods:
 * ```typescript
 * {
 *   authenticate,        // Authenticates the user via FCL-compatible wallets
 *   unauthenticate,      // Logs out the current user and clears session data
 *   authorization,       // Produces authorization details for transaction signing
 *   signUserMessage,     // Signs arbitrary messages with the user's wallet
 *   subscribe,           // Subscribes to authentication state changes
 *   snapshot,            // Returns the current user object snapshot
 *   resolveArgument      // Resolves the current user as a transaction argument
 * }
 * ```
 *
 * @returns A CurrentUserService object
 *
 * @example
 * // Basic authentication flow
 * import * as fcl from "@onflow/fcl"
 *
 * // Configure FCL
 * fcl.config({
 *   "accessNode.api": "https://rest-testnet.onflow.org",
 *   "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
 *   "flow.network": "testnet"
 * })
 *
 * // Authenticate user
 * const user = await fcl.currentUser.authenticate()
 * console.log("User authenticated:", user.addr)
 *
 * // Check authentication status
 * const currentUser = await fcl.currentUser.snapshot()
 * if (currentUser.loggedIn) {
 *   console.log("User is logged in:", currentUser.addr)
 * }
 *
 * // Subscribe to authentication state changes
 * import * as fcl from "@onflow/fcl"
 *
 * const unsubscribe = fcl.currentUser.subscribe((user) => {
 *   if (user.loggedIn) {
 *     console.log("User logged in:", user.addr)
 *     document.getElementById("login-btn").style.display = "none"
 *     document.getElementById("logout-btn").style.display = "block"
 *   } else {
 *     console.log("User logged out")
 *     document.getElementById("login-btn").style.display = "block"
 *     document.getElementById("logout-btn").style.display = "none"
 *   }
 * })
 * // Clean up subscription when component unmounts
 * window.addEventListener("beforeunload", () => unsubscribe())
 */
export const currentUser = getCurrentUser({
  platform: "web",
  discovery: discoveryOpts,
  getStorageProvider: async () => {
    return (
      (await config.get<StorageProvider | null>("fcl.storage")) || LOCAL_STORAGE
    )
  },
})

/**
 * @description A transaction execution function that allows you to submit Cadence transactions to the Flow blockchain
 * to mutate on-chain state. This function handles the complete transaction lifecycle including building, signing, and
 * sending transactions to Flow. It provides a high-level interface that abstracts the complexity of transaction
 * construction while offering flexibility for advanced use cases.
 *
 * The mutate function automatically handles authorization using the current authenticated user by default, but allows
 * for custom authorization functions to be specified for different transaction roles (proposer, payer, authorizer).
 * It supports both simple single-party transactions and complex multi-party transactions with different signatories.
 *
 * This function integrates with FCL's address replacement system, allowing you to use placeholder addresses in your
 * Cadence code that are replaced with actual addresses at execution time. It also supports Interaction Templates
 * for standardized transaction execution patterns.
 *
 * The mutate function accepts a configuration object with the following structure:
 * ```typescript
 * {
 *   cadence?: string,                    // The Cadence transaction code to execute (required if template not provided)
 *   args?: Function,                     // Function that returns an array of arguments for the transaction
 *   template?: any,                      // Interaction Template object or URL for standardized transactions
 *   limit?: number,                      // Compute (gas) limit for the transaction execution
 *   authz?: AccountAuthorization,        // Authorization function for all signatory roles (proposer, payer, authorizer)
 *   proposer?: AccountAuthorization,     // Specific authorization function for the proposer role
 *   payer?: AccountAuthorization,        // Specific authorization function for the payer role
 *   authorizations?: AccountAuthorization[]  // Array of authorization functions for authorizer roles
 * }
 * ```
 *
 * @param opts Transaction configuration options
 *
 * @returns Promise that resolves to the transaction ID (txId) when the transaction is submitted
 *
 * @throws Throws an error if transaction validation fails, required configuration is missing,
 * or transaction execution encounters an error
 *
 * @example
 * // Basic transaction submission
 * import * as fcl from "@onflow/fcl"
 *
 * // Configure FCL first
 * fcl.config({
 *   "accessNode.api": "https://rest-testnet.onflow.org",
 *   "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
 *   "flow.network": "testnet"
 * })
 *
 * // Authenticate user
 * await fcl.authenticate()
 *
 * // Submit a basic transaction
 * const txId = await fcl.mutate({
 *   cadence: `
 *     transaction(message: String) {
 *       prepare(account: AuthAccount) {
 *         log("Transaction executed by: ".concat(account.address.toString()))
 *         log("Message: ".concat(message))
 *       }
 *     }
 *   `,
 *   args: (arg, t) => [
 *     arg("Hello Flow!", t.String)
 *   ],
 *   limit: 50
 * })
 *
 * console.log("Transaction submitted:", txId)
 */
export const mutate = getMutate(currentUser)

/**
 * @description Calling this method will authenticate the current user via any wallet that supports FCL. Once called, FCL will initiate communication with the configured `discovery.wallet` endpoint which lets the user select a wallet to authenticate with. Once the wallet provider has authenticated the user, FCL will set the values on the current user object for future use and authorization.
 *
 * This method can only be used in web browsers.
 *
 * `discovery.wallet` value must be set in the configuration before calling this method. See FCL Configuration.
 *
 * The default discovery endpoint will open an iframe overlay to let the user choose a supported wallet.
 *
 * `authenticate` can also take a service returned from discovery with `fcl.authenticate({ service })`.
 *
 * @param opts Authentication options
 * @param opts.service Optional service to use for authentication. A service returned from discovery can be passed here.
 * @param opts.redir Optional redirect flag. Defaults to false.
 * @param opts.forceReauth Optional force re-authentication flag. Defaults to false.
 * @returns Promise that resolves to the authenticated CurrentUser object or undefined
 *
 * @example
 * import * as fcl from '@onflow/fcl';
 * fcl
 *   .config()
 *   .put('accessNode.api', 'https://rest-testnet.onflow.org')
 *   .put('discovery.wallet', 'https://fcl-discovery.onflow.org/testnet/authn');
 * // anywhere on the page
 * fcl.authenticate();
 */
export const authenticate = (opts = {}) => currentUser().authenticate(opts)

/**
 * @description Logs out the current user and sets the values on the current user object to null.
 *
 * This method can only be used in web browsers.
 *
 * The current user must be authenticated first.
 *
 * @example
 * import * as fcl from '@onflow/fcl';
 * fcl.config().put('accessNode.api', 'https://rest-testnet.onflow.org');
 * // first authenticate to set current user
 * fcl.authenticate();
 * // ... somewhere else & sometime later
 * fcl.unauthenticate();
 * // fcl.currentUser.loggedIn === null
 */
export const unauthenticate = () => currentUser().unauthenticate()

/**
 * @description A convenience method that calls `fcl.unauthenticate()` and then `fcl.authenticate()` for the current user.
 *
 * This method can only be used in web browsers.
 *
 * The current user must be authenticated first.
 *
 * @param opts Authentication options passed to authenticate method
 * @param opts.service Optional service to use for authentication
 * @param opts.redir Optional redirect flag. Defaults to false.
 * @param opts.forceReauth Optional force re-authentication flag. Defaults to false.
 * @returns Promise that resolves to the authenticated CurrentUser object or undefined
 *
 * @example
 * import * as fcl from '@onflow/fcl';
 * // first authenticate to set current user
 * fcl.authenticate();
 * // ... somewhere else & sometime later
 * fcl.reauthenticate();
 * // logs out user and opens up login/sign-up flow
 */
export const reauthenticate = (opts = {}) => {
  currentUser().unauthenticate()
  return currentUser().authenticate(opts)
}

/**
 * @description A convenience method that calls and is equivalent to `fcl.authenticate()`.
 *
 * This method can only be used in web browsers.
 *
 * @param opts Authentication options passed to authenticate method
 * @param opts.service Optional service to use for authentication
 * @param opts.redir Optional redirect flag. Defaults to false.
 * @param opts.forceReauth Optional force re-authentication flag. Defaults to false.
 * @returns Promise that resolves to the authenticated CurrentUser object or undefined
 *
 * @example
 * import * as fcl from '@onflow/fcl';
 * fcl.config()
 *   .put('accessNode.api', 'https://rest-testnet.onflow.org')
 *   .put('discovery.wallet', 'https://fcl-discovery.onflow.org/testnet/authn');
 *
 * // User clicks sign up button
 * fcl.signUp();
 */
export const signUp = (opts = {}) => currentUser().authenticate(opts)

/**
 * @description A convenience method that calls and is equivalent to `fcl.authenticate()`.
 *
 * This method can only be used in web browsers.
 *
 * @param opts Authentication options passed to authenticate method
 * @param opts.service Optional service to use for authentication
 * @param opts.redir Optional redirect flag. Defaults to false.
 * @param opts.forceReauth Optional force re-authentication flag. Defaults to false.
 * @returns Promise that resolves to the authenticated CurrentUser object or undefined
 *
 * @example
 * import * as fcl from '@onflow/fcl';
 * fcl.config()
 *   .put('accessNode.api', 'https://rest-testnet.onflow.org')
 *   .put('discovery.wallet', 'https://fcl-discovery.onflow.org/testnet/authn');
 *
 * // User clicks log in button
 * fcl.logIn();
 */
export const logIn = (opts = {}) => currentUser().authenticate(opts)

/**
 * @description A convenience method that produces the needed authorization details for the current user to submit transactions to Flow. It defines a signing function that connects to a user's wallet provider to produce signatures to submit transactions.
 *
 * You can replace this function with your own authorization function if needed.
 *
 * @returns An object containing the necessary details from the current user to authorize a transaction in any role.
 *
 * @example
 * import * as fcl from '@onflow/fcl';
 * // login somewhere before
 * fcl.authenticate();
 * // once logged in authz will produce values
 * console.log(fcl.authz);
 * // prints {addr, signingFunction, keyId, sequenceNum} from the current authenticated user.
 *
 * const txId = await fcl.mutate({
 *   cadence: `
 *     import Profile from 0xba1132bc08f82fe2
 *
 *     transaction(name: String) {
 *       prepare(account: auth(BorrowValue) &Account) {
 *         account.storage.borrow<&{Profile.Owner}>(from: Profile.privatePath)!.setName(name)
 *       }
 *     }
 *   `,
 *   args: (arg, t) => [arg('myName', t.String)],
 *   proposer: fcl.authz, // optional - default is fcl.authz
 *   payer: fcl.authz, // optional - default is fcl.authz
 *   authorizations: [fcl.authz], // optional - default is [fcl.authz]
 * });
 *
 * @note The default values for `proposer`, `payer`, and `authorizations` are already `fcl.authz` so there is no need to include these parameters, it is shown only for example purposes.
 */
export const authz = currentUser().authorization

import {config} from "@onflow/config"
import {getDefaultConfig, coreStrategies, LOCAL_STORAGE} from "./utils/web"
import {initFclWcLoader} from "./utils/walletconnect/loader"

config(getDefaultConfig())

initServiceRegistry({coreStrategies})

// Automatically load fcl-wc plugin
// Based on the user's config
initFclWcLoader()

export {LOCAL_STORAGE, SESSION_STORAGE} from "./utils/web"

// Subscriptions
export {subscribe, subscribeRaw} from "@onflow/fcl-core"

export * from "@onflow/typedefs"
