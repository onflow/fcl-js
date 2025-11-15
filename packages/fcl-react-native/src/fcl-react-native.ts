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
  getServiceRegistry,
  setIsReactNative,
} from "@onflow/fcl-core"

// Eagerly start loading AsyncStorage when module loads
// This ensures storage is ready before any component subscribes to currentUser
const storagePromise = getAsyncStorage()

export const currentUser = getCurrentUser({
  platform: "react-native",
  getStorageProvider: async () => {
    // This is needed to make fcl-react-native work like fcl
    await storagePromise
    const configStorage = await config().get("fcl.storage")
    const baseStorage: any = configStorage || (await storagePromise)

    // Wrap storage to fix loggedIn state initialization
    // This happens when storage is checked before proper initialization, so we need to wrap the storage to fix it.
    return {
      can: baseStorage.can,
      get: async (key: string) => {
        const value = await baseStorage.get(key)
        if (key === "CURRENT_USER") {
          if (!value) {
            return {
              f_type: "User",
              f_vsn: "1.0.0",
              addr: null,
              cid: null,
              loggedIn: false,
              expiresAt: null,
              services: [],
            }
          }

          // Fix corrupted stored user with loggedIn: null
          if (value.loggedIn === null) {
            // Update storage with corrected value
            const correctedValue = {...value, loggedIn: false}
            await baseStorage.put(key, correctedValue)
            return correctedValue
          }
        }
        return value
      },
      put: baseStorage.put,
      removeItem: baseStorage.removeItem,
    }
  },
})
export const mutate = getMutate(currentUser)

export const authenticate = (opts = {}) => currentUser().authenticate(opts)
export const unauthenticate = () => currentUser().unauthenticate()
export const reauthenticate = (opts = {}) => {
  currentUser().unauthenticate()
  return currentUser().authenticate(opts)
}
export const signUp = (opts = {}) => currentUser().authenticate(opts)
export const logIn = (opts = {}) => currentUser().authenticate(opts)

export const authz = currentUser().authorization

import {config} from "@onflow/config"
import {
  coreStrategies,
  getDefaultConfig,
  useServiceDiscovery,
  ServiceDiscovery,
} from "./utils/react-native"
import {getAsyncStorage} from "./utils/react-native/storage"
import {initFclWcLoader} from "./utils/walletconnect/loader"

config(getDefaultConfig())

// Set chain id default on access node change
initServiceRegistry({coreStrategies})

// Set isReactNative flag
setIsReactNative(true)

// Automatically load WalletConnect plugin based on config
initFclWcLoader()

export {useServiceDiscovery, ServiceDiscovery, getServiceRegistry}

// Subscriptions
export {subscribe} from "@onflow/fcl-core"
export {subscribeRaw} from "@onflow/fcl-core"

// WalletConnect
export * from "./walletconnect"

export * from "@onflow/typedefs"

export {createFlowClient, type FlowClientConfig} from "./client"
