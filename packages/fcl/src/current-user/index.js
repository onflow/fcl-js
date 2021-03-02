import "../default-config"
import {account} from "@onflow/sdk"
import {config} from "@onflow/config"
import {spawn, send, INIT, SUBSCRIBE, UNSUBSCRIBE} from "@onflow/util-actor"
import {sansPrefix} from "@onflow/util-address"
import {buildUser} from "./build-user"
import {serviceOfType} from "./service-of-type"
import {execService} from "./exec-service"
import {frame} from "./exec-service/strategies/utils/frame"

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

    frame(
      {
        endpoint:
          (await config().get("discovery.wallet")) ||
          (await config().get("challenge.handshake")),
      },
      {
        onReady(e, {send, close}) {
          console.log("ON READY", e)
          // SEND CONFIG AND APP DESCRIPTION/NEEDS TO WALLET AUTHN
          // YET TO BE DEFINED
        },
        async onClose() {
          resolve(await snapshot())
        },
        async onResponse(e, {close}) {
          send(NAME, SET_CURRENT_USER, await buildUser(e.data))
          resolve(await snapshot())
          close()
        },
      }
    )
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
      return execService(az, signable)
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
        return resolvePreAuthz(await execService(preAuthz, preSignable))
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
      return execService(authz, signable)
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

export const currentUser = () => {
  return {
    authenticate,
    unauthenticate,
    authorization,
    subscribe,
    snapshot,
  }
}
