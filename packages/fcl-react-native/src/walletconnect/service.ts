import {invariant} from "@onflow/util-invariant"
import {log, LEVELS} from "@onflow/util-logger"
import {
  FLOW_METHODS,
  REQUEST_TYPES,
  SERVICE_PLUGIN_NAME,
  WC_SERVICE_METHOD,
} from "./constants"
import {createSessionProposal, request} from "./session"
import type {FclWalletConnectConfig} from "./client"
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

  console.log("=== WalletConnect Service Plugin created with", services.length, "services")
  if (services.length > 0) {
    console.log("=== Services:", JSON.stringify(services, null, 2))
  }

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
    console.log("=== WC/RPC exec called with method:", service.endpoint)

    const {wcRequestHook, disableNotifications: _appDisabledNotifications} =
      config

    const appDisabledNotifications =
      service.params?.disableNotifications ?? _appDisabledNotifications

    const client = await signerPromise
    invariant(!!client, "WalletConnect is not initialized")

    // Get active sessions from SignClient
    const activeSessions = client.session.getAll()
    let session: SessionTypes.Struct | null = null

    // Find an existing session for this service
    if (activeSessions.length > 0) {
      // Use the most recent session
      session = activeSessions[activeSessions.length - 1]
      console.log("=== Found existing WalletConnect session:", session.topic)
    }

    const method = service.endpoint
    const appLink = validateAppLink(service)

    // If the user is already connected to this session, use it
    if (
      !!session?.topic &&
      session?.topic === service.params?.sessionTopic &&
      method === FLOW_METHODS.FLOW_AUTHN
    ) {
      console.log("=== Using existing WalletConnect session for auth")
      return user
    }

    if (session == null) {
      console.log("=== Creating new WalletConnect session")
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

    // Deeplink to the wallet app if necessary
    if (shouldDeepLink({service, user})) {
      console.log("=== Opening deep link to wallet:", appLink)
      openDeeplink(appLink)
    }

    console.log("=== Making WalletConnect request")
    // Make request to the WalletConnect client and return the result
    return await request({
      method,
      body,
      session,
      client,
      abortSignal,
      disableNotifications: service.params?.disableNotifications,
    })

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
  console.log("=== Connecting to WalletConnect...")

  let _uri: string | null = null

  try {
    const {uri, approval} = await createSessionProposal({
      client,
      existingPairing: undefined,
      network,
    })

    _uri = uri
    console.log("=== WalletConnect URI generated:", uri.substring(0, 50) + "...")

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
    console.log("=== Opening wallet app with deep link")
    openDeeplink(url)

    console.log("=== Waiting for session approval...")
    const session = await Promise.race([
      approval().then(s => {
        console.log("=== Session approved!", s)
        return s
      }),
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

    console.log("=== WalletConnect session established successfully")
    console.log("=== Session topic:", session.topic)
    console.log("=== Session namespaces:", JSON.stringify(session.namespaces, null, 2))
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
  // In React Native, we're always on mobile, so always deep link
  // But skip if it's an authentication request (already handled in connectWc)
  return service.endpoint !== FLOW_METHODS.FLOW_AUTHN
}

async function openDeeplink(url: string) {
  try {
    // Lazy load Linking to avoid TurboModule errors
    const {Linking} = await import("react-native")

    // On Android, canOpenURL() often returns false for HTTPS URLs
    // Just try opening directly and let the OS handle it
    console.log("=== Attempting to open URL:", url)
    await Linking.openURL(url)
    console.log("=== URL opened successfully")
  } catch (error) {
    console.error("=== Error opening deep link:", error)
    // If direct open fails, the app might not be installed or the URL is invalid
    console.warn("=== Make sure the wallet app is installed on your device")
  }
}
