import "../default-config"
export {getAccount} from "@onflow/sdk-build-get-account"
import {Identity} from "@onflow/types"
import {config} from "@onflow/config"
import {spawn, send, INIT, SUBSCRIBE, UNSUBSCRIBE} from "@onflow/util-actor"
import {send as fclSend} from "../send"
import {renderAuthnFrame} from "./render-authn-frame"
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
const GET_AS_PARAM = "GET_AS_PARAM"

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
    const stored = JSON.parse(localStorage.getItem(NAME))
    if (stored != null && fallback.VERSION !== stored.VERSION) {
      localStorage.removeItem(NAME)
      return fallback
    }
    return stored || fallback
  },
  put: async data => {
    localStorage.setItem(NAME, JSON.stringify(data))
    return data
  },
}

const HANDLERS = {
  [INIT]: async ctx => {
    ctx.merge(await coldStorage.get())
  },
  [SUBSCRIBE]: (ctx, letter) => {
    ctx.subscribe(letter.from)
    ctx.send(letter.from, UPDATED, ctx.all())
  },
  [UNSUBSCRIBE]: (ctx, letter) => {
    ctx.unsubscribe(letter.from)
  },
  [SNAPSHOT]: async (ctx, letter) => {
    letter.reply(ctx.all())
  },
  [SET_CURRENT_USER]: async (ctx, letter, data) => {
    ctx.merge(data)
    coldStorage.put(ctx.all())
    ctx.broadcast(UPDATED, ctx.all())
  },
  [DEL_CURRENT_USER]: async (ctx, letter) => {
    ctx.merge(JSON.parse(DATA))
    coldStorage.put(ctx.all())
    ctx.broadcast(UPDATED, ctx.all())
  },
  [GET_AS_PARAM]: async (ctx, letter, {key}) => {
    letter.reply({key, value: ctx.get("addr", null), xform: Identity})
  },
}

const identity = v => v
const spawnCurrentUser = () => spawn(HANDLERS, NAME)

async function authenticate() {
  return new Promise(async resolve => {
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

      const msg = {
        addr: data.addr,
        cid: `did:fcl:${data.addr}`,
        loggedIn: true,
        services: mergeServices(
          data.services || [],
          await fetchServices(data.hks, data.code)
        ),
      }

      send(NAME, SET_CURRENT_USER, msg)
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
    const key = acct.keys.find(key => key.index === authz.keyId)
    sequenceNum = key.sequenceNumber
  }

  const signingFunction = async signable => execAuthzService(authz, signable)

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

function param(key) {
  return async function innerParam() {
    spawnCurrentUser()
    await authenticate()
    return send(NAME, GET_AS_PARAM, {key}, {expectReply: true, timeout: 10})
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
  const {account} = await fclSend([getAccount(addr)])
  return account
}

export const currentUser = () => {
  return {
    authenticate,
    unauthenticate,
    authorization,
    param,
    subscribe,
    snapshot,
  }
}
