import {mailbox as createMailbox, type IMailbox} from "./mailbox"

let promise: any
const _queueMicrotask = (cb: any) =>
  (promise || (promise = Promise.resolve())).then(cb).catch((err: any) =>
    setTimeout(() => {
      throw err
    }, 0)
  )

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
  mailbox: IMailbox<Letter>
  subs: Set<string>
  kvs: Record<string, any>
  error: any
}
interface IRoot {
  FCL_REGISTRY: Record<string, IRegistryRecord> | null
}

export type ActorContext = ReturnType<typeof createCtx>

export type Letter = {
  to: string
  from?: string
  tag: string
  data: any
  timeout: number
  reply: (data: any) => void
  reject: (error: any) => void
}
export type HandlerFn = (
  ctx: ActorContext,
  letter: Letter,
  data: any
) => Promise<void> | void
export type SpawnFn = (address?: string) => void
export interface ActorHandlers {
  [INIT]?: (ctx: ActorContext) => Promise<void> | void
  [SUBSCRIBE]?: HandlerFn
  [UNSUBSCRIBE]?: HandlerFn
  [UPDATED]?: HandlerFn
  [SNAPSHOT]?: HandlerFn
  [EXIT]?: HandlerFn
  [TERMINATE]?: HandlerFn
  [DUMP]?: HandlerFn
  [INC]?: HandlerFn
  [KEYS]?: HandlerFn
  [key: string]: HandlerFn | undefined
}

const root: IRoot = (typeof self === "object" &&
  self.self === self &&
  (self as unknown as IRoot)) ||
  (typeof global === "object" &&
    global.global === global &&
    (global as unknown as IRoot)) ||
  (typeof window === "object" &&
    window.window === window &&
    (window as unknown as IRoot)) || {FCL_REGISTRY: null}

root.FCL_REGISTRY = root.FCL_REGISTRY == null ? {} : root.FCL_REGISTRY

const FCL_REGISTRY = root.FCL_REGISTRY
let pid = 0b0

const DEFAULT_TIMEOUT = 5000

export function send<T>(
  addr: string,
  tag: string,
  data?: Record<string, any> | null,
  opts?: {expectReply?: true; timeout?: number; from?: string}
): Promise<T>
export function send(
  addr: string,
  tag: string,
  data?: Record<string, any> | null,
  opts?: {expectReply?: false; timeout?: number; from?: string}
): Promise<boolean>
export function send<T>(
  addr: string,
  tag: string,
  data?: Record<string, any> | null,
  opts: {expectReply?: boolean; timeout?: number; from?: string} = {
    expectReply: false,
  }
): Promise<T | boolean> {
  return new Promise<T | boolean>((resolve, reject) => {
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
      reply: resolve,
      reject,
    }

    try {
      if (FCL_REGISTRY[addr]) {
        FCL_REGISTRY[addr].mailbox.deliver(payload)
      }
      if (!expectReply) {
        resolve(true)
      }
    } catch (error) {
      console.error(
        "FCL.Actor -- Could Not Deliver Message",
        payload,
        FCL_REGISTRY[addr],
        error
      )
      reject(error)
    }
  })
}

export const kill = (addr: string) => {
  delete FCL_REGISTRY[addr]
}

const fromHandlers =
  <Handlers extends ActorHandlers>(handlers: Handlers) =>
  async (ctx: ActorContext) => {
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
        await handlers[letter.tag as any]?.(ctx, letter, letter.data || {})
      } catch (error) {
        console.error(`${ctx.self()} Error`, letter, error)
      } finally {
        continue __loop
      }
    }
  }

const parseAddr = (addr: string | number | null): string => {
  if (addr == null) {
    while (FCL_REGISTRY[String(pid)]) {
      pid++
    }
    return String(pid)
  }
  return String(addr)
}

export const spawn = <Handlers extends ActorHandlers>(
  fnOrHandlers: ((ctx: ActorContext) => Promise<void>) | Handlers,
  rawAddr: string | number | null = null
) => {
  const addr = parseAddr(rawAddr)
  if (FCL_REGISTRY[addr] != null) return addr

  FCL_REGISTRY[addr] = {
    addr,
    mailbox: createMailbox(),
    subs: new Set(),
    kvs: {},
    error: null,
  }

  const ctx = createCtx(addr)

  let fn: (ctx: ActorContext) => Promise<void>
  if (typeof fnOrHandlers === "object")
    fn = fromHandlers<Handlers>(fnOrHandlers)
  else fn = fnOrHandlers

  _queueMicrotask(async () => {
    await fn(ctx)
    kill(addr)
  })

  return addr
}

const createCtx = (addr: string) => ({
  self: () => addr,
  receive: () => FCL_REGISTRY[addr].mailbox.receive(),
  send: (
    to: string | null | undefined,
    tag: string,
    data?: any,
    opts: Record<string, any> = {}
  ) => {
    if (to == null) return
    opts.from = addr
    return send(to, tag, data, opts)
  },
  sendSelf: (tag: string, data?: any, opts: Record<string, any> = {}) => {
    if (FCL_REGISTRY[addr]) send(addr, tag, data, opts)
  },
  broadcast: (tag: string, data: any, opts: Record<string, any> = {}) => {
    opts.from = addr
    for (const to of FCL_REGISTRY[addr].subs) send(to, tag, data, opts)
  },
  subscribe: (sub?: string | null) =>
    sub != null && FCL_REGISTRY[addr].subs.add(sub),
  unsubscribe: (sub?: string | null) =>
    sub != null && FCL_REGISTRY[addr].subs.delete(sub),
  subscriberCount: () => FCL_REGISTRY[addr].subs.size,
  hasSubs: () => !!FCL_REGISTRY[addr].subs.size,
  put: <T>(key: string, value: T) => {
    if (key != null) FCL_REGISTRY[addr].kvs[key] = value
  },
  get: <T>(key: string, fallback: T | undefined = undefined) => {
    const value = FCL_REGISTRY[addr].kvs[key]
    return value == null ? fallback : value
  },
  delete: (key: string) => {
    delete FCL_REGISTRY[addr].kvs[key]
  },
  update: <T, U>(key: string, fn: (x: T) => U) => {
    if (key != null)
      FCL_REGISTRY[addr].kvs[key] = fn(FCL_REGISTRY[addr].kvs[key])
  },
  keys: () => {
    return Object.keys(FCL_REGISTRY[addr].kvs)
  },
  all: () => {
    return FCL_REGISTRY[addr].kvs
  },
  where: (pattern: RegExp) => {
    return Object.keys(FCL_REGISTRY[addr].kvs).reduce((acc, key) => {
      return pattern.test(key)
        ? {...acc, [key]: FCL_REGISTRY[addr].kvs[key]}
        : acc
    }, {})
  },
  merge: (data: Record<string, any> = {}) => {
    Object.keys(data).forEach(key => (FCL_REGISTRY[addr].kvs[key] = data[key]))
  },
  fatalError: (error: Error) => {
    FCL_REGISTRY[addr].error = error
    for (const to of FCL_REGISTRY[addr].subs) send(to, UPDATED)
  },
})

// Returns an unsubscribe function
// A SUBSCRIBE handler will need to be created to handle the subscription event
//
//  [SUBSCRIBE]: (ctx, letter) => {
//    ctx.subscribe(letter.from)
//    ctx.send(letter.from, UPDATED, ctx.all())
//  }
//
export function subscriber<T>(
  address: string,
  spawnFn: SpawnFn,
  callback: (data: T | null, error: Error | null) => void
) {
  spawnFn(address)
  const self = spawn(async (ctx: ActorContext) => {
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
export function snapshoter<T>(address: string, spawnFn: SpawnFn) {
  spawnFn(address)
  return send<T>(address, SNAPSHOT, null, {
    expectReply: true,
    timeout: 0,
  })
}
