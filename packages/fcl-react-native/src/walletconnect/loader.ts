import {config} from "@onflow/config"
import {pluginRegistry} from "@onflow/fcl-core"
import {initLazy} from "./client"

interface WalletConnectConfig {
  walletConnectProjectId?: string
  walletConnectDisableNotifications?: boolean
  walletConnectWallets?: any[]
  appDetailTitle?: string
  appDetailIcon?: string
  appDetailDescription?: string
  appDetailUrl?: string
}

function getMetadata(wcConfig: WalletConnectConfig) {
  return {
    name: wcConfig.appDetailTitle || "FCL App",
    description: wcConfig.appDetailDescription || "An FCL App",
    url: wcConfig.appDetailUrl || "",
    icons: wcConfig.appDetailIcon ? [wcConfig.appDetailIcon] : [],
  }
}

let isLoaded = false

function loadFclWc(wcConfig: WalletConnectConfig) {
  const projectId = wcConfig.walletConnectProjectId

  if (!projectId) {
    return
  }

  if (isLoaded) {
    return
  }

  isLoaded = true

  // Use custom wallets from config (if any)
  // Flow Wallet is automatically provided by Discovery API
  const wallets = wcConfig.walletConnectWallets || []

  const {FclWcServicePlugin} = initLazy({
    projectId,
    metadata: getMetadata(wcConfig),
    disableNotifications:
      wcConfig.walletConnectDisableNotifications ?? undefined,
    wallets: wallets,
  })

  pluginRegistry.add([FclWcServicePlugin])
}

export function initFclWcLoader() {
  config.subscribe(async (fullConfig: any) => {
    const wcConfig: WalletConnectConfig = {
      walletConnectProjectId: fullConfig["walletconnect.projectId"],
      walletConnectDisableNotifications:
        fullConfig["walletconnect.disableNotifications"],
      walletConnectWallets: fullConfig["walletconnect.wallets"],
      appDetailTitle: fullConfig["app.detail.title"],
      appDetailIcon: fullConfig["app.detail.icon"],
      appDetailDescription: fullConfig["app.detail.description"],
      appDetailUrl: fullConfig["app.detail.url"],
    }

    loadFclWc(wcConfig)
  })
}

export {loadFclWc}
