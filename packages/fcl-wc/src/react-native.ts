/**
 * React Native entry point for fcl-wc.
 *
 * Import from "@onflow/fcl-wc/react-native" instead of "@onflow/fcl-wc"
 * to avoid bundling browser-specific code (CSS, modals, etc).
 *
 * Usage:
 * ```typescript
 * import {
 *   makeServicePlugin,
 *   createSignClientAdapter,
 *   createRNPlatformAdapter,
 *   initializeSignClient,
 * } from "@onflow/fcl-wc/react-native"
 * ```
 */

// Core service plugin (platform-agnostic)
export {makeServicePlugin} from "./service"

// Session handling (platform-agnostic)
export {createSessionProposal, request, makeSessionData} from "./session"

// Constants
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

// React Native specific adapters
export {createSignClientAdapter} from "./adapters/sign-client-adapter"
export {
  createRNPlatformAdapter,
  validateSessionNetwork,
} from "./adapters/rn-platform-adapter"

// React Native SignClient initialization
export {initializeSignClient} from "./platform/sign-client-init"
