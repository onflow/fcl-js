import {invariant} from "@onflow/util-invariant"
import {log, LEVELS} from "@onflow/util-logger"
import {isMobile, isIOS} from "./utils"
import {FLOW_METHODS, REQUEST_TYPES} from "./constants"
import {SignClient} from "@walletconnect/sign-client/dist/types/client"
import {createSessionProposal, makeSessionData, request} from "./session"

//TODO: wrong type
type WalletConnectModalType =
  typeof import("@walletconnect/modal").WalletConnectModal

export const SERVICE_PLUGIN_NAME = "fcl-plugin-service-walletconnect"
export const WC_SERVICE_METHOD = "WC/RPC"

export const makeServicePlugin = (
  client: Promise<SignClient | null>,
  opts: {
    projectId: string
    includeBaseWC: boolean
    wallets: any[]
    wcRequestHook: any
    pairingModalOverride: any
  } = {
    projectId: "",
    includeBaseWC: false,
    wallets: [],
    wcRequestHook: null,
    pairingModalOverride: null,
  }
) => ({
  name: SERVICE_PLUGIN_NAME,
  f_type: "ServicePlugin",
  type: "discovery-service",
  serviceStrategy: {
    method: WC_SERVICE_METHOD,
    exec: makeExec(
      client,
      opts,
      import("@walletconnect/modal").then(m => m.WalletConnectModal)
    ),
  },
  services: [],
})

const makeExec = (
  clientPromise: Promise<SignClient | null>,
  {wcRequestHook, pairingModalOverride}: any,
  WalletConnectModal: Promise<WalletConnectModalType>
) => {
  // TODO: add abortSignal
  return ({
    service,
    body,
    opts,
    abortSignal,
  }: {
    service: any
    body: any
    opts: any
    abortSignal: any
  }) => {
    return new Promise(async (resolve, reject) => {
      const client = await clientPromise
      invariant(!!client, "WalletConnect is not initialized")

      let session: any, pairing: any, windowRef: any
      const method = service.endpoint
      const appLink = validateAppLink(service)
      const pairings = client.pairing.getAll({active: true})

      if (pairings.length > 0) {
        pairing = pairings?.find(p => p.peerMetadata?.url === service.uid)
      }

      if (client.session.length > 0) {
        const lastKeyIndex = client.session.keys.length - 1
        session = client.session.get(client.session.keys.at(lastKeyIndex)!)
      }

      if (isMobile()) {
        if (opts.windowRef) {
          windowRef = opts.windowRef
        } else {
          windowRef = window.open("", "_blank")
        }
      }

      if (session == null) {
        session = await connectWc(WalletConnectModal)({
          service,
          onClose,
          appLink,
          windowRef,
          client,
          method,
          pairing,
          wcRequestHook,
          pairingModalOverride,
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

      if (isMobile() && method !== FLOW_METHODS.FLOW_AUTHN) {
        openDeepLink()
      }

      // Make request to the WalletConnect client
      const result = await request({
        method,
        body,
        session,
        client,
        cleanup: () => {
          if (windowRef && !windowRef.closed) {
            windowRef.close()
          }
        },
      })

      // Resolve the result
      resolve(result)

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

      function openDeepLink() {
        if (windowRef) {
          if (appLink.startsWith("http") && !isIOS()) {
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
            link.href = appLink
            link.target = "_blank"
            link.rel = "noreferrer noopener"
            link.click()
          } else {
            windowRef.location.href = appLink
          }
        } else {
          log({
            title: "Problem opening deep link in new window",
            message: `Window failed to open (was it blocked by the browser?)`,
            level: LEVELS.warn,
          })
        }
      }

      function onClose() {
        reject(`Declined: Externally Halted`)
      }
    })
  }
}

// Connect to WalletConnect directly from the browser via deep link or WalletConnectModal
function connectWc(WalletConnectModal: Promise<WalletConnectModalType>) {
  return async ({
    service,
    onClose,
    appLink,
    windowRef,
    client,
    method,
    pairing,
    wcRequestHook,
    pairingModalOverride,
  }: {
    service: any
    onClose: any
    appLink: string
    windowRef: any
    client: SignClient
    method: string
    pairing: any
    wcRequestHook: any
    pairingModalOverride: any
  }) => {
    const projectId = client.opts?.projectId
    invariant(
      !!projectId,
      "Cannot establish connection, WalletConnect projectId is undefined"
    )

    let _uri: string | null = null,
      walletConnectModal: any

    try {
      const {uri, approval} = await createSessionProposal({
        client,
        existingPairing: pairing,
      })
      _uri = uri

      if (wcRequestHook && wcRequestHook instanceof Function) {
        wcRequestHook({
          type: REQUEST_TYPES.SESSION_REQUEST,
          method,
          service,
          session: null,
          pairing: pairing ?? null,
          uri: uri ?? null,
        })
      }

      if (isMobile()) {
        const queryString = new URLSearchParams({uri: uri}).toString()
        let url = pairing == null ? appLink + "?" + queryString : appLink
        windowRef.location.href = url
      } else if (!pairing) {
        if (!pairingModalOverride) {
          walletConnectModal = new (await WalletConnectModal)({
            projectId,
            walletConnectVersion: 2,
          })
          walletConnectModal.openModal({uri, onClose})
        } else {
          pairingModalOverride(uri, onClose)
        }
      }

      const session = await approval()
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
      if (windowRef && !windowRef.closed) {
        windowRef.close()
      }
      walletConnectModal?.closeModal()
    }
  }
}
