import {log, LEVELS} from "@onflow/util-logger"
import {invariant} from "@onflow/util-invariant"
import * as fclCore from "@onflow/fcl-core"

const makeFlowServicesFromWallets = (wallets: any[]) => {
  return Object.values(wallets)
    .filter(w => w.app_type === "wallet")
    .map(wallet => {
      return {
        f_type: "Service",
        f_vsn: "1.0.0",
        type: "authn",
        method: "WC/RPC",
        uid: wallet.mobile?.universal,
        endpoint: "flow_authn",
        optIn: true,
        provider: {
          address: null,
          name: wallet.name,
          icon: wallet.image_url?.sm,
          description: wallet.description,
          website: wallet.homepage,
          color: wallet.metadata?.colors?.primary,
          supportEmail: null,
        },
      }
    })
}

export const fetchFlowWallets = async (projectId: string) => {
  try {
    const network = await fclCore.getChainId()
    const wcApiWallets = await fetch(
      `https://explorer-api.walletconnect.com/v3/wallets?projectId=${projectId}&chains=flow:${network}&entries=5&page=1`
    ).then(res => res.json())

    if (wcApiWallets?.count > 0) {
      return makeFlowServicesFromWallets(wcApiWallets.listings)
    }

    return []
  } catch (error) {
    if (error instanceof Error) {
      log({
        title: `${error.name} Error fetching wallets from WalletConnect API`,
        message: error.message,
        level: LEVELS.error,
      })
    }
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
