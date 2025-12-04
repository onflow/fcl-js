import {invariant} from "@onflow/util-invariant"
import {log, LEVELS} from "@onflow/util-logger"
import {
  FLOW_METHODS,
  REQUEST_TYPES,
  SERVICE_PLUGIN_NAME,
  WC_SERVICE_METHOD,
} from "./constants"
import {createSessionProposal, request} from "./session"
import type {FclWalletConnectConfig} from "./fcl-wc"
import {CurrentUser, Service} from "@onflow/typedefs"
import {SessionTypes} from "@walletconnect/types"
import {UniversalProvider} from "@walletconnect/universal-provider"
import {createStore} from "./store"
import {WcClientAdapter, PlatformAdapter} from "./types/adapters"
import {createUniversalProviderAdapter} from "./adapters/universal-provider-adapter"

let providerStore = createStore<{
  [key: string]: InstanceType<typeof UniversalProvider>
}>({})

// Lazy-loaded browser-specific modules (only loaded when needed in browser)
let browserPlatformAdapterPromise: Promise<any> | null = null

/**
 * Lazily load the browser platform adapter.
 * This prevents React Native from trying to bundle browser-specific code.
 */
async function getBrowserPlatformAdapter(config: any): Promise<PlatformAdapter> {
  if (!browserPlatformAdapterPromise) {
    browserPlatformAdapterPromise = import("./adapters/browser-platform-adapter")
  }
  const module = await browserPlatformAdapterPromise
  return module.createBrowserPlatformAdapter({
    pairingModalOverride: config.pairingModalOverride,
  })
}

/**
 * Creates the FCL WalletConnect service plugin.
 * This is the main entry point for integrating WalletConnect with FCL.
 */
export const makeServicePlugin = (
  clientOrProvider:
    | Promise<WcClientAdapter>
    | Promise<InstanceType<typeof UniversalProvider> | null>,
  config: FclWalletConnectConfig = {
    projectId: "",
    includeBaseWC: false,
    wallets: [],
    wcRequestHook: null,
    pairingModalOverride: null,
    disableNotifications: false,
  }
) => {
  // Normalize client/provider promise to WcClientAdapter
  const clientAdapterPromise: Promise<WcClientAdapter | null> = (
    clientOrProvider as Promise<any>
  ).then((clientOrProvider: any) => {
    if (!clientOrProvider) return null

    // Check if it's already a WcClientAdapter (has getProjectId method)
    if (typeof clientOrProvider.getProjectId === "function") {
      return clientOrProvider as WcClientAdapter
    }

    // It's a UniversalProvider, wrap it
    return createUniversalProviderAdapter(clientOrProvider)
  })

  // Build services array from configured wallets
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
      exec: makeExec(clientAdapterPromise, config),
    },
    services,
  }
}

/**
 * Creates the exec function that handles WalletConnect requests.
 */
const makeExec = (
  clientAdapterPromise: Promise<WcClientAdapter | null>,
  config: FclWalletConnectConfig
) => {
  // Store the wallet's deep link URL from the initial authn request
  // for all subsequent WC/RPC requests (authz, pre-authz, user-sign)
  let walletAppLink: string | null = null

  // Platform adapter is resolved lazily - either from config or browser default
  let platformAdapterPromise: Promise<PlatformAdapter> | null = null

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
    const {wcRequestHook, disableNotifications: _appDisabledNotifications} = config

    const appDisabledNotifications =
      service.params?.disableNotifications ?? _appDisabledNotifications

    // Resolve platform adapter (use provided or lazy-load browser default)
    if (!platformAdapterPromise) {
      if (config.platformAdapter) {
        platformAdapterPromise = Promise.resolve(config.platformAdapter)
      } else {
        // Lazy load browser adapter only when needed
        platformAdapterPromise = getBrowserPlatformAdapter(config)
      }
    }
    const platformAdapter = await platformAdapterPromise

    // Resolve the client adapter
    const resolvedClient = await resolveClient({
      clientAdapterPromise,
      externalProviderOrTopic: service.params?.externalProvider,
    })
    invariant(!!resolvedClient, "WalletConnect is not initialized")

    const {client, isExternal} = resolvedClient

    // Get session using platform-specific session finding if available
    let session: SessionTypes.Struct | null
    const sessionTopic = service.params?.sessionTopic || service.params?.externalProvider

    if (platformAdapter.findValidSession) {
      // React Native uses explicit session finding with validation
      session = await platformAdapter.findValidSession(client, sessionTopic)
    } else {
      // Web uses the client's current session
      session = client.getSession()
    }

    let pairing: any
    const method = service.endpoint
    const appLink = validateAppLink(service)

    // Store wallet app link for subsequent requests (React Native behavior)
    if (method === FLOW_METHODS.FLOW_AUTHN) {
      walletAppLink = appLink
    }

    // If the user is already connected to this session, use it
    if (
      !!session?.topic &&
      session?.topic === sessionTopic &&
      method === FLOW_METHODS.FLOW_AUTHN
    ) {
      return user
    }

    // Validate network matches between session and current config (if platform supports it)
    if (session && platformAdapter.validateSession) {
      const isValid = await platformAdapter.validateSession(client, session)
      if (!isValid) {
        // Network changed or session invalid, disconnect and create new
        if (platformAdapter.disconnectSession) {
          await platformAdapter.disconnectSession(client, session.topic, {
            code: 6000,
            message: "Session invalid or network changed",
          })
        }
        session = null
      }
    }

    // Track if we're creating a new session
    let isNewlyCreatedSession = false

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
          pairing,
          wcRequestHook,
          abortSignal,
          network: fclConfig.client.network,
          platformAdapter,
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
        pairing: pairing ?? null,
        uri: null,
      })
    }

    // Determine if we should deeplink to the wallet
    const shouldDeeplink = platformAdapter.shouldDeepLink
      ? platformAdapter.shouldDeepLink({service, user, isNewlyCreatedSession})
      : shouldDeepLinkDefault({service, user, platformAdapter})

    if (shouldDeeplink) {
      const deeplinkUrl = platformAdapter.buildDeeplinkUrl
        ? platformAdapter.buildDeeplinkUrl(
            walletAppLink || appLink,
            session,
            client.getRedirectUri?.()
          )
        : walletAppLink || appLink

      // React Native uses setImmediate to avoid blocking, web opens directly
      if (typeof setImmediate !== "undefined" && platformAdapter.isMobile()) {
        setImmediate(() => platformAdapter.openDeeplink(deeplinkUrl))
      } else {
        platformAdapter.openDeeplink(deeplinkUrl)
      }
    }

    // Show notification to the user if not disabled by app developer or wallet
    const walletDisabledNotifications =
      session?.sessionProperties?.["fclWc.disableNotificationsOnMobile"] === "true"

    const notification =
      !appDisabledNotifications &&
      !walletDisabledNotifications &&
      platformAdapter.showNotification
        ? platformAdapter.showNotification({
            title: getWalletName(user, service),
            message: platformAdapter.isMobile()
              ? "Tap to view request in app"
              : "Pending request on your mobile device",
            icon: getWalletIcon(user, service),
            onClick:
              platformAdapter.isMobile() && service.uid
                ? () => platformAdapter.openDeeplink(service.uid!)
                : undefined,
            debounceDelay: service.type === "pre-authz" ? 500 : 0,
          })
        : null

    // Make request to the WalletConnect client and return the result
    return await request({
      method,
      body,
      session,
      client,
      abortSignal,
      isExternal,
      disableNotifications: service.params?.disableNotifications,
      // React Native injects session topic and service UID for subsequent requests
      sessionTopic: session.topic,
      serviceUid: service.uid,
    }).finally(() => notification?.dismiss())
  }
}

/**
 * Get wallet name for notifications
 */
function getWalletName(user: CurrentUser, service: Service): string {
  const authnService = user?.services?.find((s: any) => s.type === "authn")
  const walletProvider = authnService?.provider || service.provider
  return walletProvider?.name || "Mobile Wallet"
}

/**
 * Get wallet icon for notifications
 */
function getWalletIcon(user: CurrentUser, service: Service): string | undefined {
  const authnService = user?.services?.find((s: any) => s.type === "authn")
  const walletProvider = authnService?.provider || service.provider
  return walletProvider?.icon
}

/**
 * Default logic for determining if we should deeplink to the wallet.
 * Used when platform adapter doesn't provide custom shouldDeepLink.
 */
function shouldDeepLinkDefault({
  service,
  user,
  platformAdapter,
}: {
  service: any
  user: any
  platformAdapter: PlatformAdapter
}): boolean {
  // Only deeplink on mobile
  if (!platformAdapter.isMobile()) return false

  // If this is an authn request, the user has already been deeplinked by connectWc
  if (service.endpoint === FLOW_METHODS.FLOW_AUTHN) return false

  // If there was a pre-authz WC request, the user has already been deeplinked
  if (
    service.endpoint === FLOW_METHODS.FLOW_AUTHZ &&
    user?.services?.find(
      (s: Service) => s.method === WC_SERVICE_METHOD && s.type === "pre-authz"
    )
  )
    return false

  return true
}

/**
 * Connect to WalletConnect directly from the browser via deep link or modal.
 */
async function connectWc({
  service,
  onClose,
  appLink,
  client,
  method,
  pairing,
  wcRequestHook,
  abortSignal,
  network,
  platformAdapter,
}: {
  service: any
  onClose: any
  appLink: string
  client: WcClientAdapter
  method: string
  pairing: any
  wcRequestHook: any
  abortSignal?: AbortSignal
  network: string
  platformAdapter: PlatformAdapter
}): Promise<SessionTypes.Struct> {
  const projectId = client.getProjectId()
  invariant(
    !!projectId,
    "Cannot establish connection, WalletConnect projectId is undefined"
  )

  try {
    const {uri, approval} = await createSessionProposal({
      client,
      existingPairing: pairing?.topic,
      network,
    })

    if (wcRequestHook && wcRequestHook instanceof Function) {
      wcRequestHook({
        type: REQUEST_TYPES.SESSION_REQUEST,
        method,
        service,
        session: null,
        pairing: pairing ?? null,
        uri: uri ?? null,
      })
    }

    // Handle connection based on platform
    if (platformAdapter.isMobile()) {
      // Mobile: use deep linking
      const redirectUri = client.getRedirectUri?.()
      const params = new URLSearchParams({uri})
      if (redirectUri) params.append("redirect", redirectUri)
      const url = pairing == null ? `${appLink}?${params.toString()}` : appLink
      platformAdapter.openDeeplink(url)
    } else if (!pairing && platformAdapter.showPairingModal) {
      // Desktop without existing pairing: show modal
      await platformAdapter.showPairingModal(uri, projectId, onClose)
    }

    // Wait for session approval
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
        message: error.message,
        level: LEVELS.error,
      })
    }
    onClose()
    throw error
  } finally {
    platformAdapter.closePairingModal?.()
  }
}

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

/**
 * Resolve the client adapter, handling external providers.
 */
async function resolveClient({
  clientAdapterPromise,
  externalProviderOrTopic,
}: {
  clientAdapterPromise: Promise<WcClientAdapter | null>
  externalProviderOrTopic?: string | InstanceType<typeof UniversalProvider>
}): Promise<{
  client: WcClientAdapter
  isExternal: boolean
} | null> {
  if (!externalProviderOrTopic) {
    const resolved = await clientAdapterPromise
    return resolved ? {client: resolved, isExternal: false} : null
  }

  // If it's a UniversalProvider instance, wrap it and store it
  if (typeof externalProviderOrTopic !== "string") {
    const topic = externalProviderOrTopic.session?.topic
    if (!topic) {
      throw new Error(
        "Cannot resolve provider: UniversalProvider is not initialized"
      )
    }
    providerStore.setState({
      [topic]: externalProviderOrTopic,
    })
    return {
      client: createUniversalProviderAdapter(externalProviderOrTopic),
      isExternal: true,
    }
  }

  // It's a string topic, look up the stored provider
  const externalTopic = externalProviderOrTopic
  if (externalTopic) {
    let storedProvider = providerStore.getState()[externalTopic]
    if (!storedProvider) {
      // Wait for provider to be registered
      let unsubStore: () => void
      let timeout: NodeJS.Timeout

      storedProvider = await new Promise<any>((resolve, reject) => {
        unsubStore = providerStore.subscribe(() => {
          const provider = providerStore.getState()[externalTopic]
          if (provider) {
            resolve(provider)
          }
        })

        timeout = setTimeout(() => {
          reject(
            new Error(
              `Provider for external topic ${externalTopic} not found after 5 seconds`
            )
          )
        }, 5000)
      }).finally(() => {
        clearTimeout(timeout)
        unsubStore()
      })
    }

    return {
      client: createUniversalProviderAdapter(storedProvider),
      isExternal: true,
    }
  }

  const resolved = await clientAdapterPromise
  return resolved ? {client: resolved, isExternal: false} : null
}
