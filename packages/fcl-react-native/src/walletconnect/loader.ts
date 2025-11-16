import {config} from "@onflow/config"
import {pluginRegistry} from "@onflow/fcl-core"
import {initLazy} from "./client"

// Flow Reference Wallet configuration
const FLOW_REFERENCE_WALLET = {
  name: "Flow Reference Wallet",
  description: "Connect to Flow Reference Wallet via WalletConnect",
  homepage: "https://frw.gitbook.io/",
  uid: "https://link.wallet.flow.com/wc",
  provider: {
    name: "Flow Reference Wallet",
    icon: "https://frw-link.s3.amazonaws.com/logo.png",
    description: "Digital wallet created for everyone.",
    website: "https://frw.gitbook.io/",
  },
}

interface WalletConnectConfig {
  walletConnectProjectId?: string
  walletConnectRedirect?: string
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
  const redirect = wcConfig.walletConnectRedirect

  if (!projectId) {
    return
  }

  if (isLoaded) {
    return
  }

  isLoaded = true

  // Merge Flow Reference Wallet (default) with any custom wallets from config
  const wallets = [
    FLOW_REFERENCE_WALLET,
    ...(wcConfig.walletConnectWallets || []),
  ]

  const {FclWcServicePlugin} = initLazy({
    projectId,
    metadata: getMetadata(wcConfig),
    redirect: redirect || "",
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
      walletConnectRedirect: fullConfig["walletconnect.redirect"],
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
