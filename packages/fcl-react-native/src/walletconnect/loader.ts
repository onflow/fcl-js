import {config} from "@onflow/config"
import {pluginRegistry} from "@onflow/fcl-core"
import {initLazy} from "./client"

// Flow Reference Wallet icon (SVG data URI)
// Using expo-image component which supports SVG (unlike React Native's standard Image)
const FLOW_WALLET_ICON = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDI1MCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnIGNsaXAtcGF0aD0idXJsKCNjbGlwMF8xN182OTM0KSI+CjxyZWN0IHdpZHRoPSIyNTAiIGhlaWdodD0iMjUwIiBmaWxsPSIjMkNERTc4Ii8+CjxjaXJjbGUgY3g9IjEyNSIgY3k9IjEyNSIgcj0iODMiIGZpbGw9IndoaXRlIi8+CjxyZWN0IHg9IjExNCIgeT0iMTEyIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9IiM0MUNDNUQiLz4KPHJlY3QgeD0iMTM4IiB5PSIxMTIiIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgZmlsbD0iYmxhY2siLz4KPC9nPgo8ZGVmcz4KPGNsaXBQYXRoIGlkPSJjbGlwMF8xN182OTM0Ij4KPHJlY3Qgd2lkdGg9IjI1MCIgaGVpZ2h0PSIyNTAiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==`

// Flow Reference Wallet configuration
const FLOW_WALLET = {
  name: "Flow Wallet",
  description: "Digital wallet created for everyone.",
  homepage: "https://wallet.flow.com",
  uid: "https://link.wallet.flow.com/wc",
  provider: {
    name: "Flow Wallet",
    icon: FLOW_WALLET_ICON,
    description: "Digital wallet created for everyone.",
    website: "https://wallet.flow.com",
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
  const wallets = [FLOW_WALLET, ...(wcConfig.walletConnectWallets || [])]

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
