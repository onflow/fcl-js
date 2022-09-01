import {log} from "@onflow/util-logger"
import {config} from "@onflow/config"
import {invariant} from "@onflow/util-invariant"

export let CONFIGURED_NETWORK = null

export const setConfiguredNetwork = async () => {
  CONFIGURED_NETWORK = await config.get("flow.network")
  invariant(
    CONFIGURED_NETWORK === "mainnet" || CONFIGURED_NETWORK === "testnet",
    "FCL Configuration value for 'flow.network' is required (testnet || mainnet)"
  )
}

const makeFlowServicesFromWallets = wallets => {
  return Object.values(wallets)
    .filter(w => w.app_type === "wallet")
    .map(wallet => {
      return {
        f_type: "Service",
        f_vsn: "1.0.0",
        type: "authn",
        method: "WC/RPC",
        uid: wallet.mobile.universal,
        endpoint: "flow_authn",
        optIn: false,
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

export async function fetchFlowWallets() {
  try {
    const wcApiWallets = await fetch(
      "https://explorer-api.walletconnect.com/v1/wallets?entries=5&page=1&search=flow"
    ).then(res => res.json())

    if (wcApiWallets?.count > 0) {
      return makeFlowServicesFromWallets(wcApiWallets.listings)
    }

    return []
  } catch (error) {
    log({
      title: `${error.name} Error fetching wallets from WalletConnect API`,
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
