import {UniversalProvider} from "@walletconnect/universal-provider"
import {SessionTypes} from "@walletconnect/types"
import {
  WcClientAdapter,
  WcConnectOpts,
  WcRequestOpts,
  WcDisconnectReason,
} from "../types/adapters"

// Creates a WcClientAdapter that wraps the UniversalProvider for web usage.
// This adapter normalizes the UniversalProvider API to match the WcClientAdapter interface.
export function createUniversalProviderAdapter(
  provider: InstanceType<typeof UniversalProvider>
): WcClientAdapter {
  return {
    async connect(
      opts: WcConnectOpts
    ): Promise<{uri: string; approval: () => Promise<SessionTypes.Struct>}> {
      let cleanup: () => void
      let uriResolved = false

      const uriPromise = new Promise<string>((resolve, reject) => {
        const onDisplayUri = (uri: string) => {
          uriResolved = true
          resolve(uri)
        }
        provider.on("display_uri", onDisplayUri)
        cleanup = () => {
          provider.removeListener("display_uri", onDisplayUri)
          if (!uriResolved) {
            reject(new Error("WalletConnect Session Request aborted"))
          }
        }
      })

      const sessionPromise = provider
        .connect({
          pairingTopic: opts.pairingTopic,
          namespaces: opts.requiredNamespaces,
        })
        .then(session => {
          if (!session) {
            throw new Error("Session request failed")
          }
          return session
        })
        .finally(() => {
          cleanup()
        })

      return {
        uri: await uriPromise,
        approval: () => sessionPromise,
      }
    },

    request(opts: WcRequestOpts): Promise<any> {
      return provider.client.request({
        request: opts.request,
        chainId: opts.chainId,
        topic: opts.topic,
      })
    },

    getSession(): SessionTypes.Struct | null {
      return provider.session ?? null
    },

    on(event: "display_uri", handler: (uri: string) => void): void {
      provider.on(event, handler)
    },

    removeListener(event: "display_uri", handler: (uri: string) => void): void {
      provider.removeListener(event, handler)
    },

    getSessionByTopic(topic: string): SessionTypes.Struct | null {
      try {
        return provider.client.session.get(topic)
      } catch {
        return null
      }
    },

    getAllSessions(): SessionTypes.Struct[] {
      return provider.client.session.getAll()
    },

    async disconnect(topic: string, reason: WcDisconnectReason): Promise<void> {
      try {
        await provider.client.disconnect({topic, reason})
      } catch {
        // Session already disconnected or doesn't exist
      }
    },

    getRedirectUri(): string | undefined {
      return undefined // Web doesn't use redirect URIs in the same way
    },

    getProjectId(): string {
      return provider.providerOpts?.projectId ?? ""
    },
  }
}
