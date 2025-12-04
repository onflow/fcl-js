import {Linking} from "react-native"
import {SessionTypes} from "@walletconnect/types"
import {
  PlatformAdapter,
  WcClientAdapter,
  WcDisconnectReason,
} from "../types/adapters"

// Creates a PlatformAdapter for React Native environments.
// This adapter handles deeplinks and session validation using React Native APIs.
export function createRNPlatformAdapter(): PlatformAdapter {
  return {
    async openDeeplink(url: string): Promise<void> {
      await Linking.openURL(url)
    },

    isMobile(): boolean {
      // React Native is always mobile
      return true
    },

    // React Native doesn't use modals, it always uses deep linking
    // showPairingModal is intentionally not implemented because React Native doesn't use modals
    async validateSession(
      client: WcClientAdapter,
      session: SessionTypes.Struct
    ): Promise<boolean> {
      // Check if session is expired
      if (session.expiry && session.expiry <= Date.now() / 1000) {
        return false
      }
      // Check if session is acknowledged
      if (!session.acknowledged) {
        return false
      }

      // Verify session still exists in client
      try {
        const stillExists = client.getSessionByTopic?.(session.topic)
        if (!stillExists) {
          return false
        }
      } catch {
        return false
      }
      return true
    },

    async findValidSession(
      client: WcClientAdapter,
      sessionTopic?: string
    ): Promise<SessionTypes.Struct | null> {
      // If a specific session topic is provided, try to use it
      if (sessionTopic) {
        try {
          const session = client.getSessionByTopic?.(sessionTopic)
          if (session && (await this.validateSession!(client, session))) {
            return session
          }

          // Session is invalid, disconnect it
          if (session) {
            await this.disconnectSession!(client, session.topic, {
              code: 6000,
              message: "Session not responsive",
            })
          }
          return null
        } catch {
          return null
        }
      }

      // Otherwise, find the most recent valid session
      const activeSessions = client.getAllSessions?.() ?? []
      if (activeSessions.length === 0) {
        return null
      }

      const mostRecentSession = activeSessions[activeSessions.length - 1]
      if (await this.validateSession!(client, mostRecentSession)) {
        return mostRecentSession
      } else {
        // Session is invalid, disconnect it
        await this.disconnectSession!(client, mostRecentSession.topic, {
          code: 6000,
          message:
            mostRecentSession.expiry &&
            mostRecentSession.expiry <= Date.now() / 1000
              ? "Session expired"
              : "Session not responsive",
        })
        return null
      }
    },

    async disconnectSession(
      client: WcClientAdapter,
      topic: string,
      reason: WcDisconnectReason
    ): Promise<void> {
      try {
        await client.disconnect?.(topic, reason)
      } catch {
        // Session already disconnected or doesn't exist
      }
    },

    shouldDeepLink(params: {
      service: any
      user: any
      isNewlyCreatedSession?: boolean
    }): boolean {
      const {isNewlyCreatedSession} = params

      // For newly created sessions, the wallet was already opened during connectWc()
      // for session approval. The wallet remains open and can immediately handle
      // the request, so we should NOT open it again.
      if (isNewlyCreatedSession) {
        return false
      }

      // For existing sessions, we need to deeplink to open the wallet
      return true
    },

    buildDeeplinkUrl(
      appLink: string,
      session: SessionTypes.Struct,
      redirectUri?: string
    ): string {
      // Construct deep link with session topic and redirect URI for proper routing
      const params = new URLSearchParams({topic: session.topic})
      if (redirectUri) {
        params.append("redirect", redirectUri)
      }
      return `${appLink}?${params.toString()}`
    },
  }
}

// Validates that a session's network matches the current FCL network configuration.
// Returns true if networks match, false if they differ (requiring reconnection).
export async function validateSessionNetwork(
  session: SessionTypes.Struct,
  currentNetwork: string
): Promise<boolean> {
  try {
    const sessionChain = session.namespaces.flow?.chains?.[0] || ""
    const sessionNetwork = sessionChain.split(":")[1] || ""

    if (sessionNetwork && currentNetwork && sessionNetwork !== currentNetwork) {
      return false
    }

    return true
  } catch {
    // Failed to validate network but continue anyway
    return true
  }
}
