import "../default-config"
import {account, config} from "@onflow/sdk"
import {spawn, send, INIT, SUBSCRIBE, UNSUBSCRIBE} from "@onflow/util-actor"
import {sansPrefix} from "@onflow/util-address"
import {invariant} from "@onflow/util-invariant"
import {buildUser} from "./build-user"
import {serviceOfType} from "./service-of-type"
import {execService} from "./exec-service"
import {verifyUserSignatures as verify} from "../exec/verify"
import {normalizeCompositeSignature} from "./normalize/composite-signature"

const NAME = "CURRENT_USER"
const UPDATED = "CURRENT_USER/UPDATED"
const SNAPSHOT = "SNAPSHOT"
const SET_CURRENT_USER = "SET_CURRENT_USER"
const DEL_CURRENT_USER = "DEL_CURRENT_USER"

const DATA = `{
  "f_type": "User",
  "f_vsn": "1.0.0",
  "addr":null,
  "cid":null,
  "loggedIn":null,
  "expiresAt":null,
  "services":[]
}`

const coldStorage = {
  get: async () => {
    const fallback = JSON.parse(DATA)
    const stored = JSON.parse(sessionStorage.getItem(NAME))
    if (stored != null && fallback["f_vsn"] !== stored["f_vsn"]) {
      sessionStorage.removeItem(NAME)
      return fallback
    }
    return stored || fallback
  },
  put: async data => {
    sessionStorage.setItem(NAME, JSON.stringify(data))
    return data
  },
}

const canColdStorage = () => {
  return config().get("persistSession", true)
}

const HANDLERS = {
  [INIT]: async ctx => {
    ctx.merge(JSON.parse(DATA))
    if (await canColdStorage()) {
      const user = await coldStorage.get()
      if (notExpired(user)) ctx.merge(user)
    }
  },
  [SUBSCRIBE]: (ctx, letter) => {
    ctx.subscribe(letter.from)
    ctx.send(letter.from, UPDATED, {...ctx.all()})
  },
  [UNSUBSCRIBE]: (ctx, letter) => {
    ctx.unsubscribe(letter.from)
  },
  [SNAPSHOT]: async (ctx, letter) => {
    letter.reply({...ctx.all()})
  },
  [SET_CURRENT_USER]: async (ctx, letter, data) => {
    ctx.merge(data)
    if (await canColdStorage()) coldStorage.put(ctx.all())
    ctx.broadcast(UPDATED, {...ctx.all()})
  },
  [DEL_CURRENT_USER]: async (ctx, letter) => {
    ctx.merge(JSON.parse(DATA))
    if (await canColdStorage()) coldStorage.put(ctx.all())
    ctx.broadcast(UPDATED, {...ctx.all()})
  },
}

const identity = v => v
const spawnCurrentUser = () => spawn(HANDLERS, NAME)

function notExpired(user) {
  return (
    user.expiresAt == null ||
    user.expiresAt === 0 ||
    user.expiresAt > Date.now()
  )
}

async function authenticate() {
  return new Promise(async (resolve, reject) => {
    spawnCurrentUser()
    const user = await snapshot()
    if (user.loggedIn && notExpired(user)) return resolve(user)

    const discoveryWallet = await config.first([
      "discovery.wallet",
      "challenge.handshake",
    ])

    const method = await config.first(["discovery.wallet.method"], "IFRAME/RPC")

    try {
      const response = await execService({
        service: {
          endpoint: discoveryWallet,
          method: method,
        },
      })
      send(NAME, SET_CURRENT_USER, await buildUser(response))
    } catch (e) {
      console.error("Error while authenticating", e)
    } finally {
      resolve(await snapshot())
    }
  })
}

function unauthenticate() {
  spawnCurrentUser()
  send(NAME, DEL_CURRENT_USER)
}

const normalizePreAuthzResponse = authz => ({
  f_type: "PreAuthzResponse",
  f_vsn: "1.0.0",
  proposer: (authz || {}).proposer,
  payer: (authz || {}).payer || [],
  authorization: (authz || {}).authorization || [],
})

function resolvePreAuthz(authz) {
  const resp = normalizePreAuthzResponse(authz)
  const axs = []

  if (resp.proposer != null) axs.push(["PROPOSER", resp.proposer])
  for (let az of resp.payer || []) axs.push(["PAYER", az])
  for (let az of resp.authorization || []) axs.push(["AUTHORIZER", az])

  var result = axs.map(([role, az]) => ({
    tempId: [az.identity.address, az.identity.keyId].join("|"),
    addr: az.identity.address,
    keyId: az.identity.keyId,
    signingFunction(signable) {
      return execService({service: az, msg: signable})
    },
    role: {
      proposer: role === "PROPOSER",
      payer: role === "PAYER",
      authorizer: role === "AUTHORIZER",
    },
  }))
  return result
}

async function authorization(account) {
  spawnCurrentUser()
  const user = await authenticate()
  const authz = serviceOfType(user.services, "authz")

  const preAuthz = serviceOfType(user.services, "pre-authz")
  if (preAuthz) {
    return {
      ...account,
      tempId: "CURRENT_USER",
      async resolve(account, preSignable) {
        return resolvePreAuthz(
          await execService({service: preAuthz, msg: preSignable})
        )
      },
    }
  }

  return {
    ...account,
    tempId: "CURRENT_USER",
    resolve: null,
    addr: sansPrefix(authz.identity.address),
    keyId: authz.identity.keyId,
    sequenceNum: null,
    signature: null,
    async signingFunction(signable) {
      return normalizeCompositeSignature(
        await execService({
          service: authz,
          msg: signable,
          opts: {
            includeOlderJsonRpcCall: true,
          },
        })
      )
    },
  }
}

function subscribe(callback) {
  spawnCurrentUser()
  const EXIT = "@EXIT"
  const self = spawn(async ctx => {
    ctx.send(NAME, SUBSCRIBE)
    while (1) {
      const letter = await ctx.receive()
      if (letter.tag === EXIT) {
        ctx.send(NAME, UNSUBSCRIBE)
        return
      }
      callback(letter.data)
    }
  })
  return () => send(self, EXIT)
}

function snapshot() {
  spawnCurrentUser()
  return send(NAME, SNAPSHOT, null, {expectReply: true, timeout: 0})
}

async function info() {
  spawnCurrentUser()
  const {addr} = await snapshot()
  if (addr == null) throw new Error("No Flow Address for Current User")
  return account(addr)
}

const makeSignable = msg => {
  invariant(/^[0-9a-f]+$/i.test(msg), "Message must be a hex string")

  return {
    message: msg,
  }
}

async function signUserMessage(msg) {
  spawnCurrentUser()
  const user = await authenticate()
  const signingService = serviceOfType(user.services, "user-signature")

  invariant(
    signingService,
    "Current user must have authorized a signing service."
  )

  try {
    const response = await execService({
      service: signingService,
      msg: makeSignable(msg),
    })
    if (Array.isArray(response)) {
      return response.map(compSigs => normalizeCompositeSignature(compSigs))
    } else {
      return [normalizeCompositeSignature(response)]
    }
  } catch (error) {
    return error
  }
}

// Deprecated
async function verifyUserSignatures(msg, compSigs) {
  console.warn(
    `
    %cFCL/SDK Deprecation Notice
    ============================
    verifyUserSignatures is no longer exported as fcl.currentUser().verifyUserSignatures
    and is now available as fcl.verifyUserSignatures
    ============================
    `,
    "font-weight:bold;font-family:monospace;"
  )
  return verify(msg, compSigs)
}

export const currentUser = () => {
  return {
    authenticate,
    unauthenticate,
    authorization,
    signUserMessage,
    verifyUserSignatures,
    subscribe,
    snapshot,
  }
}
