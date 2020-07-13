import {mailbox as createMailbox} from "./mailbox/mailbox.js"
import queueMicrotask from "queue-microtask"

export const INIT = "INIT"
export const SUBSCRIBE = "SUBSCRIBE"
export const UNSUBSCRIBE = "UNSUBSCRIBE"
export const EXIT = "EXIT"
export const TERMINATE = "TERMINATE"

const root =
  (typeof self === "object" && self.self === self && self) ||
  (typeof global === "object" && global.global === global && global) ||
  (typeof window === "object" && window.window === window && window)

root.REGISTRY = root.REGISTRY == null ? {} : root.REGISTRY
var pid = 0b0

const DEFAULT_TIMEOUT = 5000
const DEFAULT_TAG = "---"

export function send(addr, tag, data, opts = {}) {
  return new Promise((reply, reject) => {
    const expectReply = opts.expectReply || false
    const timeout = opts.timeout != null ? opts.timeout : DEFAULT_TIMEOUT

    if (expectReply && timeout) {
      setTimeout(
        () =>
          reject(new Error(`Timeout: ${timeout}ms passed without a response.`)),
        timeout
      )
    }

    const payload = {
      to: addr,
      from: opts.from,
      tag,
      data,
      timeout,
      reply,
      reject,
    }

    try {
      root.REGISTRY[addr].mailbox.deliver(payload)
      if (!expectReply) reply(true)
    } catch (error) {
      console.error("FCL.Actor -- Could Not Deliver Message", payload, error)
    }
  })
}

export function kill(addr) {
  delete root.REGISTRY[addr]
}

function fromHandlers(handlers = {}) {
  return async function internalFromHandlers(ctx) {
    if (typeof handlers[INIT] === "function") await handlers[INIT](ctx)
    __loop: while (1) {
      const letter = await ctx.receive()
      try {
        if (letter.tag === EXIT) {
          if (typeof handlers[TERMINATE] === "function") {
            await handlers[TERMINATE](ctx, letter, letter.data || {})
          }
          break __loop
        }
        await handlers[letter.tag](ctx, letter, letter.data || {})
      } catch (error) {
        console.error(`${ctx.self()} Error`, letter, error)
      } finally {
        continue __loop
      }
    }
  }
}

export function spawn(fn, addr = null) {
  if (addr == null) addr = ++pid
  if (root.REGISTRY[addr] != null) return addr

  root.REGISTRY[addr] = {
    addr,
    mailbox: createMailbox(),
    subs: new Set(),
    kvs: {},
  }

  const ctx = {
    self() {
      return addr
    },

    receive() {
      return root.REGISTRY[addr].mailbox.receive()
    },

    send(to, tag, data, opts = {}) {
      opts.from = addr
      return send(to, tag, data, opts)
    },

    broadcast(tag, data, opts = {}) {
      opts.from = addr
      for (let to of root.REGISTRY[addr].subs) send(to, tag, data, opts)
    },

    subscribe(sub) {
      if (sub != null) {
        root.REGISTRY[addr].subs.add(sub)
      }
    },

    unsubscribe(sub) {
      if (sub != null) {
        root.REGISTRY[addr].subs.delete(sub)
      }
    },

    put(key, value) {
      if (key != null) {
        root.REGISTRY[addr].kvs[key] = value
      }
    },

    get(key, fallback) {
      const value = root.REGISTRY[addr].kvs[key]
      return value == null ? fallback : value
    },

    delete(key) {
      delete root.REGISTRY[addr].kvs[key]
    },

    update(key, fn) {
      if (key != null) {
        root.REGISTRY[addr].kvs[key] = fn(root.REGISTRY[addr].kvs[key])
      }
    },

    keys() {
      return Object.keys(root.REGISTRY[addr].kvs)
    },

    all() {
      return root.REGISTRY[addr].kvs
    },

    where(pattern) {
      return Object.keys(root.REGISTRY[addr].kvs).reduce((acc, key) => {
        return pattern.test(key)
          ? {...acc, [key]: root.REGISTRY[addr].kvs[key]}
          : acc
      }, {})
    },

    merge(data = {}) {
      Object.keys(data).forEach(
        key => (root.REGISTRY[addr].kvs[key] = data[key])
      )
    },
  }

  if (typeof fn === "object") fn = fromHandlers(fn)

  queueMicrotask(async () => {
    await fn(ctx)
    kill(addr)
  })

  return addr
}
