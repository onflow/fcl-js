/**
 * @typedef {Object} FlowJSON
 * @property {object} networks
 * @property {object} contracts
 * @property {object} accounts
 * @property {object} deployments
 */

import {
  spawn,
  send,
  subscriber,
  SUBSCRIBE,
  UNSUBSCRIBE,
} from "@onflow/util-actor"
import * as logger from "@onflow/util-logger"
import {invariant} from "@onflow/util-invariant"
import {getContracts, cleanNetwork, anyHasPrivateKeys} from "../utils/utils"

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

/**
 * Add a new config with {@link key} and {@link value}
 * @callback put
 * @param {string} key 
 * @param {any} value 
 * @returns {config}
 */
function put(key, value) {
  send(NAME, PUT, {key, value})
  return config()
}

/**
 * Returns the config whose key matches {@link key}. Returns {@link fallback} if nothing matches. 
 * @callback get
 * @param {string} key 
 * @param {any} fallback 
 * @returns {Promise<any>}
 */
function get(key, fallback) {
  return send(NAME, GET, {key, fallback}, {expectReply: true, timeout: 10})
}

/**
 * Returns the first config whose key is in {@link wants}. Returns {@link fallback} if nothing matches.
 * @callback first
 * @param {string[]} wants 
 * @param {any} fallback 
 * @returns {Promise<any>}
 */
async function first(wants = [], fallback) {
  if (!wants.length) return fallback
  const [head, ...rest] = wants
  const ret = await get(head)
  if (ret == null) return first(rest, fallback)
  return ret
}

/**
 * Get all configs
 * @callback all
 * @returns {Promise<any>}
 */
function all() {
  return send(NAME, GET_ALL, null, {expectReply: true, timeout: 10})
}

/**
 * Update the config with the given {@link key} using {@link fn}
 * @callback update
 * @param {string} key
 * @param {function} fn
 * @returns {config}
 */
function update(key, fn = identity) {
  send(NAME, UPDATE, {key, fn})
  return config()
}

/**
 * Delete the config with the given {@link key}
 * @callback _delete
 * @param {string} key
 * @returns {config}
 */
function _delete(key) {
  send(NAME, DELETE, {key})
  return config()
}

/**
 * Takes a regex and returns an object of configs whose keys match the regex
 * @callback where
 * @param {string} pattern
 * @returns {Promise<object>}
 */
function where(pattern) {
  return send(NAME, WHERE, {pattern}, {expectReply: true, timeout: 10})
}

/**
 * Calls {@link callback} when config is changed
 * @callback subscribe
 * @param {function} callback
 * @returns {Promise<any>}
 */
function subscribe(callback) {
  return subscriber(NAME, () => spawn(HANDLERS, NAME), callback)
}

/**
 * @callback clearConfig
 * @returns {Promise<any>}
 */
export function clearConfig() {
  return send(NAME, CLEAR)
}

/**
 * Clears config then set config as {@link oldConfig}
 * @callback resetConfig
 * @param {config} oldConfig
 * @returns {Promise<any>}
 */
function resetConfig(oldConfig) {
  return clearConfig().then(config(oldConfig))
}

/**
 * Takes in flow.json or array of flow.json files and creates contract placeholders
 * @callback load
 * @param {FlowJSON|FlowJSON[]} data
 * @returns {void}
 */
async function load(data) {
  const network = await get("flow.network")
  const cleanedNetwork = cleanNetwork(network)
  const { flowJSON } = data

  invariant(
    Boolean(flowJSON),
    "config.load -- 'flowJSON' must be defined"
  )

  invariant(
    cleanedNetwork,
    `Flow Network Required -- In order for FCL to load your contracts please define "flow.network" to "emulator", "local", "testnet", or "mainnet" in your config. See more here: https://developers.flow.com/tools/fcl-js/reference/configure-fcl`
  )

  if (anyHasPrivateKeys(flowJSON)) {
    const isEmulator = cleanedNetwork === 'emulator'

    logger.log({
      title: "Private Keys Detected",
      message: `Private keys should be stored in a separate flow.json file for security. See more here: https://developers.flow.com/tools/flow-cli/security`,
      level: isEmulator ? logger.LEVELS.warn : logger.LEVELS.error,
    })

    if (!isEmulator) return
  }

  for (const [key, value] of Object.entries(getContracts(flowJSON, cleanedNetwork))) {
    const contractConfigKey = `0x${key}`
    const existingContractConfigKey = await get(contractConfigKey)

    if (existingContractConfigKey) {
      logger.log({
        title: "Contract Placeholder Conflict Detected",
        message: `A generated contract placeholder from config.load and a placeholder you've set manually in config have the same name.`,
        level: logger.LEVELS.warn,
      })
    } else {
      put(contractConfigKey, value)
    }
  }
}

/**
 * @typedef {Object} config
 * @property {put} put
 * @property {get} get
 * @property {all} all
 * @property {first} first
 * @property {update} update
 * @property {_delete} delete
 * @property {where} where
 * @property {subscribe} subscribe
 * @property {overload} overload
 * @property {load} load
 */

/**
 * 
 * @param {object.<string, string>} values 
 * @returns {config}
 */
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
    load,
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
config.load = load

export {config}

const noop = v => v

/**
 * Set config as {@link opts}, calls {@link callback} then set config as it was.
 * Returns the result of {@link callback} if succeeds
 * @callback overload
 * @param {config} opts 
 * @param {function} callback 
 * @returns {Promise<any>}
 */
function overload(opts = {}, callback = noop) {
  return new Promise(async (resolve, reject) => {
    const oldConfig = await all()
    try {
      config(opts)
      var result = await callback(await all())
      await resetConfig(oldConfig)
      resolve(result)
    } catch (error) {
      await resetConfig(oldConfig)
      reject(error)
    }
  })
}
