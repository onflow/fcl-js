import {SessionTypes} from "@walletconnect/types"
import {NotificationInfo} from "./types"

/**
 * Options for connecting to a wallet via WalletConnect
 */
export interface WcConnectOpts {
  pairingTopic?: string
  requiredNamespaces: {
    flow: {
      methods: string[]
      chains: string[]
      events: string[]
    }
  }
  optionalNamespaces?: {
    flow: {
      methods: string[]
      chains: string[]
      events: string[]
    }
  }
}

/**
 * Options for making a WalletConnect request
 */
export interface WcRequestOpts {
  topic: string
  chainId: string
  request: {
    method: string
    params: any[]
  }
}

/**
 * Reason for disconnecting a session
 */
export interface WcDisconnectReason {
  code: number
  message: string
}

/**
 * Adapter interface that abstracts the differences between
 * UniversalProvider (web) and SignClient (React Native)
 */
export interface WcClientAdapter {
  /**
   * Connect to a wallet and establish a session
   * Returns the connection URI and an approval promise
   */
  connect(
    opts: WcConnectOpts
  ): Promise<{uri: string; approval: () => Promise<SessionTypes.Struct>}>

  /**
   * Make a request to the connected wallet
   */
  request(opts: WcRequestOpts): Promise<any>

  /**
   * Get the current session (if any)
   * For SignClient, this may return null and findValidSession should be used instead
   */
  getSession(): SessionTypes.Struct | null

  /**
   * Register an event listener for the display_uri event
   */
  on(event: "display_uri", handler: (uri: string) => void): void

  /**
   * Remove an event listener
   */
  removeListener(event: "display_uri", handler: (uri: string) => void): void

  /**
   * Get session by topic (optional, used by React Native for explicit session lookup)
   */
  getSessionByTopic?(topic: string): SessionTypes.Struct | null

  /**
   * Get all sessions (optional, used by React Native for session discovery)
   */
  getAllSessions?(): SessionTypes.Struct[]

  /**
   * Disconnect a session (optional, used by React Native for session cleanup)
   */
  disconnect?(topic: string, reason: WcDisconnectReason): Promise<void>

  /**
   * Get the redirect URI for the client (optional, used by React Native for deeplinks)
   */
  getRedirectUri?(): string | undefined

  /**
   * Get the project ID (used for modal initialization)
   */
  getProjectId(): string
}

/**
 * Notification handle returned by showNotification
 */
export interface NotificationHandle {
  dismiss: () => void
}

/**
 * Platform adapter interface that abstracts browser vs React Native differences
 */
export interface PlatformAdapter {
  /**
   * Open a deeplink URL
   * Browser: uses window.open or link element
   * React Native: uses Linking.openURL
   */
  openDeeplink(url: string): void | Promise<void>

  /**
   * Check if the current platform is mobile
   * Browser: checks navigator.userAgent
   * React Native: always returns true
   */
  isMobile(): boolean

  /**
   * Show a pairing modal with QR code (optional, web only)
   * React Native implementations should not provide this
   */
  showPairingModal?(
    uri: string,
    projectId: string,
    onClose: () => void
  ): Promise<void>

  /**
   * Close the pairing modal (optional, web only)
   */
  closePairingModal?(): void

  /**
   * Show a notification to the user (optional)
   */
  showNotification?(info: NotificationInfo): NotificationHandle

  /**
   * Validate a session (optional, used by React Native for stricter validation)
   * Checks expiry, acknowledged status, and session existence
   */
  validateSession?(
    client: WcClientAdapter,
    session: SessionTypes.Struct
  ): Promise<boolean>

  /**
   * Find a valid session (optional, used by React Native for session discovery)
   * If sessionTopic is provided, validates that specific session
   * Otherwise finds the most recent valid session
   */
  findValidSession?(
    client: WcClientAdapter,
    sessionTopic?: string
  ): Promise<SessionTypes.Struct | null>

  /**
   * Disconnect an invalid session (optional, used during session validation)
   */
  disconnectSession?(
    client: WcClientAdapter,
    topic: string,
    reason: WcDisconnectReason
  ): Promise<void>

  /**
   * Check if deeplink should be opened for this request
   * Browser: checks if mobile and if user was already deeplinked
   * React Native: different logic for newly created sessions
   */
  shouldDeepLink?(params: {
    service: any
    user: any
    isNewlyCreatedSession?: boolean
  }): boolean

  /**
   * Build a deeplink URL with appropriate parameters
   * Browser: simple URL construction
   * React Native: includes topic and redirect params
   */
  buildDeeplinkUrl?(
    appLink: string,
    session: SessionTypes.Struct,
    redirectUri?: string
  ): string
}
