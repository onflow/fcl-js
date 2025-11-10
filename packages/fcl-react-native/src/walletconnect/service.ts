import {invariant} from "@onflow/util-invariant"
import {log, LEVELS} from "@onflow/util-logger"
import {
  FLOW_METHODS,
  REQUEST_TYPES,
  SERVICE_PLUGIN_NAME,
  WC_SERVICE_METHOD,
} from "./constants"
import {createSessionProposal, request, makeSessionData} from "./session"
import {FclWalletConnectConfig} from "./client"
import {SessionTypes} from "@walletconnect/types"

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

const makeExec = (signerPromise: Promise<any>, config: FclWalletConnectConfig) => {
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
    const {wcRequestHook, disableNotifications: _appDisabledNotifications} =
      config

    const appDisabledNotifications =
      service.params?.disableNotifications ?? _appDisabledNotifications

    const client = await signerPromise
    invariant(!!client, "WalletConnect is not initialized")

    const method = service.endpoint
    const appLink = validateAppLink(service)

    // Check if service has a session topic in params (from injected PreAuthzResponse)
    const sessionTopic = service.params?.sessionTopic

    let session: SessionTypes.Struct | null = null

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

      // Find an existing session - prefer the one matching the service UID
      if (activeSessions.length > 0) {
        // Try to find a session for this specific wallet
        // Match by wallet metadata or use the most recent session
        let foundSession = activeSessions.find((s: SessionTypes.Struct) => {
          const walletUrl = s.peer?.metadata?.url
          return walletUrl && (
            walletUrl.includes('flow.com') ||
            walletUrl.includes('lilico.app') ||
            walletUrl.includes('frw')
          )
        }) || activeSessions[activeSessions.length - 1]

      // Validate the session is still active and not expired
      if (foundSession) {
        const isExpired = foundSession.expiry && foundSession.expiry <= Date.now() / 1000
        const isAcknowledged = foundSession.acknowledged

        if (isExpired) {
          try {
            await client.disconnect({
              topic: foundSession.topic,
              reason: {code: 6000, message: "Session expired"}
            })
          } catch (e) {
            // Session already disconnected
          }
          foundSession = null
        } else if (!isAcknowledged) {
          foundSession = null
        } else {
          // Final check: verify the session still exists in the client
          try {
            const stillExists = client.session.get(foundSession.topic)
            if (stillExists) {
              session = foundSession
            }
          } catch (e) {
            foundSession = null
          }
        }
      }
      }
    }

    // If this is an auth request and we already have a valid session, return user data from session
    if (session && method === FLOW_METHODS.FLOW_AUTHN) {
      // Verify the session is still valid
      const isSessionValid = session.acknowledged && !session.expiry || session.expiry > Date.now() / 1000

      if (!isSessionValid) {
        // Session expired, clear it and create a new one
        try {
          await client.disconnect({topic: session.topic, reason: {code: 6000, message: "Session expired"}})
        } catch (e) {
          // Session already disconnected
        }
        session = null
        // Fall through to create new session
      } else {
        // Extract user data directly from the session without making a request
        const [chainId, address, addr] = makeSessionData(session)

        // Return authentication response with ALL necessary services
        return {
          f_type: "AuthnResponse",
          f_vsn: "1.0.0",
          addr: address,
          services: [
            // Authentication service
            {
              f_type: "Service",
              f_vsn: "1.0.0",
              type: "authn",
              uid: service.uid,
              endpoint: FLOW_METHODS.FLOW_AUTHN,
              method: WC_SERVICE_METHOD,
              id: address,
              identity: {address},
              provider: service.provider,
              params: {
                sessionTopic: session.topic,
              },
            },
            // Authorization service (required for transactions)
            {
              f_type: "Service",
              f_vsn: "1.0.0",
              type: "authz",
              uid: service.uid,
              endpoint: FLOW_METHODS.FLOW_AUTHZ,
              method: WC_SERVICE_METHOD,
              identity: {address},
              params: {
                sessionTopic: session.topic,
              },
            },
            // Pre-authorization service (required for some transactions)
            {
              f_type: "Service",
              f_vsn: "1.0.0",
              type: "pre-authz",
              uid: service.uid,
              endpoint: FLOW_METHODS.FLOW_PRE_AUTHZ,
              method: WC_SERVICE_METHOD,
              data: {
                address,
                keyId: 0,
              },
              params: {
                sessionTopic: session.topic,
              },
            },
            // User signature service
            {
              f_type: "Service",
              f_vsn: "1.0.0",
              type: "user-signature",
              uid: service.uid,
              endpoint: FLOW_METHODS.FLOW_USER_SIGN,
              method: WC_SERVICE_METHOD,
              params: {
                sessionTopic: session.topic,
              },
            },
          ],
        }
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
        }).then(resolve, reject)
      })

      // For authentication, session approval is enough - return user data immediately
      if (method === FLOW_METHODS.FLOW_AUTHN) {
        const [chainId, address, addr] = makeSessionData(session)

        const authResponse = {
          f_type: "AuthnResponse",
          f_vsn: "1.0.0",
          addr: address,
          services: [
            // Authentication service
            {
              f_type: "Service",
              f_vsn: "1.0.0",
              type: "authn",
              uid: service.uid,
              endpoint: FLOW_METHODS.FLOW_AUTHN,
              method: WC_SERVICE_METHOD,
              id: address,
              identity: {address},
              provider: service.provider,
              params: {
                sessionTopic: session.topic,
              },
            },
            // Authorization service (required for transactions)
            {
              f_type: "Service",
              f_vsn: "1.0.0",
              type: "authz",
              uid: service.uid,
              endpoint: FLOW_METHODS.FLOW_AUTHZ,
              method: WC_SERVICE_METHOD,
              identity: {
                address: address,
                keyId: 0,
              },
              data: {
                address: address,
                keyId: 0,
              },
              params: {
                sessionTopic: session.topic,
              },
            },
            // Pre-authorization service (required for proxy accounts like FRW)
            {
              f_type: "Service",
              f_vsn: "1.0.0",
              type: "pre-authz",
              uid: service.uid,
              endpoint: FLOW_METHODS.FLOW_PRE_AUTHZ,
              method: WC_SERVICE_METHOD,
              data: {address, keyId: 0},
              params: {
                sessionTopic: session.topic,
              },
            },
            // User signature service
            {
              f_type: "Service",
              f_vsn: "1.0.0",
              type: "user-signature",
              uid: service.uid,
              endpoint: FLOW_METHODS.FLOW_USER_SIGN,
              method: WC_SERVICE_METHOD,
              params: {
                sessionTopic: session.topic,
              },
            },
          ],
        }

        return authResponse
      }
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
      if (method === FLOW_METHODS.FLOW_PRE_AUTHZ && response?.f_type === "PreAuthzResponse") {
        // Helper to inject session params into a service
        const injectSessionParams = (svc: any) => {
          if (!svc) return svc
          return {
            ...svc,
            method: WC_SERVICE_METHOD,
            uid: service.uid, // Use our plugin's UID
            params: {
              ...svc.params,
              sessionTopic: session?.topic,
            },
          }
        }

        // Inject session topic into all returned services
        return {
          ...response,
          proposer: injectSessionParams(response.proposer),
          payer: response.payer?.map(injectSessionParams),
          authorization: response.authorization?.map(injectSessionParams),
        }
      }
      return response
    })

    // For signing requests (not auth), deep link to wallet with session info
    const shouldOpenWallet = shouldDeepLink({service, user}) && session

    if (shouldOpenWallet) {
      // Small delay to ensure the request is sent to the relay first
      await new Promise(resolve => setTimeout(resolve, 500))

      // Construct deep link with session topic for proper routing
      const deepLinkUrl = `${appLink}?topic=${session.topic}`
      openDeeplink(deepLinkUrl)
    }

    // Now wait for the response
    return await requestPromise

    function validateAppLink({uid}: {uid: string}) {
      if (!(uid && /^(ftp|http|https):\/\/[^ "]+$/.test(uid))) {
        log({
          title: "WalletConnect Service Warning",
          message: `service.uid should be a valid universal link url. Found: ${uid}`,
          level: LEVELS.warn,
        })
      }
      return uid
    }
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
}: {
  service: any
  onClose: any
  appLink: string
  client: any
  method: string
  wcRequestHook: any
  abortSignal?: AbortSignal
  network: string
}): Promise<SessionTypes.Struct> {
  let _uri: string | null = null

  try {
    const {uri, approval} = await createSessionProposal({
      client,
      existingPairing: undefined,
      network,
    })

    _uri = uri

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

    // For React Native, always use deep linking
    const queryString = new URLSearchParams({uri: uri}).toString()
    const url = appLink + "?" + queryString
    openDeeplink(url)

    const session = await Promise.race([
      approval(),
      new Promise<never>((_, reject) => {
        if (abortSignal?.aborted) {
          reject(new Error("Session request aborted"))
        }
        abortSignal?.addEventListener("abort", () => {
          reject(new Error("Session request aborted"))
        })
      }),
    ])

    if (session == null) {
      throw new Error("Session request failed")
    }

    return session
  } catch (error) {
    if (error instanceof Error) {
      log({
        title: `${error.name} Error establishing WalletConnect session`,
        message: `
          ${error.message}
          uri: ${_uri}
        `,
        level: LEVELS.error,
      })
    }
    onClose()
    throw error
  }
}

// Utility functions for React Native
function shouldDeepLink({service, user}: {service: any; user: any}): boolean {
  // In React Native, we're always on mobile, so we need to deep link for ALL signing requests
  // Skip only for authentication requests (already handled in connectWc)
  const endpoint = service.endpoint

  if (endpoint === FLOW_METHODS.FLOW_AUTHN) return false

  // Deep link for all signing-related requests:
  // - flow_pre_authz: get the PreAuthzResponse with payer/proposer/authorization services
  // - flow_authz: standard authorization
  // - flow_sign_payer: payer signature (from PreAuthzResponse)
  // - flow_sign_proposer: proposer signature (from PreAuthzResponse)
  // - flow_user_sign: user signature requests

  return true
}

async function openDeeplink(url: string) {
  try {
    // Lazy load Linking to avoid TurboModule errors
    const {Linking} = await import("react-native")

    // On Android, canOpenURL() often returns false for HTTPS URLs
    // Just try opening directly and let the OS handle it
    await Linking.openURL(url)
  } catch (error) {
    // If direct open fails, the app might not be installed or the URL is invalid
    log({
      title: "WalletConnect Deep Link Error",
      message: `Failed to open wallet app. Make sure the wallet is installed.`,
      level: LEVELS.error,
    })
  }
}
