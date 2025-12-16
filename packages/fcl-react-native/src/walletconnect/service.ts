import {invariant} from "@onflow/util-invariant"
import {
  FLOW_METHODS,
  REQUEST_TYPES,
  SERVICE_PLUGIN_NAME,
  WC_SERVICE_METHOD,
} from "./constants"
import {createSessionProposal, request} from "./session"
import {FclWalletConnectConfig} from "./client"
import {SessionTypes} from "@walletconnect/types"
import {Linking} from "react-native"

async function validateSession(
  client: any,
  session: SessionTypes.Struct
): Promise<boolean> {
  // Check if session is expired
  if (session.expiry && session.expiry <= Date.now() / 1000) return false
  // Check if session is acknowledged
  if (!session.acknowledged) return false

  // Verify session still exists in client
  try {
    const stillExists = client.session.get(session.topic)
    if (!stillExists) return false
  } catch {
    return false
  }

  // Session passed all local checks
  return true
}

async function disconnectSession(
  client: any,
  topic: string,
  reason: {code: number; message: string}
): Promise<void> {
  try {
    await client.disconnect({topic, reason})
  } catch {
    // Session already disconnected or doesn't exist
  }
}

async function findValidSession(
  client: any,
  sessionTopic?: string
): Promise<SessionTypes.Struct | null> {
  // If a specific session topic is provided, try to use it
  if (sessionTopic) {
    try {
      const session = client.session.get(sessionTopic)
      if (await validateSession(client, session)) return session

      // Session is invalid, disconnect it
      await disconnectSession(client, session.topic, {
        code: 6000,
        message: "Session not responsive",
      })
      return null
    } catch {
      // Session not found
      return null
    }
  }

  // Otherwise, find the most recent valid session
  const activeSessions = client.session.getAll()
  if (activeSessions.length === 0) {
    return null
  }

  const mostRecentSession = activeSessions[activeSessions.length - 1]
  if (await validateSession(client, mostRecentSession)) {
    return mostRecentSession
  } else {
    // Session is invalid, disconnect it
    await disconnectSession(
      client,
      mostRecentSession.topic,
      mostRecentSession.expiry && mostRecentSession.expiry <= Date.now() / 1000
        ? {code: 6000, message: "Session expired"}
        : {code: 6000, message: "Session not responsive"}
    )
    return null
  }
}

function determineWalletAppLink(
  method: string,
  service: any,
  storedWalletAppLink: string | null
): string {
  if (method === FLOW_METHODS.FLOW_AUTHN) {
    // For initial authn request, use service.uid
    return service.uid
  }
  return storedWalletAppLink || service.uid
}

function injectSessionIntoPreAuthz(
  response: any,
  session: SessionTypes.Struct,
  service: any
): any {
  const injectSessionParams = (svc: any) => {
    if (!svc) return svc

    // Only modify WalletConnect services
    if (svc.method === WC_SERVICE_METHOD) {
      return {
        ...svc,
        uid: service.uid,
        params: {
          ...svc.params,
          sessionTopic: session?.topic,
        },
      }
    }
    // Return non-WC services unchanged
    return svc
  }

  return {
    ...response,
    proposer: injectSessionParams(response.proposer),
    payer: response.payer?.map(injectSessionParams),
    authorization: response.authorization?.map(injectSessionParams),
  }
}

export const makeServicePlugin = (
  provider: Promise<any>,
  config: FclWalletConnectConfig = {
    projectId: "",
    wcRequestHook: null,
    disableNotifications: false,
  }
) => {
  const services = (config.wallets || []).map((wallet: any) => ({
    ...wallet,
    type: "authn",
    method: WC_SERVICE_METHOD,
    endpoint: FLOW_METHODS.FLOW_AUTHN,
    f_type: "Service",
    f_vsn: "1.0.0",
  }))

  return {
    name: SERVICE_PLUGIN_NAME,
    f_type: "ServicePlugin",
    type: "discovery-service",
    serviceStrategy: {
      method: WC_SERVICE_METHOD,
      exec: makeExec(provider, config),
    },
    services,
  }
}

const makeExec = (
  signerPromise: Promise<any>,
  config: FclWalletConnectConfig
) => {
  // Store the wallet's deep link URL from the initial authn request for all subsequent WC/RPC requests (authz, pre-authz, user-sign)
  let walletAppLink: string | null = null

  return async ({
    service,
    body,
    opts,
    abortSignal,
    user,
    config: fclConfig,
  }: {
    service: any
    body: any
    opts: any
    abortSignal?: AbortSignal
    user: any
    config: any
  }) => {
    const {wcRequestHook} = config

    const client = await signerPromise
    invariant(!!client, "WalletConnect is not initialized")

    const redirect =
      client.metadata?.redirect?.native || client.metadata?.redirect?.universal

    const method = service.endpoint

    // Determine wallet app link and store it for subsequent requests
    const appLink = determineWalletAppLink(method, service, walletAppLink)
    if (method === FLOW_METHODS.FLOW_AUTHN) {
      walletAppLink = appLink
    }

    // Find or validate existing session
    const sessionTopic = service.params?.sessionTopic
    let session = await findValidSession(client, sessionTopic)
    let isNewlyCreatedSession = false

    // If this is an authn request and we already have a valid session, return user
    if (
      session &&
      method === FLOW_METHODS.FLOW_AUTHN &&
      session.topic === sessionTopic
    ) {
      return user
    }

    // Validate network matches between session and current config
    if (session) {
      try {
        const sessionChain = session.namespaces.flow?.chains?.[0] || ""
        const sessionNetwork = sessionChain.split(":")[1] || ""
        const currentNetwork = fclConfig.client.network

        if (
          sessionNetwork &&
          currentNetwork &&
          sessionNetwork !== currentNetwork
        ) {
          // Network changed so disconnect old session and create new one
          await disconnectSession(client, session.topic, {
            code: 6000,
            message: "Network changed",
          })
          session = null
        }
      } catch {
        // Failed to validate network but continue anyway
      }
    }

    // Create new session if needed
    if (!session) {
      session = await new Promise<SessionTypes.Struct>((resolve, reject) => {
        connectWc({
          service,
          onClose: () => reject(`Declined: Externally Halted`),
          appLink,
          client,
          method,
          wcRequestHook,
          abortSignal,
          network: fclConfig.client.network,
          redirect,
        }).then(resolve, reject)
      })
      isNewlyCreatedSession = true
    }

    if (wcRequestHook && wcRequestHook instanceof Function) {
      wcRequestHook({
        type: REQUEST_TYPES.SIGNING_REQUEST,
        method,
        service,
        session: session ?? null,
        pairing: null,
        uri: null,
      })
    }

    // Send the request (don't await yet)
    const requestPromise = request({
      method,
      body,
      session,
      client,
      abortSignal,
      disableNotifications: service.params?.disableNotifications,
    }).then((response: any) => {
      // Inject session topic into PreAuthzResponse services
      if (
        method === FLOW_METHODS.FLOW_PRE_AUTHZ &&
        response?.f_type === "PreAuthzResponse"
      ) {
        return injectSessionIntoPreAuthz(response, session, service)
      }
      return response
    })

    // Deep link to wallet for all requests (mobile requirement)
    // IMPORTANT: For newly created sessions, the wallet was already opened during connectWc()
    // for session approval. The wallet remains open and can immediately handle the request,
    // so we should NOT open it again. This applies to ALL methods (authn, authz, pre_authz, etc.)
    // to prevent double-opening the wallet during reconnection flows.
    const shouldOpenWallet = !isNewlyCreatedSession

    if (shouldOpenWallet) {
      // The WalletConnect client.request() posts to relay synchronously, then waits for response
      // We open the wallet immediately after the request is sent
      // The wallet should fetch pending requests for this session when opened via deep link

      // Construct deep link with session topic and redirect URI for proper routing
      const params = new URLSearchParams({topic: session.topic})
      if (redirect) params.append("redirect", redirect)
      const deepLinkUrl = `${appLink}?${params.toString()}`
      // Open wallet right away as the request is already on the relay
      // Use setImmediate to avoid blocking the request promise
      setImmediate(() => {
        openDeeplink(deepLinkUrl)
      })
    }

    // Now wait for the response
    const finalResponse = await requestPromise
    return finalResponse
  }
}

// Connect to WalletConnect via deep link (React Native mobile-first approach)
async function connectWc({
  service,
  onClose,
  appLink,
  client,
  method,
  wcRequestHook,
  abortSignal,
  network,
  redirect,
}: {
  service: any
  onClose: any
  appLink: string
  client: any
  method: string
  wcRequestHook: any
  abortSignal?: AbortSignal
  network: string
  redirect?: string
}): Promise<SessionTypes.Struct> {
  try {
    const {uri, approval, cleanup} = await createSessionProposal({
      client,
      existingPairing: undefined,
      network,
    })

    if (wcRequestHook && wcRequestHook instanceof Function) {
      wcRequestHook({
        type: REQUEST_TYPES.SESSION_REQUEST,
        method,
        service,
        session: null,
        pairing: null,
        uri: uri ?? null,
      })
    }

    // For React Native, always use deep linking with redirect parameter
    const params = new URLSearchParams({uri: uri})
    if (redirect) params.append("redirect", redirect)
    const url = appLink + "?" + params.toString()
    openDeeplink(url)

    // Set up abort handling with proper cleanup
    let abortListener: (() => void) | null = null
    const abortPromise = new Promise<never>((_, reject) => {
      if (abortSignal?.aborted) {
        reject(new Error("Session request aborted"))
        return
      }

      abortListener = () => {
        if (cleanup) cleanup()
        reject(new Error("Session request aborted"))
      }
      abortSignal?.addEventListener("abort", abortListener)
    })

    try {
      const session = await Promise.race([approval(), abortPromise])
      if (session == null) throw new Error("Session request failed")

      return session
    } finally {
      // Clean up abort listener after Promise.race resolves
      if (abortListener && abortSignal) {
        abortSignal.removeEventListener("abort", abortListener)
        abortListener = null
      }
    }
  } catch (error) {
    onClose()
    throw error
  }
}

async function openDeeplink(url: string) {
  // Just try opening directly and let the OS handle it
  await Linking.openURL(url)
}
