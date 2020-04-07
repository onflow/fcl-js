import {spawn, send} from "../actor"

const NAME = "config"
const PUT = "PUT_CONFIG"
const GET = "GET_CONFIG"
const UPDATE = "UPDATE_CONFIG"
const DELETE = "DELETE_CONFIG"
const WHERE = "WHERE_CONFIG"
const SUBSCRIBE = "SUBSCRIBE"
const UNSUBSCRIBE = "UNSUBSCRIBE"
const UPDATED = "CONFIG/UPDATED"

spawn(async ctx => {
  const snapshot = keys =>
    keys.reduce((acc, key) => ({...acc, [key]: ctx.get(key)}), {})

  __loop: while (1) {
    const letter = await ctx.receive()
    const data = letter.data

    try {
      switch (letter.tag) {
        case PUT:
          if (data.key != null) {
            ctx.put(data.key, data.value)
            ctx.broadcast(UPDATED, snapshot(ctx.keys()))
          }
          continue __loop

        case GET:
          if (data.key != null) {
            letter.reply(ctx.get(data.key, data.fallback))
          }
          continue __loop

        case UPDATE:
          if (data.key != null) {
            ctx.update(data.key, data.fn)
            ctx.broadcast(UPDATED, snapshot(ctx.keys()))
          }
          continue __loop

        case DELETE:
          if (data.key != null) {
            ctx.delete(data.key)
            ctx.broadcast(UPDATED, snapshot(ctx.keys()))
          }
          continue __loop

        case WHERE:
          if (data.pattern != null) {
            letter.reply(snapshot(ctx.keys().filter(d => data.pattern.test(d))))
          }
          continue __loop

        case SUBSCRIBE:
          ctx.subscribe(letter.from)
          ctx.send(letter.from, UPDATED, snapshot(ctx.keys()))
          continue __loop

        case UNSUBSCRIBE:
          ctx.unsubscribe(letter.from)
          continue __loop

        default:
          continue __loop
      }
    } catch (error) {
      console.error("Config Error", letter, error)
      continue __loop
    }
  }
}, NAME)

const identity = v => v

export const config = () => ({
  put(key, value) {
    send(NAME, PUT, {key, value})
  },
  get(key, fallback) {
    return send(NAME, GET, {key, fallback}, {expectReply: true, timeout: 10})
  },
  update(key, fn = identity) {
    send(NAME, UPDATE, {key, fn})
  },
  delete(key) {
    send(NAME, DELETE, {key})
  },
  where(pattern) {
    return send(NAME, WHERE, {pattern}, {expectReply: true, timeout: 10})
  },
  subscribe(callback) {
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
  },
})
