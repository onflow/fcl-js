export {
  VERSION,
  query,
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
} from "@onflow/fcl-core"

import {
  getMutate,
  getCurrentUser,
  initServiceRegistry,
  setIsReactNative,
} from "@onflow/fcl-core"

export const currentUser = getCurrentUser({
  platform: "react-native",
  getStorageProvider: async () => {
    return (await config().get("fcl.storage")) || getAsyncStorage()
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

config(getDefaultConfig())

// Set chain id default on access node change
initServiceRegistry({coreStrategies})

// Set isReactNative flag
setIsReactNative(true)

export {useServiceDiscovery, ServiceDiscovery}
