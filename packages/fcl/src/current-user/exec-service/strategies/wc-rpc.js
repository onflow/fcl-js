import {config} from "@onflow/config"
import {normalizePollingResponse} from "../../normalize/polling-response"

const connectWc = async (onClose, {client, QRCodeModal, pairing}) => {
  try {
    // need to get chain from config or api ping endpoint
    const requiredNamespaces = {
      flow: {
        methods: ["flow_signMessage", "flow_authz", "flow_authn"],
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
    console.error("Erroring connecting session", e)
    throw e
  } finally {
    QRCodeModal.close()
  }
}

export function execWcRPC(service, body, opts, fullConfig) {
  return new Promise(async (resolve, reject) => {
    const {client, QRCodeModal} = await config.get("wc.adapter")
    if (typeof client === "undefined") {
      throw new Error("WalletConnect is not initialized")
    }
    let session
    const onResponse = data => {
      try {
        if (typeof data !== "object") return
        const resp = normalizePollingResponse(data)

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
      let pairing = {topic: service.provider.address ?? undefined}
      session = await connectWc(onClose, {
        client,
        QRCodeModal,
        pairing,
      })
    }

    const addr = session?.namespaces["flow"]?.accounts[0].split(":")[2]
    const data = {...body, addr}

    switch (service.endpoint) {
      case "flow_authn":
        try {
          const result = await client.request({
            topic: session.topic,
            chainId: "flow:testnet",
            request: {
              method: service.endpoint,
              params: [JSON.stringify(data)],
            },
          })
          onResponse(result)
        } catch (e) {
          console.error("Error authenticating with WalletConnect", e)
          reject(`Declined: Externally Halted`)
        }
        break
      case "flow_authz":
        try {
          const result = await client.request({
            topic: session.topic,
            chainId: "flow:testnet",
            request: {
              method: service.endpoint,
              params: [JSON.stringify(data)],
            },
          })
          onResponse(result)
        } catch (e) {
          console.error("Error authorizing with WalletConnect", e)
          reject(`Declined: Externally Halted`)
        }
      default:
        break
    }
  })
}
