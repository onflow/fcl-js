import {SessionTypes} from "@walletconnect/types"
import {
  PlatformAdapter,
  WcClientAdapter,
  NotificationHandle,
} from "../types/adapters"
import {NotificationInfo} from "../types/types"
import {showNotification} from "../ui/notifications"
import {FLOW_METHODS, WC_SERVICE_METHOD} from "../constants"
import {Service} from "@onflow/typedefs"

const PRE_AUTHZ_SERVICE_TYPE = "pre-authz"

type WalletConnectModalType = import("@walletconnect/modal").WalletConnectModal
type Constructor<T> = new (...args: any[]) => T

/**
 * Configuration options for the browser platform adapter
 */
export interface BrowserPlatformAdapterConfig {
  /**
   * Custom modal override function. If provided, will be called instead of
   * using the default WalletConnectModal.
   */
  pairingModalOverride?: (uri: string, onClose: () => void) => void
}

/**
 * Creates a PlatformAdapter for browser/web environments.
 * This adapter handles deeplinks, modals, and notifications using browser APIs.
 */
export function createBrowserPlatformAdapter(
  config: BrowserPlatformAdapterConfig = {}
): PlatformAdapter {
  // Lazy-loaded WalletConnectModal constructor
  let WalletConnectModalPromise: Promise<
    Constructor<WalletConnectModalType>
  > | null = null
  let walletConnectModal: WalletConnectModalType | null = null

  return {
    openDeeplink(url: string): void {
      if (url.startsWith("http")) {
        // Workaround for https://github.com/rainbow-me/rainbowkit/issues/524.
        // Using 'window.open' causes issues on iOS in non-Safari browsers and
        // WebViews where a blank tab is left behind after connecting.
        const link = document.createElement("a")
        link.href = url
        link.target = "_blank"
        link.rel = "noreferrer noopener"
        link.click()
      } else {
        window.open(url, "_blank")
      }
    },

    isMobile(): boolean {
      if (typeof navigator === "undefined") return false
      const userAgent = navigator.userAgent
      return /android/i.test(userAgent) || /iPhone|iPod|iPad/.test(userAgent)
    },

    async showPairingModal(
      uri: string,
      projectId: string,
      onClose: () => void
    ): Promise<void> {
      // If custom modal override is provided, use it
      if (config.pairingModalOverride) {
        config.pairingModalOverride(uri, onClose)
        return
      }

      // Lazy load the WalletConnectModal
      if (!WalletConnectModalPromise) {
        WalletConnectModalPromise = import("@walletconnect/modal").then(
          m => m.WalletConnectModal
        )
      }

      const WalletConnectModal = await WalletConnectModalPromise
      walletConnectModal = new WalletConnectModal({projectId})

      walletConnectModal.openModal({uri, onClose})

      // Subscribe to modal state changes
      const unsubscribeModal = walletConnectModal.subscribeModal(
        (state: {open: boolean}) => {
          if (state.open === false) {
            onClose?.()
            unsubscribeModal()
          }
        }
      )
    },

    closePairingModal(): void {
      walletConnectModal?.closeModal()
      walletConnectModal = null
    },

    showNotification(info: NotificationInfo): NotificationHandle {
      return showNotification(info)
    },

    shouldDeepLink(params: {
      service: any
      user: any
      isNewlyCreatedSession?: boolean
    }): boolean {
      const {service, user} = params

      // Only deeplink on mobile
      if (!this.isMobile()) return false

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
    },

    buildDeeplinkUrl(
      appLink: string,
      _session: SessionTypes.Struct,
      _redirectUri?: string
    ): string {
      // Browser just uses the app link directly for deeplinks
      return appLink
    },
  }
}
