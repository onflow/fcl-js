export {createGetChainId} from "./chain-id/get-chain-id"
export {watchForChainIdChanges} from "./chain-id/chain-id-watcher"

/**
 * @description Detects if the current environment is running on an Android device by checking the user agent string.
 *
 * @returns True if running on Android, false otherwise
 *
 * @example
 * import * as fcl from "@onflow/fcl"
 *
 * if (fcl.isAndroid()) {
 *   console.log("Running on Android device")
 *   // Show Android-specific UI or behavior
 * }
 */
export function isAndroid(): boolean {
  return (
    typeof navigator !== "undefined" && /android/i.test(navigator.userAgent)
  )
}

/**
 * @description Detects if the current environment is running on a small iOS device (iPhone or iPod Touch)
 * by checking the user agent string.
 *
 * @returns True if running on iPhone or iPod Touch, false otherwise
 *
 * @example
 * import * as fcl from "@onflow/fcl"
 *
 * if (fcl.isSmallIOS()) {
 *   console.log("Running on iPhone or iPod")
 *   // Adjust UI for smaller screen
 * }
 */
export function isSmallIOS(): boolean {
  return (
    typeof navigator !== "undefined" && /iPhone|iPod/.test(navigator.userAgent)
  )
}

/**
 * @description Detects if the current environment is running on a large iOS device (iPad)
 * by checking the user agent string.
 *
 * @returns True if running on iPad, false otherwise
 *
 * @example
 * import * as fcl from "@onflow/fcl"
 *
 * if (fcl.isLargeIOS()) {
 *   console.log("Running on iPad")
 *   // Show tablet-optimized layout
 * }
 */
export function isLargeIOS(): boolean {
  return typeof navigator !== "undefined" && /iPad/.test(navigator.userAgent)
}

/**
 * @description Detects if the current environment is running on any iOS device (iPhone, iPod, or iPad).
 * This is a convenience function that combines isSmallIOS() and isLargeIOS().
 *
 * @returns True if running on any iOS device, false otherwise
 *
 * @example
 * import * as fcl from "@onflow/fcl"
 *
 * if (fcl.isIOS()) {
 *   console.log("Running on iOS device")
 *   // Apply iOS-specific styles or behaviors
 * }
 */
export function isIOS(): boolean {
  return isSmallIOS() || isLargeIOS()
}

/**
 * @description Detects if the current environment is running on a mobile device (Android or iOS).
 * This is useful for providing mobile-optimized experiences or enabling mobile-specific features.
 *
 * @returns True if running on a mobile device, false otherwise
 *
 * @example
 * import * as fcl from "@onflow/fcl"
 *
 * if (fcl.isMobile()) {
 *   console.log("Running on mobile device")
 *   // Enable touch gestures, mobile wallet connections, etc.
 * } else {
 *   console.log("Running on desktop")
 *   // Show desktop wallet options
 * }
 */
export function isMobile(): boolean {
  return isAndroid() || isIOS()
}
