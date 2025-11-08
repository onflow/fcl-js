import * as fclCore from "@onflow/fcl-core"
import {FLOW_METHODS} from "./constants"
import {SessionTypes} from "@walletconnect/types"

// Create a new session proposal with the WalletConnect client
export async function createSessionProposal({
  client,
  existingPairing,
  network,
}: {
  client: any
  existingPairing?: string
  network?: string
}) {
  const _network = network || (await fclCore.getChainId())

  const requiredNamespaces = {
    flow: {
      methods: [
        FLOW_METHODS.FLOW_AUTHN,
        FLOW_METHODS.FLOW_PRE_AUTHZ,
        FLOW_METHODS.FLOW_AUTHZ,
        FLOW_METHODS.FLOW_USER_SIGN,
      ],
      chains: [`flow:${_network}`],
      events: ["chainChanged", "accountsChanged"],
    },
  }

  let cleanup: () => void
  const uri = new Promise<string>((resolve, reject) => {
    const onDisplayUri = (uri: string) => {
      resolve(uri)
    }
    client.on("session_proposal", (proposal: any) => {
      console.log("=== Session proposal received:", proposal)
    })
    client.on("display_uri", onDisplayUri)
    cleanup = () => {
      client.removeListener("display_uri", onDisplayUri)
      reject(new Error("WalletConnect Session Request aborted"))
    }
  })

  const {uri: connectionUri, approval} = await client.connect({
    pairingTopic: existingPairing,
    requiredNamespaces,
  })

  return {
    uri: connectionUri,
    approval: () => approval(),
    cleanup: () => cleanup(),
  }
}

export const request = async ({
  method,
  body,
  session,
  client,
  abortSignal,
  disableNotifications,
}: {
  method: any
  body: any
  session: SessionTypes.Struct
  client: any
  abortSignal?: AbortSignal
  disableNotifications?: boolean
}) => {
  const [chainId, addr, address] = makeSessionData(session)
  const data = JSON.stringify({...body, addr, address})

  const result: any = await Promise.race([
    client.request({
      topic: session.topic,
      chainId,
      request: {
        method,
        params: [data],
      },
    }),
    new Promise((_, reject) => {
      if (abortSignal?.aborted) {
        reject(new Error("WalletConnect Request aborted"))
      }
      abortSignal?.addEventListener("abort", () => {
        reject(new Error("WalletConnect Request aborted"))
      })
    }),
  ])

  if (typeof result !== "object" || result == null) return

  switch (result.status) {
    case "APPROVED":
      return result.data
    case "DECLINED":
      throw new Error(`Declined: ${result.reason || "No reason supplied."}`)
    default:
      throw new Error(`Invalid Response`)
  }
}

function makeSessionData(session: SessionTypes.Struct): [string, string, string] {
  const {namespaces} = session
  const flowNamespace = namespaces["flow"]

  if (!flowNamespace) {
    throw new Error("Flow namespace not found in session")
  }

  const chainId = flowNamespace.chains?.[0] || ""
  const account = flowNamespace.accounts?.[0] || ""

  // account format: "flow:testnet:0xADDRESS"
  const address = account.split(":")[2] || ""

  return [chainId, address, address]
}
