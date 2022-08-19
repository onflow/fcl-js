import QRCodeModal from "@walletconnect/qrcode-modal"

export const makeServicePlugin = client => ({
  name: "fcl-service-walletconnect",
  type: "discovery-service",
  services: makeWcServices(client),
})

const makeServiceStrategy = client => {
  return ({service, body, opts}) => {
    return new Promise(async (resolve, reject) => {
      if (typeof client === "undefined") {
        throw new Error("WalletConnect is not initialized")
      }
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
          console.error("execWcRPC onResponse error", error)
          throw error
        }
      }

      const onClose = () => {
        reject(`Declined: Externally Halted`)
      }

      if (client.session.length) {
        const lastKeyIndex = client.session.keys.length - 1
        session = client.session.get(client.session.keys[lastKeyIndex])
      }
      if (session == null) {
        const pairing =
          service.provider.address === "WalletConnect"
            ? null
            : {topic: service.provider.address}

        session = await connectWc(onClose, {
          client,
          pairing,
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
      } catch (e) {
        console.error("Error on WalletConnect request", e)
        reject(`Declined: Externally Halted`)
      }
    })
  }
}

async function connectWc(onClose, {client, pairing}) {
  try {
    // need to get chain from config or api ping endpoint
    const requiredNamespaces = {
      flow: {
        methods: ["flow_authn", "flow_authz", "flow_user_sign"],
        chains: ["flow:testnet"],
        events: ["chainChanged", "accountsChanged"],
      },
    }

    const {uri, approval} = await client.connect({
      pairingTopic: pairing?.topic,
      requiredNamespaces,
    })

    if (uri) {
      QRCodeModal.open(uri, () => {
        console.log("EVENT", "QR Code Modal closed")
        onClose()
      })
    }

    const session = await approval()
    return session
  } catch (e) {
    console.error("Error establishing session", e)
    throw e
  } finally {
    QRCodeModal.close()
  }
}

function makeWcServices(client) {
  const pairings = client.pairing.getAll({active: true})
  return [
    {
      definition: {
        f_type: "Service",
        f_vsn: "1.0.0",
        type: "authn",
        method: "WC/RPC",
        uid: "wc#authn",
        endpoint: "flow_authn",
        optIn: false,
        provider: {
          address: "WalletConnect",
          name: "WalletConnect",
          icon: "https://avatars.githubusercontent.com/u/37784886",
          description: "WalletConnect Generic Provider",
          website: "https://walletconnect.com/",
          color: null,
          supportEmail: null,
        },
      },
      strategy: makeServiceStrategy(client),
    },
    ...pairings.map(pairing => {
      return {
        definition: {
          f_type: "Service",
          f_vsn: "1.0.0",
          type: "authn",
          method: "WC/RPC",
          uid: pairing.topic,
          endpoint: "flow_authn",
          optIn: false,
          provider: {
            ...pairing,
            address: pairing.topic,
            name: pairing.peerMetadata.name,
            icon: pairing.peerMetadata.icons[0],
            description: pairing.peerMetadata.description,
            website: pairing.peerMetadata.url,
            color: null,
            supportEmail: null,
          },
        },
        strategy: makeServiceStrategy(client),
      }
    }),
  ]
}
