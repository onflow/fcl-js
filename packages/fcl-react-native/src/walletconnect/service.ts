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
  // Store the wallet's deep link URL from the initial authn request
  // This is reused for all subsequent WC/RPC requests (authz, pre-authz, user-sign)
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

    // Get redirect URI from WalletConnect client metadata (auto-detected during initialization)
    const redirect =
      client.metadata?.redirect?.native || client.metadata?.redirect?.universal

    const method = service.endpoint

    // Determine the app link (deep link URL) for opening the wallet
    // For authn requests, use service.uid and store it for subsequent requests
    // For other requests (authz, pre-authz from HTTP/POST), use the stored walletAppLink
    let appLink: string

    if (method === FLOW_METHODS.FLOW_AUTHN) {
      // This is the initial authn request - store the wallet's deep link URL
      appLink = service.uid
      walletAppLink = appLink
    } else if (walletAppLink) {
      // Use the stored wallet app link for all subsequent requests
      appLink = walletAppLink
    } else {
      // Fallback to service.uid (shouldn't happen in normal flow)
      appLink = service.uid
    }

    // Check if service has a session topic in params (from injected PreAuthzResponse)
    const sessionTopic = service.params?.sessionTopic

    let session: SessionTypes.Struct | null = null
    let isNewlyCreatedSession = false // Track if we just created a new session in this request

    // If we have a session topic from params, use it directly
    if (sessionTopic) {
      try {
        session = client.session.get(sessionTopic)
      } catch (e) {
        // Session not found, fall through to session lookup
      }
    }

    // If no session yet, find an existing session
    if (!session) {
      const activeSessions = client.session.getAll()

      // If there are no active sessions, fall through to create new session

      // Find an existing session - use the most recent session
      if (activeSessions.length > 0) {
        let foundSession = activeSessions[activeSessions.length - 1]

        // Validate the session is still active and not expired
        if (foundSession) {
          const isExpired =
            foundSession.expiry && foundSession.expiry <= Date.now() / 1000
          const isAcknowledged = foundSession.acknowledged

          if (isExpired) {
            try {
              await client.disconnect({
                topic: foundSession.topic,
                reason: {code: 6000, message: "Session expired"},
              })
            } catch (e) {
              // Session already disconnected
            }
            foundSession = null
          } else if (!isAcknowledged) {
            foundSession = null
          } else {
            // Final check: verify the session still exists and is responsive
            try {
              const stillExists = client.session.get(foundSession.topic)
              if (stillExists) {
                // Ping the session to ensure it's actually alive
                await client.ping({topic: foundSession.topic})
                session = foundSession
              }
            } catch (e) {
              // Session doesn't exist or ping failed - disconnect and clear
              try {
                await client.disconnect({
                  topic: foundSession.topic,
                  reason: {code: 6000, message: "Session not responsive"},
                })
              } catch {}
              foundSession = null
            }
          }
        }
      }
    }

    // If this is an authn request and we already have a session, return user
    if (
      session &&
      method === FLOW_METHODS.FLOW_AUTHN &&
      session.topic === service.params?.sessionTopic
    ) {
      return user
    }

    // Validate session if exists for authn
    if (session && method === FLOW_METHODS.FLOW_AUTHN) {
      const isSessionValid =
        (session.acknowledged && !session.expiry) ||
        session.expiry > Date.now() / 1000

      if (!isSessionValid) {
        try {
          await client.disconnect({
            topic: session.topic,
            reason: {code: 6000, message: "Session expired"},
          })
        } catch (e) {
          // Session already disconnected
        }
        session = null
      }
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
          // Disconnect the old session
          try {
            await client.disconnect({
              topic: session.topic,
              reason: {code: 6000, message: "Network changed"},
            })
          } catch (e) {
            // Session already disconnected
          }

          // Force creation of new session with correct network
          session = null
        }
      } catch (e) {
        // Failed to validate network
      }
    }

    if (session == null) {
      session = await new Promise<SessionTypes.Struct>((resolve, reject) => {
        function onClose() {
          reject(`Declined: Externally Halted`)
        }

        connectWc({
          service,
          onClose,
          appLink,
          client,
          method,
          wcRequestHook,
          abortSignal,
          network: fclConfig.client.network,
          redirect,
        }).then(resolve, reject)
      })
      isNewlyCreatedSession = true // Mark that we just created this session
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
      method: method,
      body: body,
      session,
      client,
      abortSignal,
      disableNotifications: service.params?.disableNotifications,
    }).then((response: any) => {
      // For PreAuthzResponse, we need to inject our session topic into the returned services
      // so FCL knows to route follow-up requests through our WalletConnect plugin
      if (
        method === FLOW_METHODS.FLOW_PRE_AUTHZ &&
        response?.f_type === "PreAuthzResponse"
      ) {
        // Helper to inject session params into a service
        const injectSessionParams = (svc: any) => {
          if (!svc) return svc

          // Only modify WalletConnect services
          // Preserve HTTP/POST, HTTP/GET, and other service types as-is
          if (svc.method === WC_SERVICE_METHOD) {
            return {
              ...svc,
              uid: service.uid, // Use our plugin's UID
              params: {
                ...svc.params,
                sessionTopic: session?.topic,
              },
            }
          }

          // Return non-WC services unchanged (e.g., HTTP/POST for payer)
          return svc
        }

        // Inject session topic into all returned services
        const modifiedResponse = {
          ...response,
          proposer: injectSessionParams(response.proposer),
          payer: response.payer?.map(injectSessionParams),
          authorization: response.authorization?.map(injectSessionParams),
        }

        return modifiedResponse
      }
      return response
    })

    // Deep link to wallet for all requests (mobile requirement)
    // On mobile, the wallet needs to be opened to:
    // 1. Process the request (authn, authz, etc.)
    // 2. Show UI to the user for approval
    // 3. Redirect back to the app after approval
    //
    // IMPORTANT: For newly created sessions, the wallet was already opened during connectWc()
    // for session approval. The wallet remains open and can immediately handle the request,
    // so we should NOT open it again. This applies to ALL methods (authn, authz, pre_authz, etc.)
    // to prevent double-opening the wallet during reconnection flows.
    const shouldOpenWallet = session !== null && !isNewlyCreatedSession

    if (shouldOpenWallet) {
      // The WalletConnect client.request() posts to relay synchronously, then waits for response
      // We open the wallet immediately after the request is sent
      // The wallet should fetch pending requests for this session when opened via deep link

      // Construct deep link with session topic and redirect URI for proper routing
      const params = new URLSearchParams({topic: session.topic})
      if (redirect) {
        params.append("redirect", redirect)
      }
      const deepLinkUrl = `${appLink}?${params.toString()}`

      // Open wallet right away - the request is already on the relay
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
  let _uri: string | null = null
  let cleanup: (() => void) | null = null

  try {
    const {
      uri,
      approval,
      cleanup: sessionCleanup,
    } = await createSessionProposal({
      client,
      existingPairing: undefined,
      network,
    })

    _uri = uri
    cleanup = sessionCleanup // Store cleanup function

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
    if (redirect) {
      params.append("redirect", redirect)
    }
    const url = appLink + "?" + params.toString()
    openDeeplink(url)

    // Set up abort handling with proper cleanup
    const abortPromise = new Promise<never>((_, reject) => {
      if (abortSignal?.aborted) {
        reject(new Error("Session request aborted"))
      }
      abortSignal?.addEventListener("abort", () => {
        if (cleanup) {
          cleanup() // Remove display_uri listener
        }
        reject(new Error("Session request aborted"))
      })
    })

    const session = await Promise.race([approval(), abortPromise])

    if (session == null) {
      throw new Error("Session request failed")
    }

    return session
  } catch (error) {
    onClose()
    throw error
  }
}

// Utility functions for React Native
async function openDeeplink(url: string) {
  try {
    // Just try opening directly and let the OS handle it
    await Linking.openURL(url)
  } catch (error) {
    // If opening fails, the wallet app is likely not installed or URL is invalid
    const errorMessage =
      "Cannot open wallet app. Please ensure Flow Reference Wallet is installed and try again."

    // Re-throw with user-friendly message
    throw new Error(errorMessage)
  }
}
