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

  // Optional wallet-specific methods
  const optionalNamespaces = {
    flow: {
      methods: [FLOW_METHODS.FLOW_SIGN_PAYER, FLOW_METHODS.FLOW_SIGN_PROPOSER],
      chains: [`flow:${_network}`],
      events: ["chainChanged", "accountsChanged"],
    },
  }

  let displayUriListener: ((uri: string) => void) | null = null

  // Set up display_uri listener to track the connection URI
  const onDisplayUri = (_uri: string) => {
    // URI is available via client.connect() return value, but we need
    // to register a listener to prevent WalletConnect SDK warnings
  }
  displayUriListener = onDisplayUri
  client.on("display_uri", onDisplayUri)

  // Cleanup function to remove the display_uri listener
  const cleanup = () => {
    if (displayUriListener) {
      client.removeListener("display_uri", displayUriListener)
      displayUriListener = null
    }
  }

  try {
    const {uri: connectionUri, approval} = await client.connect({
      pairingTopic: existingPairing,
      requiredNamespaces,
      optionalNamespaces,
    })

    return {
      uri: connectionUri,
      approval: () => approval(),
      cleanup: () => {
        // Clean up display_uri listener on successful cleanup
        if (displayUriListener) {
          client.removeListener("display_uri", displayUriListener)
          displayUriListener = null
        }
        if (cleanup) cleanup()
      },
    }
  } finally {
    // Always remove listener after connect completes (success or error)
    if (displayUriListener) {
      client.removeListener("display_uri", displayUriListener)
      displayUriListener = null
    }
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

  let abortListener: (() => void) | null = null
  const abortPromise = new Promise((_, reject) => {
    if (abortSignal?.aborted) {
      reject(new Error("WalletConnect Request aborted"))
      return
    }
    abortListener = () => {
      reject(new Error("WalletConnect Request aborted"))
    }
    abortSignal?.addEventListener("abort", abortListener)
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

    // Note: WalletConnect SDK has built-in 5-minute timeout (wc_sessionRequest.req.ttl)
    const result: any = await Promise.race([
      client.request(requestPayload),
      abortPromise,
    ])

    if (typeof result !== "object" || result == null) {
      return
    }

    switch (result.status) {
      case "APPROVED":
        // Helper function to add session info to WC/RPC services
        function addSessionInfo(service: any) {
          if (service.method === "WC/RPC") {
            return {
              ...service,
              params: {
                ...service.params,
                sessionTopic: session.topic,
                ...(disableNotifications ? {disableNotifications} : {}),
              },
            }
          }
          return service
        }

        // Process authentication response
        if (method === FLOW_METHODS.FLOW_AUTHN) {
          const services = (result?.data?.services ?? []).map(addSessionInfo)
          return {
            ...(result.data ? result.data : {}),
            services,
          }
        }

        // Process pre-authz response
        if (method === FLOW_METHODS.FLOW_PRE_AUTHZ) {
          return {
            ...result.data,
            ...(result.data?.proposer
              ? {proposer: addSessionInfo(result.data.proposer)}
              : {}),
            payer: [...(result.data?.payer?.map(addSessionInfo) ?? [])],
            authorization: [
              ...(result.data?.authorization?.map(addSessionInfo) ?? []),
            ],
          }
        }

        return result.data

      case "DECLINED":
        throw new Error(`Declined: ${result.reason || "No reason supplied."}`)
      default:
        throw new Error(`Invalid Response: ${result.status}`)
    }
  } catch (error) {
    throw error
  } finally {
    // Clean up abort listener after Promise.race resolves
    if (abortListener && abortSignal) {
      abortSignal.removeEventListener("abort", abortListener)
      abortListener = null
    }
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
