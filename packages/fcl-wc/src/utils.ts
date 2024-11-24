import {log, LEVELS} from "@onflow/util-logger"
import * as fclCore from "@onflow/fcl-core"
import {FLOW_METHODS, WC_SERVICE_METHOD} from "./constants"
import {Service} from "@onflow/typedefs"

const PRE_AUTHZ_SERVICE_TYPE = "pre-authz"

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

export function openDeeplink(url: string) {
  if (url.startsWith("http")) {
    // Workaround for https://github.com/rainbow-me/rainbowkit/issues/524.
    // Using 'window.open' causes issues on iOS in non-Safari browsers and
    // WebViews where a blank tab is left behind after connecting.
    // This is especially bad in some WebView scenarios (e.g. following a
    // link from Twitter) where the user doesn't have any mechanism for
    // closing the blank tab.
    // For whatever reason, links with a target of "_blank" don't suffer
    // from this problem, and programmatically clicking a detached link
    // element with the same attributes also avoids the issue.
    const link = document.createElement("a")
    link.href = url
    link.target = "_blank"
    link.rel = "noreferrer noopener"
    link.click()
  } else {
    window.open(url, "_blank")
  }
}

export function shouldDeepLink({service, user}: {service: Service; user: any}) {
  // Only deeplink on mobile
  if (!isMobile()) return false

  // If this is an authn request, the user has already been deeplinked by connectWc
  if (service.endpoint === FLOW_METHODS.FLOW_AUTHN) return false

  // If there was a pre-authz WC request, the user has already been deeplinked
  if (
    service.endpoint === FLOW_METHODS.FLOW_AUTHZ &&
    user?.services?.find(
      (s: Service) =>
        s.method === WC_SERVICE_METHOD && s.type === PRE_AUTHZ_SERVICE_TYPE
    )
  )
    return false

  return true
}

export function preloadImage(url?: string | null) {
  if (!url) return
  const img = new Image()
  img.src = url
}
