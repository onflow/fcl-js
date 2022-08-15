import {config} from "@onflow/config"

export async function getDiscoveryService() {
  const discoveryWallet = await config.first([
    "discovery.wallet",
    "challenge.handshake",
  ])

  const discoveryAuthnInclude = await config.get("discovery.authn.include", [])

  const discoveryWalletMethod = await config.first([
    "discovery.wallet.method",
    "discovery.wallet.method.default",
  ])

  return {
    type: "authn",
    endpoint: discoveryWallet,
    method: discoveryWalletMethod,
    discoveryAuthnInclude,
  }
}
