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

// Get AsyncStorage instance when module loads
// This ensures storage is ready before any component subscribes to currentUser
const storageInstance = getAsyncStorage()

export const currentUser = getCurrentUser({
  platform: "react-native",
  getStorageProvider: async () => {
    return (await config().get("fcl.storage")) || storageInstance
  },
})
export const mutate = getMutate(currentUser)

export const authenticate = (opts = {}) => currentUser().authenticate(opts)

export const unauthenticate = async () => {
  // First unauthenticate from FCL
  currentUser().unauthenticate()

  // Then disconnect WalletConnect (both sessions and pairings for complete cleanup)
  try {
    const client = await getClient()
    if (!client) return

    const sessions = client.session.getAll()
    const pairings = client.core.pairing.pairings.getAll()

    // Disconnect all in parallel
    await Promise.allSettled([
      ...sessions.map((session: any) =>
        client.disconnect({
          topic: session.topic,
          reason: {code: 6000, message: "User disconnected"},
        })
      ),
      ...pairings.map((pairing: any) =>
        client.core.pairing.disconnect({topic: pairing.topic})
      ),
    ])
  } catch {
    // WC client not initialized or disconnect failed (safe to ignore)
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
  ConnectModal,
  ConnectModalProvider,
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

export {
  useServiceDiscovery,
  ConnectModal,
  ConnectModalProvider,
  getServiceRegistry,
}

// Subscriptions
export {subscribe} from "@onflow/fcl-core"
export {subscribeRaw} from "@onflow/fcl-core"

// WalletConnect
export * from "./walletconnect"

export * from "@onflow/typedefs"

export {createFlowClient, type FlowClientConfig} from "./client"
