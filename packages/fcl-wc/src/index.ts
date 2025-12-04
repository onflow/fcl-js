// Main exports
export {init, initLazy, getProvider} from "./fcl-wc"
export type {FclWalletConnectConfig} from "./fcl-wc"
export {createSessionProposal, request, makeSessionData} from "./session"
export {makeServicePlugin} from "./service"
export {
  FLOW_METHODS,
  SERVICE_PLUGIN_NAME,
  WC_SERVICE_METHOD,
  REQUEST_TYPES,
} from "./constants"

// Adapter types for cross-platform support
export type {
  WcClientAdapter,
  WcConnectOpts,
  WcRequestOpts,
  WcDisconnectReason,
  PlatformAdapter,
  NotificationHandle,
} from "./types/adapters"

// Universal provider adapter (can be used by any platform that uses UniversalProvider)
export {createUniversalProviderAdapter} from "./adapters/universal-provider-adapter"

// Note: Browser platform adapter is NOT exported from the main entry point
// because it imports browser-specific code (CSS, Preact notifications) that
// can't be bundled by React Native. It's used internally by service.ts for web.
// React Native should provide its own platform adapter.
