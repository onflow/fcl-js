import {invariant} from "@onflow/util-invariant"
import {log, LEVELS} from "@onflow/util-logger"
import {isMobile, isIOS} from "./utils"
import {FLOW_METHODS, REQUEST_TYPES} from "./constants"
import {SignClient} from "@walletconnect/sign-client/dist/types/client"
import * as fclCore from "@onflow/fcl-core"

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
  WalletConnectModal: Promise<
    typeof import("@walletconnect/modal").WalletConnectModal
  >
) => {
  return ({service, body, opts}: {service: any; body: any; opts: any}) => {
    return new Promise(async (resolve, reject) => {
      const client = await clientPromise
      invariant(!!client, "WalletConnect is not initialized")

      let session, pairing, windowRef: any
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

      const [chainId, addr, address] = makeSessionData(session)
      const data = JSON.stringify({...body, addr, address})

      try {
        const result = await client.request({
          topic: session.topic,
          chainId,
          request: {
            method,
            params: [data],
          },
        })
        onResponse(result)
      } catch (error) {
        if (error instanceof Error) {
          log({
            title: `${error.name} Error on WalletConnect client ${method} request`,
            message: error.message,
            level: LEVELS.error,
          })
        }
        reject(`Declined: Externally Halted`)
      } finally {
        if (windowRef && !windowRef.closed) {
          windowRef.close()
        }
      }

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

      function makeSessionData(session: any) {
        const [namespace, reference, address] = Object.values<any>(
          session.namespaces
        )
          .map(namespace => namespace.accounts)
          .flat()
          .filter(account => account.startsWith("flow:"))[0]
          .split(":")

        const chainId = `${namespace}:${reference}`
        const addr = address
        return [chainId, addr, address]
      }

      function onResponse(resp: any) {
        try {
          if (typeof resp !== "object") return

          switch (resp.status) {
            case "APPROVED":
              resolve(resp.data)
              break

            case "DECLINED":
              reject(`Declined: ${resp.reason || "No reason supplied"}`)
              break

            case "REDIRECT":
              resolve(resp)
              break

            default:
              reject(`Declined: No reason supplied`)
              break
          }
        } catch (error) {
          if (error instanceof Error) {
            log({
              title: `${error.name} "WC/RPC onResponse error"`,
              message: error.message,
              level: LEVELS.error,
            })
          }
          throw error
        }
      }

      function onClose() {
        reject(`Declined: Externally Halted`)
      }
    })
  }
}

function connectWc(
  WalletConnectModal: Promise<
    typeof import("@walletconnect/modal").WalletConnectModal
  >
) {
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
    const network = await fclCore.getChainId()

    const requiredNamespaces = {
      flow: {
        methods: [
          FLOW_METHODS.FLOW_AUTHN,
          FLOW_METHODS.FLOW_PRE_AUTHZ,
          FLOW_METHODS.FLOW_AUTHZ,
          FLOW_METHODS.FLOW_USER_SIGN,
        ],
        chains: [`flow:${network}`],
        events: ["chainChanged", "accountsChanged"],
      },
    }

    invariant(
      !!client.opts?.projectId,
      "Cannot establish connection, WalletConnect projectId is undefined"
    )

    const projectId = client.opts?.projectId
    const walletConnectModal = new (await WalletConnectModal)({
      projectId,
      walletConnectVersion: 2,
    })

    try {
      const {uri, approval} = await client.connect({
        pairingTopic: pairing?.topic,
        requiredNamespaces,
      })
      var _uri = uri

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

      invariant(
        !!uri,
        "Cannot establish connection, WalletConnect URI is undefined"
      )

      if (isMobile()) {
        const queryString = new URLSearchParams({uri: uri}).toString()
        let url = pairing == null ? appLink + "?" + queryString : appLink
        windowRef.location.href = url
      } else if (!pairing) {
        if (!pairingModalOverride) {
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
      walletConnectModal.closeModal()
    }
  }
}
