// Main exports
export {init, initLazy, getClient} from "./client"
export type {FclWalletConnectConfig} from "./client"

// Re-export everything from fcl-wc/react-native
export {
  createSessionProposal,
  request,
  makeSessionData,
  makeServicePlugin,
  FLOW_METHODS,
  SERVICE_PLUGIN_NAME,
  WC_SERVICE_METHOD,
  REQUEST_TYPES,
  createSignClientAdapter,
  createRNPlatformAdapter,
  validateSessionNetwork,
  initializeSignClient,
} from "@onflow/fcl-wc/react-native"

// Re-export adapter types
export type {
  WcClientAdapter,
  WcConnectOpts,
  WcRequestOpts,
  WcDisconnectReason,
  PlatformAdapter,
  NotificationHandle,
} from "@onflow/fcl-wc/react-native"
