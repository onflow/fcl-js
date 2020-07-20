import "../default-config"
import {getAccount} from "@onflow/sdk"
import {Identity} from "@onflow/types"
import {config} from "@onflow/config"
import {spawn, send, INIT, SUBSCRIBE, UNSUBSCRIBE} from "@onflow/util-actor"
import {send as fclSend} from "../send"
import {renderAuthnFrame} from "./render-authn-frame"
import {renderAuthzFrame} from "./render-authz-frame"
import {compositeIdFromProvider} from "./composite-id-from-provider"
import {fetchHook} from "./fetch-hook"
import {pollForAuthzUpdates} from "./poll-for-authz-updates"

const NAME = "CURRENT_USER"
const UPDATED = "CURRENT_USER/UPDATED"
const SNAPSHOT = "SNAPSHOT"
const SET_CURRENT_USER = "SET_CURRENT_USER"
const DEL_CURRENT_USER = "DEL_CURRENT_USER"
const GET_AS_PARAM = "GET_AS_PARAM"

const CHALLENGE_RESPONSE_EVENT = "FCL::CHALLENGE::RESPONSE"

const DATA = `{
  "cid":null,
  "loggedIn":null,
  "verified":null,
  "identity":{
    "name":null,
    "addr":null,
    "avatar":null,
    "cover":null,
    "color":null,
    "bio":null
  },
  "scoped":{},
  "provider":{
    "addr":null,
    "pid":null,
    "name":null,
    "icon":null
  },
  "authorizations":[]
}`

const HANDLERS = {
  [INIT]: ctx => {
    ctx.merge(JSON.parse(DATA))
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
    ctx.broadcast(UPDATED, ctx.all())
  },
  [DEL_CURRENT_USER]: async (ctx, letter) => {
    ctx.merge(JSON.parse(DATA))
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

    const unrender = renderAuthnFrame({
      handshake: await config().get("challenge.handshake"),
      scope: await config().get("challenge.scope"),
      nonce: "asdf",
      l6n: window.location.origin,
    })

    window.addEventListener("message", async ({data, origin}) => {
      if (data.type !== CHALLENGE_RESPONSE_EVENT) return
      unrender()
      const url = new URL(data.hks)
      url.searchParams.append("code", data.code)

      const user = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).then(d => d.json())

      send(NAME, SET_CURRENT_USER, {
        ...user,
        cid: compositeIdFromProvider(user.provider),
        loggedIn: true,
        verified: true,
      })
      resolve(await snapshot())
    })
  })
}

function unauthenticate() {
  spawnCurrentUser()
  send(NAME, DEL_CURRENT_USER)
}

async function authorization(account) {
  spawnCurrentUser()
  await authenticate()

  const user = await snapshot()
  let sequenceNum
  if (account.role.proposer) {
    const acct = await info()
    // TODO: There will be an update to the getAccount that will
    //       make the key consitent ie: { keyId, sequenceNum, publicKey }
    //       instead of the current equivalent { index, sequenceNumber }
    const key = acct.keys.find(key => key.index === user.keyId)
    sequenceNum = key.sequenceNumber
  }

  const signingFunction = async message => {
    const user = await snapshot()
    const acct = await info()
    const resp = await fetchHook(user.authorizations[0], message)

    let unrender = () => {}
    if (resp.local && resp.local.length > 0) {
      console.log("RENDER LOCAL")
      unrender = renderAuthzFrame(resp.local[0])
    }

    const result = await pollForAuthzUpdates(resp.authorizationUpdates)
    unrender()
    return result
  }

  return {
    ...account,
    addr: user.addr,
    keyId: user.keyId,
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
