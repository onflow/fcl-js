import {mailbox as createMailbox, type IMailbox} from "./mailbox"
const queueMicrotask = require("queue-microtask")

export const INIT = "INIT"
export const SUBSCRIBE = "SUBSCRIBE"
export const UNSUBSCRIBE = "UNSUBSCRIBE"
export const UPDATED = "UPDATED"
export const SNAPSHOT = "SNAPSHOT"
export const EXIT = "EXIT"
export const TERMINATE = "TERMINATE"
const DUMP = "DUMP"
const INC = "INC"
const KEYS = "KEYS"

interface IRegistryRecord {
  addr: string
  mailbox: IMailbox
  subs: Set<string>
  kvs: Record<string, any>
  error: any
}
interface IRoot {
  FCL_REGISTRY: Record<string, IRegistryRecord> | null
}

const root: IRoot =
  (typeof self === "object" && self.self === self && (self as unknown) as IRoot) ||
  (typeof global === "object" && global.global === global && (global as unknown) as IRoot) ||
  (typeof window === "object" && window.window === window && (window as unknown) as IRoot) ||
  {FCL_REGISTRY: null}

root.FCL_REGISTRY = root.FCL_REGISTRY == null ? {} : root.FCL_REGISTRY

const FCL_REGISTRY = root.FCL_REGISTRY
var pid = 0b0

const DEFAULT_TIMEOUT = 5000
const DEFAULT_TAG = "---"

type Tag = typeof INIT | typeof SUBSCRIBE | typeof UNSUBSCRIBE | typeof UPDATED | typeof SNAPSHOT | typeof EXIT | typeof TERMINATE | "@EXIT" | typeof DUMP | typeof INC | typeof KEYS;

export const send = (addr: string, tag: Tag, data?: Record<string, any> | null, opts: Record<string, any> = {}) =>
  new Promise<boolean>((reply, reject) => {
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
      FCL_REGISTRY[addr] &&
        FCL_REGISTRY[addr].mailbox.deliver(payload)
      if (!expectReply) reply(true)
    } catch (error) {
      console.error(
        "FCL.Actor -- Could Not Deliver Message",
        payload,
        FCL_REGISTRY[addr],
        error
      )
    }
  })

export const kill = addr => {
  delete FCL_REGISTRY[addr]
}

const fromHandlers =
  (handlers = {}) =>
  async ctx => {
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

const parseAddr = (addr): string => {
  if (addr == null) {
    return String(++pid)
  }
  return String(addr)
} 

export const spawn = (fn, rawAddr: number | null = null) => {
  const addr = parseAddr(rawAddr)
  if (FCL_REGISTRY[addr] != null) return addr

  FCL_REGISTRY[addr] = {
    addr,
    mailbox: createMailbox(),
    subs: new Set(),
    kvs: {},
    error: null,
  }

  const ctx = {
    self: () => addr,
    receive: () => FCL_REGISTRY[addr].mailbox.receive(),
    send: (to: string, tag: Tag, data: Record<string, any> | null, opts: Record<string, any> = {}) => {
      opts.from = addr
      return send(to, tag, data, opts)
    },
    sendSelf: (tag, data, opts) => {
      if (FCL_REGISTRY[addr]) send(addr, tag, data, opts)
    },
    broadcast: (tag, data, opts: Record<string, any> = {}) => {
      opts.from = addr
      for (let to of FCL_REGISTRY[addr].subs) send(to, tag, data, opts)
    },
    subscribe: sub => sub != null && FCL_REGISTRY[addr].subs.add(sub),
    unsubscribe: sub => sub != null && FCL_REGISTRY[addr].subs.delete(sub),
    subscriberCount: () => FCL_REGISTRY[addr].subs.size,
    hasSubs: () => !!FCL_REGISTRY[addr].subs.size,
    put: (key, value) => {
      if (key != null) FCL_REGISTRY[addr].kvs[key] = value
    },
    get: (key, fallback) => {
      const value = FCL_REGISTRY[addr].kvs[key]
      return value == null ? fallback : value
    },
    delete: key => {
      delete FCL_REGISTRY[addr].kvs[key]
    },
    update: (key, fn) => {
      if (key != null)
        FCL_REGISTRY[addr].kvs[key] = fn(FCL_REGISTRY[addr].kvs[key])
    },
    keys: () => {
      return Object.keys(FCL_REGISTRY[addr].kvs)
    },
    all: () => {
      return FCL_REGISTRY[addr].kvs
    },
    where: pattern => {
      return Object.keys(FCL_REGISTRY[addr].kvs).reduce((acc, key) => {
        return pattern.test(key)
          ? {...acc, [key]: FCL_REGISTRY[addr].kvs[key]}
          : acc
      }, {})
    },
    merge: (data = {}) => {
      Object.keys(data).forEach(
        key => (FCL_REGISTRY[addr].kvs[key] = data[key])
      )
    },
    fatalError: error => {
      FCL_REGISTRY[addr].error = error
      for (let to of FCL_REGISTRY[addr].subs) send(to, UPDATED)
    },
  }

  if (typeof fn === "object") fn = fromHandlers(fn)

  queueMicrotask(async () => {
    await fn(ctx)
    kill(addr)
  })

  return addr
}

// Returns an unsubscribe function
// A SUBSCRIBE handler will need to be created to handle the subscription event
//
//  [SUBSCRIBE]: (ctx, letter) => {
//    ctx.subscribe(letter.from)
//    ctx.send(letter.from, UPDATED, ctx.all())
//  }
//
export function subscriber(address, spawnFn, callback) {
  spawnFn(address)
  const EXIT = "@EXIT"
  const self = spawn(async ctx => {
    ctx.send(address, SUBSCRIBE)
    while (1) {
      const letter = await ctx.receive()
      const error = FCL_REGISTRY[address].error
      if (letter.tag === EXIT) {
        ctx.send(address, UNSUBSCRIBE)
        return
      }
      if (error) {
        callback(null, error)
        ctx.send(address, UNSUBSCRIBE)
        return
      }

      callback(letter.data, null)
    }
  })
  return () => send(self, EXIT)
}

// Returns a promise that returns a result
// A SNAPSHOT handler will need to be created to handle the snapshot event
//
//  [SNAPSHOT]: (ctx, letter) => {
//    letter.reply(ctx.all())
//  }
//
export function snapshoter(address, spawnFn) {
  spawnFn(address)
  return send(address, SNAPSHOT, null, {expectReply: true, timeout: 0})
}
