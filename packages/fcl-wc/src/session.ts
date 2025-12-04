import * as fclCore from "@onflow/fcl-core"
import {FLOW_METHODS, WC_SERVICE_METHOD} from "./constants"
import {SessionTypes} from "@walletconnect/types"
import {Service} from "@onflow/typedefs"
import {WcClientAdapter} from "./types/adapters"

/**
 * Configuration for optional methods that wallets may support
 */
export interface OptionalNamespaceMethods {
  methods?: string[]
}

/**
 * Create a new session proposal with the WalletConnect client.
 * Works with both UniversalProvider (web) and SignClient (React Native) via adapter.
 */
export async function createSessionProposal({
  client,
  existingPairing,
  network,
  optionalMethods,
}: {
  client: WcClientAdapter
  existingPairing?: string
  network?: string
  optionalMethods?: OptionalNamespaceMethods
}): Promise<{
  uri: string
  approval: () => Promise<SessionTypes.Struct>
  cleanup?: () => void
}> {
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

  // Optional wallet-specific methods (used by React Native for payer/proposer signing)
  const optionalNamespaces = optionalMethods?.methods?.length
    ? {
        flow: {
          methods: optionalMethods.methods,
          chains: [`flow:${_network}`],
          events: ["chainChanged", "accountsChanged"],
        },
      }
    : undefined

  const result = await client.connect({
    pairingTopic: existingPairing,
    requiredNamespaces,
    optionalNamespaces,
  })

  return {
    uri: result.uri,
    approval: result.approval,
  }
}

/**
 * Options for making a WalletConnect request
 */
export interface RequestOptions {
  method: string
  body: any
  session: SessionTypes.Struct
  client: WcClientAdapter
  abortSignal?: AbortSignal
  /**
   * Whether to disable notifications for services returned from the wallet
   */
  disableNotifications?: boolean
  /**
   * Whether this is an external provider session (web-specific for provider store)
   */
  isExternal?: boolean
  /**
   * Session topic to inject into services (React Native uses this instead of externalProvider)
   */
  sessionTopic?: string
  /**
   * Service UID to inject into services (React Native uses this for wallet deeplinks)
   */
  serviceUid?: string
}

/**
 * Make a request to the connected wallet.
 * Works with both UniversalProvider (web) and SignClient (React Native) via adapter.
 */
export async function request({
  method,
  body,
  session,
  client,
  abortSignal,
  disableNotifications,
  isExternal,
  sessionTopic,
  serviceUid,
}: RequestOptions): Promise<any> {
  const [chainId, addr, address] = makeSessionData(session)
  const data = JSON.stringify({...body, addr, address})

  // Set up abort handling
  let abortListener: (() => void) | null = null
  const abortPromise = new Promise<never>((_, reject) => {
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
    const result: any = await Promise.race([
      client.request({
        topic: session.topic,
        chainId,
        request: {
          method,
          params: [data],
        },
      }),
      abortPromise,
    ])

    if (typeof result !== "object" || result == null) {
      return
    }

    return processRequestResult(result, {
      method,
      session,
      disableNotifications,
      isExternal,
      sessionTopic,
      serviceUid,
    })
  } finally {
    // Clean up abort listener
    if (abortListener && abortSignal) {
      abortSignal.removeEventListener("abort", abortListener)
    }
  }
}

/**
 * Process the result from a WalletConnect request
 */
function processRequestResult(
  result: any,
  options: {
    method: string
    session: SessionTypes.Struct
    disableNotifications?: boolean
    isExternal?: boolean
    sessionTopic?: string
    serviceUid?: string
  }
): any {
  const {method, session, disableNotifications, isExternal, sessionTopic, serviceUid} =
    options

  switch (result.status) {
    case "APPROVED":
      // Helper function to add session info to WC/RPC services
      function addSessionInfo(service: Service) {
        if (service.method === WC_SERVICE_METHOD) {
          return {
            ...service,
            // React Native uses serviceUid for wallet deeplinks
            ...(serviceUid ? {uid: serviceUid} : {}),
            params: {
              ...service.params,
              // Web uses externalProvider for session routing
              ...(isExternal ? {externalProvider: session.topic} : {}),
              // React Native uses sessionTopic for session routing
              ...(sessionTopic ? {sessionTopic: session.topic} : {}),
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
          authorization: [...(result.data?.authorization?.map(addSessionInfo) ?? [])],
        }
      }

      return result.data

    case "DECLINED":
      throw new Error(`Declined: ${result.reason || "No reason supplied."}`)

    case "REDIRECT":
      return result.data

    default:
      throw new Error(`Invalid Response: ${result.status}`)
  }
}

/**
 * Extract session data (chainId, address) from a WalletConnect session
 */
export function makeSessionData(
  session: SessionTypes.Struct
): [string, string, string] {
  const {namespaces} = session
  const flowNamespace = namespaces["flow"]

  if (!flowNamespace) {
    // Fallback to original parsing for other namespace structures
    const [namespace, reference, address] = Object.values<any>(namespaces)
      .map(ns => ns.accounts)
      .flat()
      .filter((account: string) => account.startsWith("flow:"))[0]
      .split(":")

    const chainId = `${namespace}:${reference}`
    return [chainId, address, address]
  }

  const chainId = flowNamespace.chains?.[0] || ""
  const account = flowNamespace.accounts?.[0] || ""

  // account format: "flow:testnet:0xADDRESS"
  const address = account.split(":")[2] || ""

  return [chainId, address, address]
}
