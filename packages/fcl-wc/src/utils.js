import {log} from "@onflow/util-logger"

const makeFlowWcWalletServices = wallets => {
  return Object.values(wallets)
    .filter(w => w.app_type === "wallet")
    .map(wallet => {
      return {
        f_type: "Service",
        f_vsn: "1.0.0",
        type: "authn",
        method: "WC/RPC",
        uid: wallet.id,
        endpoint: "flow_authn",
        optIn: false,
        provider: {
          address: wallet.id,
          name: wallet.name,
          icon: wallet.image_url?.sm,
          description: wallet.description,
          website: wallet.mobile?.universal,
          color: wallet.metadata?.colors?.primary,
          supportEmail: null,
        },
      }
    })
}

export async function fetchFlowWallets() {
  try {
    const wallets = await fetch(
      "https://explorer-api.walletconnect.com/v1/wallets?entries=5&page=1&search=flow"
    ).then(res => res.json())
    if (wallets.length === 0) return []
    const flowWcWalletServices = makeFlowWcWalletServices(wallets.listings)

    return flowWcWalletServices
  } catch (error) {
    log({
      title: `${error.name} Error connecting to WalletConnect API`,
      message: error.message,
      level: 1,
    })
  }
}

export function isAndroid() {
  return (
    typeof navigator !== "undefined" && /android/i.test(navigator.userAgent)
  )
}

export function isSmallIOS() {
  return (
    typeof navigator !== "undefined" && /iPhone|iPod/.test(navigator.userAgent)
  )
}

export function isLargeIOS() {
  return typeof navigator !== "undefined" && /iPad/.test(navigator.userAgent)
}

export function isIOS() {
  return isSmallIOS() || isLargeIOS()
}

export function isMobile() {
  return isAndroid() || isIOS()
}
