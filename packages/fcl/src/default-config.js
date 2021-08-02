import {config} from "@onflow/sdk"

config()
  .put("accessNode.api", "http://localhost:8080")
  .put("discovery.wallet", "http://localhost:8701/fcl/authn")
  .put("discovery.wallet.method", "IFRAME/RPC")

export async function configLens(regex) {
  return Object.fromEntries(
    Object.entries(await config().where(regex)).map(([key, value]) => [
      key.replace(regex, ""),
      value,
    ])
  )
}
