import {mailbox as createMailbox} from "./mailbox"
import queueMicrotask from "queue-microtask"

const REGISTRY = {}
var pid = 0b0

const DEFAULT_TIMEOUT = 5000
const DEFAULT_TAG = "---"
export const send = (addr, tag, data, opts = {}) =>
  new Promise((reply, reject) => {
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
      REGISTRY[addr].mailbox.deliver(payload)
      if (!expectReply) reply(true)
    } catch (error) {
      console.error("FCL.Actor -- Could Not Deliver Message", payload, error)
    }
  })

export const kill = addr => {
  delete REGISTRY[addr]
}

export const spawn = (fn, addr = null) => {
  if (addr == null) addr = ++pid
  if (REGISTRY[addr] != null) return addr

  REGISTRY[addr] = {
    addr,
    mailbox: createMailbox(),
    subs: new Set(),
    kvs: {},
  }

  const ctx = {
    self: () => addr,
    receive: () => REGISTRY[addr].mailbox.receive(),
    send: (to, tag, data, opts = {}) => {
      opts.from = addr
      return send(to, tag, data, opts)
    },
    broadcast: (tag, data, opts = {}) => {
      opts.from = addr
      for (let to of REGISTRY[addr].subs) send(to, tag, data, opts)
    },
    subscribe: sub => sub != null && REGISTRY[addr].subs.add(sub),
    unsubscribe: sub => sub != null && REGISTRY[addr].subs.delete(sub),
    put: (key, value) => {
      if (key != null) REGISTRY[addr].kvs[key] = value
    },
    get: (key, fallback) => {
      const value = REGISTRY[addr].kvs[key]
      return value == null ? fallback : value
    },
    delete: key => {
      delete REGISTRY[addr].kvs[key]
    },
    update: (key, fn) => {
      if (key != null) REGISTRY[addr].kvs[key] = fn(REGISTRY[addr].kvs[key])
    },
    keys: () => {
      return Object.keys(REGISTRY[addr].kvs)
    },
  }

  queueMicrotask(async () => {
    await fn(ctx)
    kill(addr)
  })

  return addr
}
