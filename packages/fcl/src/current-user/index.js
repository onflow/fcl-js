import "../default-config"
import {account} from "@onflow/sdk-account"
import {config} from "@onflow/config"
import {spawn, send, INIT, SUBSCRIBE, UNSUBSCRIBE} from "@onflow/util-actor"
import {renderAuthnFrame} from "./render-authn-frame"
import {buildUser} from "./build-user"
import {fetchServices} from "./fetch-services"
import {mergeServices} from "./merge-services"
import {serviceOfType} from "./service-of-type"
import {execAuthzService} from "./exec-authz-service"
import {validateCompositeSignature} from "./validate-composite-signature"

const NAME = "CURRENT_USER"
const UPDATED = "CURRENT_USER/UPDATED"
const SNAPSHOT = "SNAPSHOT"
const SET_CURRENT_USER = "SET_CURRENT_USER"
const DEL_CURRENT_USER = "DEL_CURRENT_USER"

const CHALLENGE_RESPONSE_EVENT = "FCL::CHALLENGE::RESPONSE"
const CHALLENGE_CANCEL_EVENT = "FCL::CHALLENGE::CANCEL"

const DATA = `{
  "VERSION": "0.2.0",
  "addr":null,
  "cid":null,
  "loggedIn":null,
  "services":[]
}`

const coldStorage = {
  get: async () => {
    const fallback = JSON.parse(DATA)
    const stored = JSON.parse(sessionStorage.getItem(NAME))
    if (stored != null && fallback.VERSION !== stored.VERSION) {
      sessionStorage.removeItem(NAME)
      return fallback
    }
    return stored || fallback
  },
  put: async (data) => {
    sessionStorage.setItem(NAME, JSON.stringify(data))
    return data
  },
}

const canColdStorage = () => {
  return config().get("persistSession", true)
}

const HANDLERS = {
  [INIT]: async (ctx) => {
    ctx.merge(JSON.parse(DATA))
    if (await canColdStorage()) ctx.merge(await coldStorage.get())
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

const identity = (v) => v
const spawnCurrentUser = () => spawn(HANDLERS, NAME)

async function authenticate() {
  return new Promise(async (resolve) => {
    spawnCurrentUser()
    const user = await snapshot()
    if (user.loggedIn) return resolve(user)

    const [$frame, unrender] = renderAuthnFrame({
      handshake: await config().get("challenge.handshake"),
      l6n: window.location.origin,
    })

    const replyFn = async ({data}) => {
      if (data.type === CHALLENGE_CANCEL_EVENT) {
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

async function authorization(account) {
  spawnCurrentUser()
  const user = await authenticate()
  const authz = serviceOfType(user.services, "authz")

  let sequenceNum
  if (account.role.proposer) {
    const acct = await info()
    const key = acct.keys.find((key) => key.index === authz.keyId)
    sequenceNum = key.sequenceNumber
  }

  const signingFunction = async (signable) => execAuthzService(authz, signable)

  return {
    ...account,
    addr: authz.addr,
    keyId: authz.keyId,
    sequenceNum,
    signature: account.signature || null,
    signingFunction,
    resolve: null,
    roles: account.roles,
  }
}

function subscribe(callback) {
  spawnCurrentUser()
  const EXIT = "@EXIT"
  const self = spawn(async (ctx) => {
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
