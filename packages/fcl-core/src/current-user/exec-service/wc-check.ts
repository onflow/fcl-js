import * as logger from "@onflow/util-logger"
import {getServiceRegistry} from "./plugins"

const FCL_WC_SERVICE_METHOD = "WC/RPC"

const isServerSide = typeof window === "undefined"

/**
 * @description Checks if WalletConnect service plugin is enabled and logs a warning if it's not.
 * This function verifies that the WalletConnect strategy is registered in the service registry.
 * It's called internally by FCL to notify developers about missing WalletConnect configuration,
 * which is required for users to connect with certain wallets.
 *
 * @example
 * // This function is called automatically by FCL, but can be used manually:
 * checkWalletConnectEnabled()
 * // If WalletConnect is not configured, an error will be logged to the console
 *
 * // To properly configure WalletConnect to avoid the warning:
 * import * as fcl from "@onflow/fcl"
 *
 * fcl.config({
 *   "app.detail.title": "My App",
 *   "walletconnect.projectId": "your-walletconnect-project-id"
 * })
 */
// Utility to notify the user if the Walletconnect service plugin has not been loaded
export function checkWalletConnectEnabled() {
  if (isServerSide) return

  const serviceRegistry = getServiceRegistry()
  const strategies = serviceRegistry.getStrategies()

  if (!strategies.includes(FCL_WC_SERVICE_METHOD)) {
    logger.log({
      title: "FCL WalletConnect Service Plugin",
      level: logger.LEVELS.error,
      message:
        "All dApps are expected to register for a WalletConnect projectId & add this to their FCL configuration.  If you do not do so, users will be unable to use certain wallets to interact with your dApp.  See https://developers.flow.com/tools/clients/fcl-js/configure-fcl for more information.",
    })
  }
}
