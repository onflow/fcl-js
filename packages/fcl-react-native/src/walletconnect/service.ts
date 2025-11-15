import {invariant} from "@onflow/util-invariant"
import {log, LEVELS} from "@onflow/util-logger"
import {
  FLOW_METHODS,
  REQUEST_TYPES,
  SERVICE_PLUGIN_NAME,
  WC_SERVICE_METHOD,
} from "./constants"
import {createSessionProposal, request} from "./session"
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

const makeExec = (
  signerPromise: Promise<any>,
  config: FclWalletConnectConfig
) => {
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
    console.log(
      "WalletConnect Service Request Started - Method:",
      service.endpoint,
      "Service:",
      service.uid
    )

    const {wcRequestHook, disableNotifications: _appDisabledNotifications} =
      config

    const appDisabledNotifications =
      service.params?.disableNotifications ?? _appDisabledNotifications

    console.log("WalletConnect: Waiting for client...")
    const client = await signerPromise
    invariant(!!client, "WalletConnect is not initialized")
    console.log("WalletConnect: Client ready")

    const method = service.endpoint
    const appLink = validateAppLink(service)
    console.log("WalletConnect: App link validated:", appLink)

    // Check if service has a session topic in params (from injected PreAuthzResponse)
    const sessionTopic = service.params?.sessionTopic

    let session: SessionTypes.Struct | null = null
    let isExistingSession = false // Track if we're reusing an existing session

    // If we have a session topic from params, use it directly
    if (sessionTopic) {
      console.log(
        "WalletConnect: Using session topic from params:",
        sessionTopic
      )
      try {
        session = client.session.get(sessionTopic)
        console.log("WalletConnect: Found session from topic")
        isExistingSession = true
      } catch (e) {
        console.log(
          "WalletConnect: Session not found for topic, will search for active sessions"
        )
        // Session not found, fall through to session lookup
      }
    }

    // If no session yet, find an existing session
    if (!session) {
      const activeSessions = client.session.getAll()
      console.log(
        "WalletConnect: Active sessions count:",
        activeSessions.length
      )

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
            // Final check: verify the session still exists in the client
            try {
              const stillExists = client.session.get(foundSession.topic)
              if (stillExists) {
                session = foundSession
                isExistingSession = true
              }
            } catch (e) {
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
    console.log(
      "WalletConnect: Sending request to wallet - Method:",
      method,
      "Session topic:",
      session?.topic
    )
    const requestPromise = request({
      method: method,
      body: body,
      session,
      client,
      abortSignal,
      disableNotifications: service.params?.disableNotifications,
    }).then((response: any) => {
      console.log(
        "WalletConnect: Received response from wallet - Method:",
        method
      )
      console.log("WalletConnect: Response f_type:", response?.f_type)

      // For PreAuthzResponse, we need to inject our session topic into the returned services
      // so FCL knows to route follow-up requests through our WalletConnect plugin
      if (
        method === FLOW_METHODS.FLOW_PRE_AUTHZ &&
        response?.f_type === "PreAuthzResponse"
      ) {
        console.log("WalletConnect: Processing PreAuthzResponse")
        console.log("WalletConnect: Original response services:")
        console.log("  -> Proposer:", response.proposer ? "present" : "missing")
        console.log(
          "  -> Payer:",
          response.payer ? `array of ${response.payer.length}` : "missing"
        )
        console.log(
          "  -> Authorization:",
          response.authorization
            ? `array of ${response.authorization.length}`
            : "missing"
        )

        // Helper to inject session params into a service
        const injectSessionParams = (svc: any) => {
          if (!svc) return svc
          console.log(
            "WalletConnect: Injecting session params into service - Type:",
            svc.type,
            "Endpoint:",
            svc.endpoint
          )
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
        const modifiedResponse = {
          ...response,
          proposer: injectSessionParams(response.proposer),
          payer: response.payer?.map(injectSessionParams),
          authorization: response.authorization?.map(injectSessionParams),
        }

        console.log("WalletConnect: Modified PreAuthzResponse services:")
        console.log("  -> Proposer method:", modifiedResponse.proposer?.method)
        console.log(
          "  -> Proposer has sessionTopic:",
          !!modifiedResponse.proposer?.params?.sessionTopic
        )
        console.log("  -> Payer count:", modifiedResponse.payer?.length || 0)
        console.log(
          "  -> Authorization count:",
          modifiedResponse.authorization?.length || 0
        )

        return modifiedResponse
      }
      return response
    })

    // Deep link to wallet for all requests (mobile requirement)
    // EXCEPT when we just created a brand new session during this request
    // (because the wallet was already opened during connectWc() for session approval)
    const justCreatedNewSession = !isExistingSession && session
    const shouldOpenWallet = isExistingSession && session

    if (shouldOpenWallet) {
      // The WalletConnect client.request() posts to relay synchronously, then waits for response
      // We open the wallet immediately after the request is sent
      // The wallet should fetch pending requests for this session when opened via deep link

      // Construct deep link with session topic for proper routing
      const deepLinkUrl = `${appLink}?topic=${session.topic}`
      console.log(
        "WalletConnect: Opening wallet immediately with deep link:",
        deepLinkUrl
      )

      // Open wallet right away - the request is already on the relay
      // Use setImmediate to avoid blocking the request promise
      setImmediate(() => {
        openDeeplink(deepLinkUrl)
      })
    }

    // Now wait for the response
    console.log("WalletConnect: Waiting for wallet response...")
    console.log(
      "WalletConnect: Wallet should automatically return to app via redirect URI after approval"
    )
    const finalResponse = await requestPromise
    console.log(
      "WalletConnect: Response received! Request completed successfully - Method:",
      method
    )
    return finalResponse

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
