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
  StorageProvider,
} from "@onflow/fcl-core"

import {execStrategyHook} from "./discovery/exec-hook"
const discoveryOpts = {
  execStrategy: execStrategyHook,
}

export const currentUser = getCurrentUser({
  platform: "web",
  discovery: discoveryOpts,
  getStorageProvider: async () => {
    return (
      (await config.get<StorageProvider | null>("fcl.storage")) || LOCAL_STORAGE
    )
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
import {getDefaultConfig, coreStrategies, LOCAL_STORAGE} from "./utils/web"
import {initFclWcLoader} from "./utils/walletconnect/loader"

config(getDefaultConfig())

initServiceRegistry({coreStrategies})

// Automatically load fcl-wc plugin
// Based on the user's config
initFclWcLoader()

export {LOCAL_STORAGE, SESSION_STORAGE} from "./utils/web"
