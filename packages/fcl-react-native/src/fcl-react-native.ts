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

import {getClient} from "./walletconnect/client"

// Eagerly start loading AsyncStorage when module loads
// This ensures storage is ready before any component subscribes to currentUser
const storagePromise = getAsyncStorage()

export const currentUser = getCurrentUser({
  platform: "react-native",
  getStorageProvider: async () => {
    // Wait for eager-loaded storage to be ready
    await storagePromise
    return (await config().get("fcl.storage")) || (await storagePromise)
  },
})
export const mutate = getMutate(currentUser)

export const authenticate = (opts = {}) => currentUser().authenticate(opts)

export const unauthenticate = async () => {
  // First unauthenticate from FCL
  currentUser().unauthenticate()

  // Then disconnect all WalletConnect sessions
  try {
    const client = await getClient()
    if (client) {
      const sessions = client.session.getAll()
      console.log(`Disconnecting ${sessions.length} WalletConnect session(s)`)
      for (const session of sessions) {
        await client.disconnect({
          topic: session.topic,
          reason: {
            code: 6000,
            message: "User disconnected",
          },
        })
      }
    }
  } catch (error) {
    console.warn("Failed to disconnect WalletConnect sessions:", error)
  }
}

export const reauthenticate = async (opts = {}) => {
  await unauthenticate()
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
import {initFclWcLoader} from "./walletconnect/loader"

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
