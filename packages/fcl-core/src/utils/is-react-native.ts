let _isReactNative: boolean = false

/**
 * @description Checks if the current environment is React Native. This function returns a boolean
 * indicating whether FCL is running in a React Native environment rather than a browser or Node.js.
 * This is useful for platform-specific functionality and enabling React Native-specific features.
 *
 * @returns True if running in React Native environment, false otherwise
 *
 * @example
 * // Check if running in React Native
 * import * as fcl from "@onflow/fcl"
 *
 * if (fcl.isReactNative()) {
 *   console.log("Running in React Native")
 *   // Use React Native specific wallet integrations
 *   // Enable deep linking for wallet connections
 * } else {
 *   console.log("Running in browser or Node.js")
 *   // Use web-based wallet integrations
 * }
 */
export function isReactNative(): boolean {
  return _isReactNative
}

/**
 * @description Sets the React Native environment flag for FCL. This function should be called during
 * initialization of React Native applications to inform FCL that it's running in a React Native
 * environment. This enables React Native-specific behaviors and optimizations.
 *
 * @param value True to indicate React Native environment, false otherwise
 *
 * @example
 * // Set React Native flag during app initialization
 * import * as fcl from "@onflow/fcl"
 *
 * // In your React Native app's entry point (e.g., App.js)
 * fcl.setIsReactNative(true)
 *
 * // Configure FCL for React Native
 * fcl.config({
 *   "accessNode.api": "https://rest-testnet.onflow.org",
 *   "discovery.wallet": "https://fcl-discovery.onflow.org/api/testnet/authn"
 * })
 */
export function setIsReactNative(value: boolean): void {
  _isReactNative = value
}
