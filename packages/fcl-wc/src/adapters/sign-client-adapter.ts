import {SessionTypes} from "@walletconnect/types"
import type {SignClient} from "@walletconnect/sign-client"
import type {
  WcClientAdapter,
  WcConnectOpts,
  WcRequestOpts,
  WcDisconnectReason,
} from "../types/adapters"

type SignClientInstance = InstanceType<typeof SignClient>

/**
 * Creates a WcClientAdapter that wraps the SignClient for React Native usage.
 * This adapter normalizes the SignClient API to match the WcClientAdapter interface.
 */
export function createSignClientAdapter(
  client: SignClientInstance,
  projectId: string
): WcClientAdapter {
  return {
    async connect(
      opts: WcConnectOpts
    ): Promise<{uri: string; approval: () => Promise<SessionTypes.Struct>}> {
      // SignClient.connect() returns the uri directly, no need for display_uri listener
      const {uri: connectionUri, approval} = await client.connect({
        pairingTopic: opts.pairingTopic,
        requiredNamespaces: opts.requiredNamespaces,
        optionalNamespaces: opts.optionalNamespaces,
      })

      return {
        uri: connectionUri!,
        approval: () => approval(),
      }
    },

    request(opts: WcRequestOpts): Promise<any> {
      return client.request({
        topic: opts.topic,
        chainId: opts.chainId,
        request: opts.request,
      })
    },

    getSession(): SessionTypes.Struct | null {
      // React Native uses explicit session finding via findValidSession
      // Return null here as we don't track a "current" session like UniversalProvider
      return null
    },

    // SignClient events are on core.pairing.events, but we don't need display_uri
    // since client.connect() returns the URI directly
    on(_event: "display_uri", _handler: (uri: string) => void): void {
      // No-op for SignClient - URI comes from connect() return value
    },

    removeListener(_event: "display_uri", _handler: (uri: string) => void): void {
      // No-op for SignClient
    },

    getSessionByTopic(topic: string): SessionTypes.Struct | null {
      try {
        return client.session.get(topic)
      } catch {
        return null
      }
    },

    getAllSessions(): SessionTypes.Struct[] {
      return client.session.getAll()
    },

    async disconnect(topic: string, reason: WcDisconnectReason): Promise<void> {
      try {
        await client.disconnect({topic, reason})
      } catch {
        // Session already disconnected or doesn't exist
      }
    },

    getRedirectUri(): string | undefined {
      return (
        (client.metadata as any)?.redirect?.native ||
        (client.metadata as any)?.redirect?.universal
      )
    },

    getProjectId(): string {
      return projectId
    },
  }
}
