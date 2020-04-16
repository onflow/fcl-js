export const ORIGIN = String(process.env.ORIGIN || "http://localhost")
export const PORT = Number(process.env.PORT)
export const PID = String(process.env.PID || `asdf${PORT}`)
export const NAME = String(process.env.NAME || `Wallet Provider ${PID}`)
export const ICON = String(
  process.env.ICON || `https://avatars.onflow/avatar/${PID}.svg`
)
export const HOST = [ORIGIN, PORT].filter(Boolean).join(":")
export const SECRET = String(process.env.SECRET || "SECRET")
