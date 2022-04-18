import {
  spawn,
  send,
  subscriber,
  SUBSCRIBE,
  UNSUBSCRIBE,
} from "@onflow/util-actor"

const NAME = "config"
const PUT = "PUT_CONFIG"
const GET = "GET_CONFIG"
const GET_ALL = "GET_ALL_CONFIG"
const UPDATE = "UPDATE_CONFIG"
const DELETE = "DELETE_CONFIG"
const CLEAR = "CLEAR_CONFIG"
const WHERE = "WHERE_CONFIG"
const UPDATED = "CONFIG/UPDATED"

const identity = v => v

const HANDLERS = {
  [PUT]: (ctx, _letter, {key, value}) => {
    if (key == null) throw new Error("Missing 'key' for config/put.")
    ctx.put(key, value)
    ctx.broadcast(UPDATED, {...ctx.all()})
  },
  [GET]: (ctx, letter, {key, fallback}) => {
    if (key == null) throw new Error("Missing 'key' for config/get")
    letter.reply(ctx.get(key, fallback))
  },
  [GET_ALL]: (ctx, letter) => {
    letter.reply({...ctx.all()})
  },
  [UPDATE]: (ctx, letter, {key, fn}) => {
    if (key == null) throw new Error("Missing 'key' for config/update")
    ctx.update(key, fn || identity)
    ctx.broadcast(UPDATED, {...ctx.all()})
  },
  [DELETE]: (ctx, letter, {key}) => {
    if (key == null) throw new Error("Missing 'key' for config/delete")
    ctx.delete(key)
    ctx.broadcast(UPDATED, {...ctx.all()})
  },
  [CLEAR]: (ctx, letter) => {
    let keys = Object.keys(ctx.all())
    for (let key of keys) ctx.delete(key)
    ctx.broadcast(UPDATED, {...ctx.all()})
  },
  [WHERE]: (ctx, letter, {pattern}) => {
    if (pattern == null) throw new Error("Missing 'pattern' for config/where")
    letter.reply(ctx.where(pattern))
  },
  [SUBSCRIBE]: (ctx, letter) => {
    ctx.subscribe(letter.from)
    ctx.send(letter.from, UPDATED, {...ctx.all()})
  },
  [UNSUBSCRIBE]: (ctx, letter) => {
    ctx.unsubscribe(letter.from)
  },
}

spawn(HANDLERS, NAME)

function put(key, value) {
  send(NAME, PUT, {key, value})
  return config()
}

function get(key, fallback) {
  return send(NAME, GET, {key, fallback}, {expectReply: true, timeout: 10})
}

async function first(wants = [], fallback) {
  if (!wants.length) return fallback
  const [head, ...rest] = wants
  const ret = await get(head)
  if (ret == null) return first(rest, fallback)
  return ret
}

function all() {
  return send(NAME, GET_ALL, null, {expectReply: true, timeout: 10})
}

function update(key, fn = identity) {
  send(NAME, UPDATE, {key, fn})
  return config()
}

function _delete(key) {
  send(NAME, DELETE, {key})
  return config()
}

function where(pattern) {
  return send(NAME, WHERE, {pattern}, {expectReply: true, timeout: 10})
}

function subscribe(callback) {
  return subscriber(NAME, () => spawn(HANDLERS, NAME), callback)
}

export function clearConfig() {
  return send(NAME, CLEAR)
}

function config(values) {
  if (values != null && typeof values === "object") {
    Object.keys(values).map(d => put(d, values[d]))
  }

  return {
    put,
    get,
    all,
    first,
    update,
    delete: _delete,
    where,
    subscribe,
    overload,
  }
}

config.put = put
config.get = get
config.all = all
config.first = first
config.update = update
config.delete = _delete
config.where = where
config.subscribe = subscribe
config.overload = overload

export {config}

const noop = v => v
function overload(opts = {}, callback = noop) {
  return new Promise(async (resolve, reject) => {
    const oldConfig = await all()
    try {
      config(opts)
      var result = await callback(await all())
      await clearConfig()
      await config(oldConfig)
      resolve(result)
    } catch (error) {
      await clearConfig()
      await config(oldConfig)
      reject(error)
    }
  })
}
