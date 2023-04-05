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
 * @description Adds a key-value pair to the config
 * @param {string} key - The key to add
 * @param {*} value - The value to add
 * @returns {Promise<object>} - The current config
 */
function put(key, value) {
  send(NAME, PUT, {key, value})
  return config()
}

/**
 * @description Gets a key-value pair with a fallback from the config
 * @param {string} key - The key to add
 * @param {*} [fallback] - The fallback value to return if key is not found
 * @returns {Promise<*>} - The value found at key or fallback
 */
function get(key, fallback) {
  return send(NAME, GET, {key, fallback}, {expectReply: true, timeout: 10})
}

/**
 * @description Returns the first non null config value or the fallback
 * @param {string[]} wants - The keys to search for
 * @param {*} fallback - The fallback value to return if key is not found
 * @returns {Promise<*>} - The value found at key or fallback
 */
async function first(wants = [], fallback) {
  if (!wants.length) return fallback
  const [head, ...rest] = wants
  const ret = await get(head)
  if (ret == null) return first(rest, fallback)
  return ret
}

/**
 * @description Returns the current config
 * @returns {Promise<object>} - The current config
 */
function all() {
  return send(NAME, GET_ALL, null, {expectReply: true, timeout: 10})
}

/**
 * @description Updates a key-value pair in the config
 * @param {string} key - The key to update
 * @param {Function} fn - The function to update the value with
 * @returns {Promise<object>} - The current config
 */
function update(key, fn = identity) {
  send(NAME, UPDATE, {key, fn})
  return config()
}

/**
 * @description Deletes a key-value pair from the config
 * @param {string} key - The key to delete
 * @returns {Promise<object>} - The current config
 */
function _delete(key) {
  send(NAME, DELETE, {key})
  return config()
}

/**
 * @description Returns a subset of the config based on a pattern
 * @param {string} pattern - The pattern to match keys against
 * @returns {Promise<object>} - The subset of the config
 */
function where(pattern) {
  return send(NAME, WHERE, {pattern}, {expectReply: true, timeout: 10})
}

/**
 * @description Subscribes to config updates
 * @param {Function} callback - The callback to call when config is updated
 * @returns {Function} - The unsubscribe function
 */
function subscribe(callback) {
  return subscriber(NAME, () => spawn(HANDLERS, NAME), callback)
}

/**
 * @description Clears the config
 * @returns {void}
 */
export function clearConfig() {
  return send(NAME, CLEAR)
}

/**
 * @description Resets the config to a previous state
 * @param {object} oldConfig - The previous config state
 * @returns {Promise<object>} - The current config
 */
function resetConfig(oldConfig) {
  return clearConfig().then(config(oldConfig))
}

/**
 * @description Takes in flow.json or array of flow.json files and creates contract placeholders
 * @param {object|object[]} data - The flow.json or array of flow.json files
 * @returns {void}
 */
async function load(data) {
  const network = await get("flow.network")
  const cleanedNetwork = cleanNetwork(network)
  const {flowJSON} = data

  invariant(Boolean(flowJSON), "config.load -- 'flowJSON' must be defined")

  invariant(
    cleanedNetwork,
    `Flow Network Required -- In order for FCL to load your contracts please define "flow.network" to "emulator", "local", "testnet", or "mainnet" in your config. See more here: https://developers.flow.com/tools/fcl-js/reference/configure-fcl`
  )

  if (anyHasPrivateKeys(flowJSON)) {
    const isEmulator = cleanedNetwork === "emulator"

    logger.log({
      title: "Private Keys Detected",
      message: `Private keys should be stored in a separate flow.json file for security. See more here: https://developers.flow.com/tools/flow-cli/security`,
      level: isEmulator ? logger.LEVELS.warn : logger.LEVELS.error,
    })

    if (!isEmulator) return
  }

  for (const [key, value] of Object.entries(
    getContracts(flowJSON, cleanedNetwork)
  )) {
    const contractConfigKey = `0x${key}`
    const existingContractConfigKey = await get(contractConfigKey)
    if (existingContractConfigKey && existingContractConfigKey !== value) {
      logger.log({
        title: "Contract Placeholder Conflict Detected",
        message: `A generated contract placeholder from config.load conflicts with a placeholder you've set manually in config have the same name.`,
        level: logger.LEVELS.warn,
      })
    } else {
      put(contractConfigKey, value)
    }

    const systemContractConfigKey = `system.contracts.${key}`
    const systemExistingContractConfigKeyValue = await get(
      systemContractConfigKey
    )
    if (
      systemExistingContractConfigKeyValue &&
      systemExistingContractConfigKeyValue !== value
    ) {
      logger.log({
        title: "Contract Placeholder Conflict Detected",
        message: `A generated contract placeholder from config.load conflicts with a placeholder you've set manually in config have the same name.`,
        level: logger.LEVELS.warn,
      })
    } else {
      put(systemContractConfigKey, value)
    }
  }
}

/**
 * @description Sets the config
 * @param {object} [values] - The values to set
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
