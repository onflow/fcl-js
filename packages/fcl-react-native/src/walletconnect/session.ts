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
        FLOW_METHODS.FLOW_SIGN_PAYER,
        FLOW_METHODS.FLOW_SIGN_PROPOSER,
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

  console.log(
    "WalletConnect Request: Preparing request - Method:",
    method,
    "Topic:",
    session.topic.substring(0, 10) + "..."
  )

  // Create a timeout promise (60 seconds for signing requests)
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      console.log(
        "WalletConnect Request: TIMEOUT after 60 seconds - Method:",
        method
      )
      reject(new Error("WalletConnect request timed out after 60 seconds"))
    }, 60000)
  })

  const abortPromise = new Promise((_, reject) => {
    if (abortSignal?.aborted) {
      reject(new Error("WalletConnect Request aborted"))
    }
    abortSignal?.addEventListener("abort", () => {
      console.log("WalletConnect Request: ABORTED - Method:", method)
      reject(new Error("WalletConnect Request aborted"))
    })
  })

  try {
    const requestPayload = {
      topic: session.topic,
      chainId,
      request: {
        method,
        params: [data],
      },
    }

    console.log("WalletConnect Request: Sending to relay - Method:", method)
    const result: any = await Promise.race([
      client.request(requestPayload),
      abortPromise,
      timeoutPromise,
    ])
    console.log(
      "WalletConnect Request: Received result - Method:",
      method,
      "Status:",
      result?.status
    )

    if (typeof result !== "object" || result == null) {
      return
    }

    switch (result.status) {
      case "APPROVED":
        return result.data
      case "DECLINED":
        throw new Error(`Declined: ${result.reason || "No reason supplied."}`)
      default:
        throw new Error(`Invalid Response: ${result.status}`)
    }
  } catch (error) {
    throw error
  }
}

export function makeSessionData(
  session: SessionTypes.Struct
): [string, string, string] {
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
