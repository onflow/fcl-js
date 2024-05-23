import * as logger from "@onflow/util-logger"
import {getServiceRegistry} from "./plugins"

const FC_WC_SERVICE_METHOD = "EXT/WC"

// Utility to notify the user if the Walletconnect service plugin has not been loaded
export function checkWalletConnectEnabled() {
  const serviceRegistry = getServiceRegistry()
  const strategies = serviceRegistry.getStrategies()

  if (!strategies.includes(FC_WC_SERVICE_METHOD)) {
    // TODO: Add link to documentation
    logger.log({
      title: "FCL WalletConnect Service Plugin",
      level: logger.LEVELS.error,
      message:
        "All dApps are expected to register for a WalletConnect projectId & add this to their FCL configuration.  If you do not do so, users will be unable to use certain wallets to interact with your dApp.  See <<DOC LINK>> for more information.",
    })
  }
}
