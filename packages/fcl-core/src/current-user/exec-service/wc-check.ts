import * as logger from "@onflow/util-logger"
import {getServiceRegistry} from "./plugins"

const FCL_WC_SERVICE_METHOD = "WC/RPC"

const isServerSide = typeof window === "undefined"

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
