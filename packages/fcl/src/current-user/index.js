import "../default-config"
import {config} from "../config"
import {spawn, send} from "../actor"
import {send as fclSend} from "../send"
import * as sdk from "@onflow/sdk"
import * as t from "@onflow/types"

const NAME = "CURRENT_USER"
const SUBSCRIBE = "SUBSCRIBE"
const UNSUBSCRIBE = "UNSUBSCRIBE"
const UPDATED = "CURRENT_USER/UPDATED"
const SNAPSHOT = "SNAPSHOT"
const SET_CURRENT_USER = "SET_CURRENT_USER"
const DEL_CURRENT_USER = "DEL_CURRENT_USER"
const GET_AS_PARAM = "GET_AS_PARAM"

const FRAME_ID = "FCL_IFRAME_CHALLENGE"
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

const dataSnapshot = (ctx, keys) => {
  return Object.fromEntries(keys.map(key => [key, ctx.get(key)]))
}

const saveData = (ctx, user) => {
  Object.entries(user).forEach(([key, value]) => ctx.put(key, value))
}

const HANDLERS = {
  [SUBSCRIBE]: (ctx, letter) => {
    ctx.subscribe(letter.from)
    ctx.send(letter.from, UPDATED, dataSnapshot(ctx, ctx.keys()))
  },
  [UNSUBSCRIBE]: (ctx, letter) => {
    ctx.unsubscribe(letter.from)
  },
  [SNAPSHOT]: async (ctx, letter) => {
    letter.reply(dataSnapshot(ctx, ctx.keys()))
  },
  [SET_CURRENT_USER]: async (ctx, letter, data) => {
    saveData(ctx, data)
    ctx.broadcast(UPDATED, dataSnapshot(ctx, ctx.keys()))
  },
  [DEL_CURRENT_USER]: async (ctx, letter) => {
    saveData(ctx, JSON.parse(DATA))
    ctx.broadcast(UPDATED, dataSnapshot(ctx, ctx.keys()))
  },
  [GET_AS_PARAM]: async (ctx, letter, {key}) => {
    letter.reply({key, value: ctx.get("addr", null), xform: t.Identity})
  },
}

const currentUserLogic = async ctx => {
  saveData(ctx, JSON.parse(DATA))

  __loop: while (1) {
    const letter = await ctx.receive()

    try {
      await HANDLERS[letter.tag](ctx, letter, letter.data || {})
    } catch (error) {
      console.error("Current User Error", letter, error)
    } finally {
      continue __loop
    }
  }
}

const identity = v => v
const spawnCurrentUser = () => spawn(currentUserLogic, NAME)

function renderFrame({handshake, scope, nonce, l6n}) {
  if (document.getElementById(FRAME_ID)) return

  const src = [
    handshake,
    [
      `l6n=${encodeURIComponent(l6n)}`,
      `nonce=${encodeURIComponent(nonce)}`,
      scope && `scope=${scope.split(" ").join("+")}`,
    ]
      .filter(Boolean)
      .join("&"),
  ].join("?")

  const $frame = document.createElement("iframe")
  $frame.src = src
  $frame.id = FRAME_ID
  $frame.style.height = "500px"
  $frame.style.maxHeight = "90vh"
  $frame.style.width = "400px"
  $frame.style.maxWidth = "90vw"
  $frame.style.display = "block"
  $frame.style.background = "#fff"
  $frame.style.position = "fixed"
  $frame.style.top = "5vh"
  $frame.style.right = "calc(50vw)"
  $frame.style.transform = "translateX(50%)"
  $frame.style.boxShadow = "0 4px 8px -4px black"
  $frame.frameBorder = "0"
  document.body.append($frame)
}

const compositeId = data => {
  const addr = ((data || {}).provider || {}).addr
  const pid = ((data || {}).provider || {}).pid
  if (addr == null || pid == null) return null
  return `${addr}/${pid}`
}

async function authenticate() {
  return new Promise(async resolve => {
    spawnCurrentUser()

    const user = await snapshot()
    if (user.loggedIn) return resolve(user)

    const handshake = await config().get("challenge.handshake")
    const scope = await config().get("challenge.scope")
    const nonce = "asdf"
    const l6n = window.location.origin

    renderFrame({handshake, scope, nonce, l6n})

    window.addEventListener("message", async ({data, origin}) => {
      if (data.type !== CHALLENGE_RESPONSE_EVENT) return
      if (document.getElementById(FRAME_ID)) {
        document.getElementById(FRAME_ID).remove()
      }

      const user = await fetch(`${data.hks}?code=${data.code}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).then(d => d.json())

      send(NAME, SET_CURRENT_USER, {
        ...user,
        cid: compositeId(user),
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

  return {
    ...account,
    addr: user.addr,
    keyId: user.keyId,
    sequenceNum,
    signature: account.signature || null,
    signingFunction: async message => {
      const user = await snapshot()
      console.group("%cAuthorization", "color:purple;font-family:monospace;")
      console.log(
        "%cThis is currently a Work In Progress and coming soon",
        "color:tomato;font-family:monospace;"
      )
      console.log(
        "%cAuthorization Hooks",
        "color:blue;font-family:monospace;",
        user.authorizations
      )
      console.log("%cMessage", "color:blue;font-family:monospace;", message)
      console.groupEnd()
      return {
        addr: user.addr,
        keyId: user.keyId,
        signature: "NOT_AN_ACTUAL_SIGNATURE_YET",
      }
    },
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
  const {account} = await fclSend([sdk.getAccount(addr)])
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
