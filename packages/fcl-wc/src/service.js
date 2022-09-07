import QRCodeModal from "@walletconnect/qrcode-modal"
import {invariant} from "@onflow/util-invariant"
import {log, LEVELS} from "@onflow/util-logger"
import {fetchFlowWallets, isMobile, CONFIGURED_NETWORK} from "./utils"

export const makeServicePlugin = async (client, opts = {}) => ({
  name: "fcl-plugin-service-walletconnect",
  f_type: "ServicePlugin",
  type: "discovery-service",
  services: await makeWcServices(opts),
  serviceStrategy: {method: "WC/RPC", exec: makeExec(client, opts)},
})

const makeExec = (client, {sessionRequestHook}) => {
  return ({service, body, opts}) => {
    return new Promise(async (resolve, reject) => {
      invariant(client, "WalletConnect is not initialized")
      let session
      const onResponse = resp => {
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

      const onClose = () => {
        reject(`Declined: Externally Halted`)
      }

      if (client.session.length) {
        const lastKeyIndex = client.session.keys.length - 1
        session = client.session.get(client.session.keys.at(lastKeyIndex))
      }

      if (session == null) {
        const pairings = client.pairing.getAll({active: true})
        const pairing = pairings?.find(p => p.peerMetadata.url === service.uid)

        session = await connectWc(onClose, {
          service,
          client,
          pairing,
          sessionRequestHook,
        })
      }

      const [namespace, reference, address] = Object.values(session.namespaces)
        .map(namespace => namespace.accounts)
        .flat()
        .filter(account => account.startsWith("flow:"))[0]
        .split(":")

      const method = service.endpoint
      const chainId = `${namespace}:${reference}`
      const addr = address
      const data = JSON.stringify({...body, addr})

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
      }
    })
  }
}

async function connectWc(
  onClose,
  {service, client, pairing, sessionRequestHook}
) {
  try {
    const requiredNamespaces = {
      flow: {
        methods: ["flow_authn", "flow_authz", "flow_user_sign"],
        chains: [`flow:${CONFIGURED_NETWORK}`],
        events: ["chainChanged", "accountsChanged"],
      },
    }

    const {uri, approval} = await client.connect({
      pairingTopic: pairing?.topic,
      requiredNamespaces,
    })

    const appLink = service.uid || pairing?.peerMetadata?.url

    if (!isMobile() && !pairing) {
      QRCodeModal.open(uri, () => {
        onClose()
      })
    } else if (!isMobile() && pairing) {
      log({
        title: "WalletConnect Session request",
        message: `
          ${pairing.peerMetadata.name}
          Pairing exists, Approve Session in your Mobile Wallet
        `,
        level: LEVELS.warn,
      })
      sessionRequestHook && sessionRequestHook(pairing.peerMetadata)
    } else {
      const queryString = new URLSearchParams({uri: uri}).toString()
      let url = pairing == null ? appLink + "?" + queryString : appLink
      window.open(url, "blank").focus()
    }

    const session = await approval()
    return session
  } catch (error) {
    log({
      title: `${error.name} "Error establishing Walletconnect session"`,
      message: error.message,
      level: LEVELS.error,
    })
    throw error
  } finally {
    QRCodeModal.close()
  }
}

const baseWalletConnectService = includeBaseWC => {
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
  const wcBaseService = baseWalletConnectService(includeBaseWC)
  const flowWcWalletServices = (await fetchFlowWallets(projectId)) ?? []
  const injectedWalletServices = CONFIGURED_NETWORK === "testnet" ? wallets : []
  return [wcBaseService, ...flowWcWalletServices, ...injectedWalletServices]
}
