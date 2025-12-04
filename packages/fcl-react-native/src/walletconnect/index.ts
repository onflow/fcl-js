// Main exports
export {init, initLazy, getClient} from "./client"
export type {FclWalletConnectConfig} from "./client"

// Re-export shared session functions from fcl-wc
export {createSessionProposal, request, makeSessionData} from "@onflow/fcl-wc"

// Re-export constants (SERVICE_PLUGIN_NAME is RN-specific, others come from fcl-wc)
export {
  FLOW_METHODS,
  SERVICE_PLUGIN_NAME,
  WC_SERVICE_METHOD,
  REQUEST_TYPES,
} from "./constants"

// Re-export makeServicePlugin from fcl-wc (RN uses this with adapters)
export {makeServicePlugin} from "@onflow/fcl-wc"

// Export adapters for advanced usage
export {
  createSignClientAdapter,
  OPTIONAL_FLOW_METHODS,
  createRNPlatformAdapter,
  validateSessionNetwork,
} from "./adapters"
