import {v4 as uuid} from "uuid"

const SEC = 1000
const MIN = 60 * SEC
const HOUR = 60 * MIN
const DAY = 24 * HOUR
const WEEK = 7 * DAY

const HANDSHAKES = {}

const invariant = (fact, msg, ...rest) => {
  if (!fact) {
    const error = new Error(`INVARIANT ${msg}`)
    error.stack = error.stack
      .split("\n")
      .filter((d) => !/at invariant/.test(d))
      .join("\n")
    console.error("\n\n---\n\n", error, "\n\n", ...rest, "\n\n---\n\n")
    throw error
  }
}

export const createHandshake = (opts = {}) => {
  invariant(
    opts.userId,
    "createHandshake({ userId }) -- userId is required",
    opts
  )
  invariant(opts.l6n, "createHandshake({ l6n }) -- l6n is required", opts)
  opts.scope = opts.scope || null

  const handshakeId = uuid()
  HANDSHAKES[handshakeId] = {
    ...opts,
    handshakeId,
    exp: Date.now() + WEEK,
  }
  // console.log(`createHandshake(opts) -> ${handshakeId}`, HANDSHAKES)
  return handshakeId
}

export const handshakeFor = (handshakeId) => {
  invariant(handshakeId, `handshakeFor(handshakeId) -- handshakeId is required`)
  // console.log(
  //   `handshakeFor(${handshakeId}) -> ___`,
  //   HANDSHAKES[handshakeId],
  //   HANDSHAKES
  // )
  return HANDSHAKES[handshakeId]
}
