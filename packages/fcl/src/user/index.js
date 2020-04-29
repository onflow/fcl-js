import "../default-config"
import {spawn, send} from "../actor"
import {genUser} from "./__factories__/gen-user"
import {send as fclSend} from "../send"
import * as sdk from "@onflow/sdk"

const SUBSCRIBE = "SUBSCRIBE"
const UNSUBSCRIBE = "UNSUBSCRIBE"
const UPDATED = "USER/UPDATED"
const SNAPSHOT = "SNAPSHOT"
const FETCH_USER = "FETCH_USER"

const snapshot = (ctx, keys) => {
  return keys.reduce((acc, key) => ({...acc, [key]: ctx.get(key)}), {})
}

const HANDLERS = {
  [SUBSCRIBE]: (ctx, letter) => {
    ctx.subscribe(letter.from)
    ctx.send(letter.from, UPDATED, snapshot(ctx, ctx.keys()))
  },
  [UNSUBSCRIBE]: (ctx, letter) => {
    ctx.unsubscribe(letter.from)
  },
  [SNAPSHOT]: async (ctx, letter) => {
    letter.reply(snapshot(ctx, ctx.keys()))
  },
}

const saveUser = (ctx, user) => {
  for (let key of Object.keys(user)) ctx.put(key, user[key])
}

const userLogic = async ctx => {
  saveUser(ctx, await genUser(ctx.self()))

  __loop: while (1) {
    const letter = await ctx.receive()

    try {
      await HANDLERS[letter.tag](ctx, letter)
    } catch (error) {
      console.error("User Error", letter, error)
    } finally {
      continue __loop
    }
  }
}

const identity = v => v

const spawnUser = addr => spawn(userLogic, addr)

export const user = addr => ({
  async authorization() {
    spawnUser(addr)

    const signFn = async () => {
      // TODO: async decomp via hooks
      // TODO: async remote signing
      throw new Error(
        `fcl.user(${addr}).payerAuthorization WIP error -- known missing functionality`
      )
    }
    return {addr, signFn}
  },

  async payerAuthorization() {
    spawnUser(addr)

    const signFn = async () => {
      // TODO: async decomp via hooks
      // TODO: async remote signing
      throw new Error(
        `fcl.user(${addr}).payerAuthorization WIP error -- known missing functionality`
      )
    }
    return {addr, signFn}
  },

  async snapshot() {
    spawnUser(addr)
    return send(addr, SNAPSHOT, null, {expectReply: true, timeout: 0})
  },

  param(key) {
    return {
      value: addr,
      xform: {
        asParam: v => v,
        asInjection: v => v,
      },
    }
  },

  subscribe(callback) {
    spawnUser(addr)
    const EXIT = "@EXIT"
    const self = spawn(async ctx => {
      ctx.send(addr, SUBSCRIBE)
      while (1) {
        const letter = await ctx.receive()
        if (letter.tag === EXIT) {
          ctx.send(addr, UNSUBSCRIBE)
          return
        }
        callback(letter.data)
      }
    })
    return () => send(self, EXIT)
  },

  async info() {
    const {account} = await fclSend([sdk.getAccount(addr)])
    return account
  },
})
