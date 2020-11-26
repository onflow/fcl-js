import "../default-config"
import {account} from "@onflow/sdk-account"
import {config} from "@onflow/config"
import {spawn, send, INIT, SUBSCRIBE, UNSUBSCRIBE} from "@onflow/util-actor"
import {sansPrefix} from "@onflow/util-address"
import {account as fetchAccount} from "@onflow/sdk-account"
import {renderAuthnFrame} from "./render-authn-frame"
import {buildUser} from "./build-user"
import {fetchServices} from "./fetch-services"
import {mergeServices} from "./merge-services"
import {serviceOfType} from "./service-of-type"
import {validateCompositeSignature} from "./validate-composite-signature"
import {execService} from "./exec-service"

const NAME = "CURRENT_USER"
const UPDATED = "CURRENT_USER/UPDATED"
const SNAPSHOT = "SNAPSHOT"
const SET_CURRENT_USER = "SET_CURRENT_USER"
const DEL_CURRENT_USER = "DEL_CURRENT_USER"

// Backwards Compatibility
const CANCEL_EVENT = "FCL::CANCEL"
const CHALLENGE_RESPONSE_EVENT = "FCL::CHALLENGE::RESPONSE"
const CHALLENGE_CANCEL_EVENT = "FCL::CHALLENGE::CANCEL"

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
  return new Promise(async resolve => {
    spawnCurrentUser()
    const user = await snapshot()
    if (user.loggedIn && notExpired(user)) return resolve(user)

    const [$frame, unrender] = renderAuthnFrame({
      handshake: await config().get("challenge.handshake"),
      l6n: window.location.origin,
    })

    const replyFn = async ({data}) => {
      if (data.type === CHALLENGE_CANCEL_EVENT || data.type === CANCEL_EVENT) {
        unrender()
        window.removeEventListener("message", replyFn)
        return
      }
      if (data.type !== CHALLENGE_RESPONSE_EVENT) return

      unrender()
      window.removeEventListener("message", replyFn)

      send(NAME, SET_CURRENT_USER, await buildUser(data))
      resolve(await snapshot())
    }

    window.addEventListener("message", replyFn)
  })
}

function unauthenticate() {
  spawnCurrentUser()
  send(NAME, DEL_CURRENT_USER)
}

const mmmh = authz => ({
  f_type: "PreAuthzResponse",
  f_vsn: "1.0.0",
  proposer: authz,
  payer: [authz],
  authorization: [authz],
})

function rawr(authz) {
  const resp = mmmh(authz)
  const axs = []

  if (resp.proposer != null) axs.push(["PROPOSER", resp.proposer])
  for (let az of resp.payer || []) axs.push(["PAYER", az])
  for (let az of resp.authorization || []) axs.push(["AUTHORIZER", az])

  return axs.map(([role, az]) => ({
    tempId: [az.identity.address, az.identity.keyId].join("|"),
    addr: az.identity.address,
    keyId: az.identity.keyId,
    signingFunction(signable) {
      return execService(authz, signable)
    },
    role: {
      proposer: role === "PROPOSER",
      payer: role === "PAYER",
      authorizer: role === "AUTHORIZER",
    },
  }))
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
        return rawr(await execService(preAuthz, preSignable))
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
