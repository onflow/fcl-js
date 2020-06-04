import {flowConfig} from "@onflow/fcl-config"
import * as fcl from "@onflow/fcl"

const get = (scope, path, fallback) => {
  if (typeof path === "string") return get(scope, path.split("/"), fallback)
  if (!path.length) return scope
  try {
    const [head, ...rest] = path
    return get(scope[head], rest, fallback)
  } catch (_error) {
    return fallback
  }
}

export const PK = String(
  process.env.PK ||
    get(
      flowConfig(),
      "accounts/service/privateKey",
      "bf9db4706c2fdb9011ee7e170ccac492f05427b96ab41d8bf2d8c58443704b76"
    )
)

export const SERVICE_ADDR = String(
  process.env.SERVICE_ADDR ||
    get(flowConfig(), "accounts/service/address", "01")
)

export const PORT = Number(
  process.env.PORT || get(flowConfig(), "devWallet/port", 8701)
)

export const ACCESS_NODE = String(
  process.env.ACCESS_NODE ||
    get(flowConfig(), "devWallet/accessNode/endpoint", "http://localhost:8080")
)

export const PID = String(process.env.PID || `asdf${PORT}`)

export const ICON = String(
  process.env.ICON || `https://avatars.onflow/avatar/${PID}.svg`
)

export const ORIGIN = "http://localhost"
export const HOST = [ORIGIN, PORT].filter(Boolean).join(":")

export const AUTHN = `${HOST}/flow/authenticate`
export const NAME = `FCL Dev Wallet`

fcl.config().put("accessNode.api", ACCESS_NODE)
