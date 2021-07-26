import {config} from "@onflow/sdk"

config()
  .put("accessNode.api", "http://localhost:8080")
  .put("challenge.handshake", "http://localhost:8700/authenticate")
  .put("discovery.wallet", "http://localhost:8701/fcl/authn")
  .put("discovery.wallet.method", "frame")

export async function configLens(regex) {
  return Object.fromEntries(
    Object.entries(await config().where(regex)).map(([key, value]) => [
      key.replace(regex, ""),
      value,
    ])
  )
}
