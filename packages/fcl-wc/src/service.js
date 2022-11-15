import QRCodeModal from "@walletconnect/qrcode-modal"
import {invariant} from "@onflow/util-invariant"
import {log, LEVELS} from "@onflow/util-logger"
import {fetchFlowWallets, isMobile, CONFIGURED_NETWORK, isIOS} from "./utils"
import {FLOW_METHODS, REQUEST_TYPES} from "./constants"

export const makeServicePlugin = async (client, opts = {}) => ({
  name: "fcl-plugin-service-walletconnect",
  f_type: "ServicePlugin",
  type: "discovery-service",
  services: await makeWcServices(opts),
  serviceStrategy: {method: "WC/RPC", exec: makeExec(client, opts)},
})

const makeExec = (client, {wcRequestHook, pairingModalOverride}) => {
  return ({service, body, opts}) => {
    return new Promise(async (resolve, reject) => {
      invariant(client, "WalletConnect is not initialized")
      let session, pairing, windowRef
      const method = service.endpoint
      const appLink = validateAppLink(service)
      const pairings = client.pairing.getAll({active: true})

      if (pairings.length > 0) {
        pairing = pairings?.find(p => p.peerMetadata?.url === service.uid)
      }

      if (client.session.length > 0) {
        const lastKeyIndex = client.session.keys.length - 1
        session = client.session.get(client.session.keys.at(lastKeyIndex))
      }

      if (isMobile()) {
        if (opts.windowRef) {
          windowRef = opts.windowRef
        } else {
          windowRef = window.open("", "_blank")
        }
      }

      if (session == null) {
        session = await connectWc({
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
        log({
          title: `${error.name} Error on WalletConnect client ${method} request`,
          message: error.message,
          level: LEVELS.error,
        })
        reject(`Declined: Externally Halted`)
      } finally {
        if (windowRef && !windowRef.closed) {
          windowRef.close()
        }
      }

      function validateAppLink({uid}) {
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

      function makeSessionData(session) {
        const [namespace, reference, address] = Object.values(
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

      function onResponse(resp) {
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
          log({
            title: `${error.name} "WC/RPC onResponse error"`,
            message: error.message,
            level: LEVELS.error,
          })
          throw error
        }
      }

      function onClose() {
        reject(`Declined: Externally Halted`)
      }
    })
  }
}

async function connectWc({
  service,
  onClose,
  appLink,
  windowRef,
  client,
  method,
  pairing,
  wcRequestHook,
  pairingModalOverride,
}) {
  const requiredNamespaces = {
    flow: {
      methods: [
        FLOW_METHODS.FLOW_AUTHN,
        FLOW_METHODS.FLOW_PRE_AUTHZ,
        FLOW_METHODS.FLOW_AUTHZ,
        FLOW_METHODS.FLOW_USER_SIGN,
      ],
      chains: [`flow:${CONFIGURED_NETWORK}`],
      events: ["chainChanged", "accountsChanged"],
    },
  }

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
        session: session ?? null,
        pairing: pairing ?? null,
        uri: uri ?? null,
      })
    }

    if (!pairing) {
      invariant(
        uri,
        "Cannot establish connection, WalletConnect URI is undefined"
      )
    }

    if (isMobile()) {
      const queryString = new URLSearchParams({uri: uri}).toString()
      let url = pairing == null ? appLink + "?" + queryString : appLink
      windowRef.location.href = url
    } else if (!pairing) {
      if (!pairingModalOverride) {
        QRCodeModal.open(uri, () => {
          onClose()
        })
      } else {
        pairingModalOverride(uri, onClose)
      }
    }

    const session = await approval()
    return session
  } catch (error) {
    log({
      title: `${error.name} Error establishing WalletConnect session`,
      message: `
        ${error.message}
        uri: ${_uri}
      `,
      level: LEVELS.error,
    })
    onClose()
    throw error
  } finally {
    if (windowRef && !windowRef.closed) {
      windowRef.close()
    }
    QRCodeModal.close()
  }
}

const makeBaseWalletConnectService = includeBaseWC => {
  return {
    f_type: "Service",
    f_vsn: "1.0.0",
    type: "authn",
    method: "WC/RPC",
    uid: "https://walletconnect.com",
    endpoint: "flow_authn",
    optIn: !includeBaseWC,
    provider: {
      address: null,
      name: "WalletConnect",
      icon: "https://avatars.githubusercontent.com/u/37784886",
      description: "WalletConnect Base Service",
      website: "https://walletconnect.com",
      color: null,
      supportEmail: null,
    },
  }
}

async function makeWcServices({projectId, includeBaseWC, wallets}) {
  const wcBaseService = makeBaseWalletConnectService(includeBaseWC)
  const flowWcWalletServices = (await fetchFlowWallets(projectId)) ?? []
  const injectedWalletServices = CONFIGURED_NETWORK === "testnet" ? wallets : []
  return [wcBaseService, ...flowWcWalletServices, ...injectedWalletServices]
}
