import * as fcl from "@onflow/fcl"

export const ORIGIN = String(process.env.ORIGIN || "http://localhost")
export const PORT = Number(process.env.PORT)
export const PID = String(process.env.PID || `asdf${PORT}`)
export const NAME = String(process.env.NAME || `Wallet Provider ${PID}`)
export const ICON = String(
  process.env.ICON || `https://avatars.onflow/avatar/${PID}.svg`
)
export const HOST = [ORIGIN, PORT].filter(Boolean).join(":")
export const ACCESS_NODE = String(
  process.env.ACCESS_NODE || "http://localhost:8080"
)
export const ROOT_ADDR = String(process.env.ROOT_ADDR || "01")
export const PK = String(
  process.env.PK ||
    "bf9db4706c2fdb9011ee7e170ccac492f05427b96ab41d8bf2d8c58443704b76"
)

fcl.config().put("accessNode.api", ACCESS_NODE)
