import {invariant} from "@onflow/util-invariant"
import {log, LEVELS} from "@onflow/util-logger"
import {isMobile, openDeeplink, preloadImage, shouldDeepLink} from "./utils"
import {
  REQUEST_TYPES,
  SERVICE_PLUGIN_NAME,
  WC_SERVICE_METHOD,
} from "./constants"
import {SignClient} from "@walletconnect/sign-client/dist/types/client"
import {createSessionProposal, request} from "./session"
import {ModalCtrlState} from "@walletconnect/modal-core/dist/_types/src/types/controllerTypes"
import {showNotification} from "./ui/notifications"
import type {FclWalletConnectConfig} from "./fcl-wc"
import mobileIcon from "./ui/assets/mobile.svg"
import {CurrentUser, Service} from "@onflow/typedefs"
import {SessionTypes} from "@walletconnect/types"
import {UniversalProvider} from "@walletconnect/universal-provider"

type WalletConnectModalType = import("@walletconnect/modal").WalletConnectModal

type Constructor<T> = new (...args: any[]) => T

export const makeServicePlugin = (
  signer: Promise<InstanceType<typeof UniversalProvider> | null>,
  config: FclWalletConnectConfig = {
    projectId: "",
    includeBaseWC: false,
    wallets: [],
    wcRequestHook: null,
    pairingModalOverride: null,
    disableNotifications: false,
  }
) => ({
  name: SERVICE_PLUGIN_NAME,
  f_type: "ServicePlugin",
  type: "discovery-service",
  serviceStrategy: {
    method: WC_SERVICE_METHOD,
    exec: makeExec(
      signer,
      config,
      import("@walletconnect/modal").then(m => m.WalletConnectModal)
    ),
  },
  services: [],
})

const makeExec = (
  signerPromise: Promise<InstanceType<typeof UniversalProvider> | null>,
  config: FclWalletConnectConfig,
  WalletConnectModal: Promise<Constructor<WalletConnectModalType>>
) => {
  return async ({
    service,
    body,
    opts,
    abortSignal,
    user,
  }: {
    service: any
    body: any
    opts: any
    abortSignal?: AbortSignal
    user: any
  }) => {
    // Preload provider image
    preloadImage(service.provider?.icon)

    const {
      wcRequestHook,
      pairingModalOverride,
      disableNotifications: appDisabledNotifications,
    } = config

    const signer = await signerPromise
    invariant(!!signer, "WalletConnect is not initialized")

    let session: SessionTypes.Struct | null = signer.session ?? null,
      pairing: any
    const method = service.endpoint
    const appLink = validateAppLink(service)

    if (session == null) {
      session = await new Promise<SessionTypes.Struct>((resolve, reject) => {
        function onClose() {
          reject(`Declined: Externally Halted`)
        }

        connectWc(WalletConnectModal)({
          service,
          onClose,
          appLink,
          signer,
          method,
          pairing,
          wcRequestHook,
          pairingModalOverride,
          abortSignal,
        }).then(resolve, reject)
      })
    }

    if (wcRequestHook && wcRequestHook instanceof Function) {
      wcRequestHook({
        type: REQUEST_TYPES.SIGNING_REQUEST,
        method,
        service,
        session: session ?? null,
        pairing: pairing ?? null,
        uri: null,
      })
    }

    // Deeplink to the wallet app if necessary
    if (shouldDeepLink({service, user})) {
      openDeeplink(appLink)
    }

    // Show notification to the user if not disabled by app developer or wallet
    const walletDisabledNotifications =
      session?.sessionProperties?.["fclWc.disableNotificationsOnMobile"] ===
      "true"

    const notification =
      !appDisabledNotifications && !walletDisabledNotifications
        ? showWcRequestNotification({
            user,
            service,
          })
        : null

    // Make request to the WalletConnect client and return the result
    return await request({
      method,
      body,
      session,
      signer,
      abortSignal,
    }).finally(() => notification?.dismiss())

    function validateAppLink({uid}: {uid: string}) {
      if (!(uid && /^(ftp|http|https):\/\/[^ "]+$/.test(uid))) {
        log({
          title: "WalletConnect Service Warning",
          message: `service.uid should be a valid universal link url. Found: ${uid}`,
          level: LEVELS.warn,
        })
      }
      return uid
    }
  }
}

// Connect to WalletConnect directly from the browser via deep link or WalletConnectModal
function connectWc(
  WalletConnectModal: Promise<Constructor<WalletConnectModalType>>
) {
  return async ({
    service,
    onClose,
    appLink,
    signer,
    method,
    pairing,
    wcRequestHook,
    pairingModalOverride,
    abortSignal,
  }: {
    service: any
    onClose: any
    appLink: string
    signer: InstanceType<typeof UniversalProvider>
    method: string
    pairing: any
    wcRequestHook: any
    pairingModalOverride: any
    abortSignal?: AbortSignal
  }): Promise<SessionTypes.Struct> => {
    const projectId = signer.providerOpts.projectId
    invariant(
      !!projectId,
      "Cannot establish connection, WalletConnect projectId is undefined"
    )

    let _uri: string | null = null,
      walletConnectModal: WalletConnectModalType | null = null

    try {
      const {uri: _, approval} = await createSessionProposal({
        signer,
        existingPairing: pairing,
      })

      /*if (wcRequestHook && wcRequestHook instanceof Function) {
        wcRequestHook({
          type: REQUEST_TYPES.SESSION_REQUEST,
          method,
          service,
          session: null,
          pairing: pairing ?? null,
          uri: uri ?? null,
        })
      }*/

      /*if (isMobile()) {
        const queryString = new URLSearchParams({uri: uri}).toString()
        let url = pairing == null ? appLink + "?" + queryString : appLink
        openDeeplink(url)
      } else if (!pairing) {
        if (!pairingModalOverride) {
          walletConnectModal = new (await WalletConnectModal)({
            projectId,
          })

          // Open WalletConnectModal
          walletConnectModal.openModal({
            uri,
            onClose,
          })

          // Subscribe to modal state changes
          const unsubscribeModal = walletConnectModal.subscribeModal(
            (state: ModalCtrlState) => {
              if (state.open === false) {
                onClose?.()
                unsubscribeModal()
              }
            }
          )
        } else {
          pairingModalOverride(uri, onClose)
        }
      }*/

      const session = await Promise.race([
        approval(),
        new Promise<never>((_, reject) => {
          if (abortSignal?.aborted) {
            reject(new Error("Session request aborted"))
          }
          abortSignal?.addEventListener("abort", () => {
            reject(new Error("Session request aborted"))
          })
        }),
      ])

      if (session == null) {
        throw new Error("Session request failed")
      }

      return session
    } catch (error) {
      if (error instanceof Error) {
        log({
          title: `${error.name} Error establishing WalletConnect session`,
          message: `
          ${error.message}
          uri: ${_uri}
        `,
          level: LEVELS.error,
        })
      }
      onClose()
      throw error
    } finally {
      // walletConnectModal?.closeModal()
    }
  }
}

/**
 * Show a notification for a WalletConnect request.
 * @param service - The service that is requesting the user's attention.
 * @param user - The user that is being requested to sign a transaction.
 * @returns A close function to dismiss the notification.
 */
export function showWcRequestNotification({
  service,
  user,
}: {
  service: Service
  user: CurrentUser
}) {
  const authnService = user?.services?.find((s: any) => s.type === "authn")
  const walletProvider = authnService?.provider || service.provider

  return showNotification({
    title: walletProvider?.name || "Mobile Wallet",
    message: isMobile()
      ? "Tap to view request in app"
      : "Pending request on your mobile device",
    icon: walletProvider?.icon || mobileIcon,
    onClick:
      isMobile() && service.uid ? () => openDeeplink(service.uid!) : undefined,
    debounceDelay: service.type === "pre-authz" ? 500 : 0,
  })
}
