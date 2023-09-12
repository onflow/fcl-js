import {
  spawn,
  send,
  subscriber,
  SUBSCRIBE,
  UNSUBSCRIBE,
  ActorHandlers,
} from "@onflow/util-actor"
import * as logger from "@onflow/util-logger"
import {invariant} from "@onflow/util-invariant"
import {getContracts, cleanNetwork, anyHasPrivateKeys} from "./utils/utils"

// Inject config into logger to break circular dependency
logger.setConfig(config)

const NAME = "config"
const PUT = "PUT_CONFIG"
const GET = "GET_CONFIG"
const GET_ALL = "GET_ALL_CONFIG"
const UPDATE = "UPDATE_CONFIG"
const DELETE = "DELETE_CONFIG"
const CLEAR = "CLEAR_CONFIG"
const WHERE = "WHERE_CONFIG"
const UPDATED = "CONFIG/UPDATED"

const identity = <T>(v: T) => v

const HANDLERS: ActorHandlers = {
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
  [CLEAR]: ctx => {
    const keys = Object.keys(ctx.all())
    for (const key of keys) ctx.delete(key)
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
 * @param key - The key to add
 * @param value - The value to add
 * @returns The config object
 */
function put<T>(key: string, value: T) {
  send(NAME, PUT, {key, value})
  return config()
}

/**
 * @description Gets a key-value pair with a fallback from the config
 * @param key - The key to add
 * @param fallback - The fallback value to return if key is not found
 * @returns The value found at key or fallback
 */
function get<T>(key: string, fallback?: T): Promise<T> {
  return send(NAME, GET, {key, fallback}, {expectReply: true, timeout: 10})
}

/**
 * @description Returns the first non null config value or the fallback
 * @param wants - The keys to search for
 * @param fallback - The fallback value to return if key is not found
 * @returns The value found at key or fallback
 */
async function first<T>(wants: string[] = [], fallback: T): Promise<T> {
  if (!wants.length) return fallback
  const [head, ...rest] = wants
  const ret = await get<T>(head)
  if (ret == null) return first(rest, fallback)
  return ret
}

/**
 * @description Returns the current config
 * @returns The config object
 */
function all(): Promise<Record<string, unknown>> {
  return send(NAME, GET_ALL, null, {expectReply: true, timeout: 10})
}

/**
 * @description Updates a key-value pair in the config
 * @param key - The key to update
 * @param fn - The function to update the value with
 * @returns The config object
 */
function update<T>(key: string, fn: (x: T) => T = identity) {
  send(NAME, UPDATE, {key, fn})
  return config()
}

/**
 * @description Deletes a key-value pair from the config
 * @param key - The key to delete
 * @returns The config object
 */
function _delete(key: string) {
  send(NAME, DELETE, {key})
  return config()
}

/**
 * @description Returns a subset of the config based on a pattern
 * @param pattern - The pattern to match keys against
 * @returns The subset of the config
 */
function where(pattern: RegExp): Promise<Record<string, unknown>> {
  return send(NAME, WHERE, {pattern}, {expectReply: true, timeout: 10})
}

/**
 * @description Subscribes to config updates
 * @param callback - The callback to call when config is updated
 * @returns The unsubscribe function
 */
function subscribe(
  callback: (
    config: Record<string, unknown> | null,
    error: Error | null
  ) => void
): () => void {
  return subscriber(NAME, () => spawn(HANDLERS, NAME), callback)
}

/**
 * @description Clears the config
 */
export async function clearConfig(): Promise<void> {
  await send(NAME, CLEAR)
}

/**
 * @description Resets the config to a previous state
 * @param oldConfig - The previous config state
 * @returns The config object
 */
async function resetConfig(oldConfig: Record<string, unknown>) {
  return clearConfig().then(() => config(oldConfig))
}

/**
 * @description Takes in flow.json or array of flow.json files and creates contract placeholders
 * @param data - The data to load
 * @param data.flowJSON - The flow.json or array of flow.json files
 */
async function load(data: {
  flowJSON: Record<string, unknown> | Record<string, unknown>[]
}) {
  const network: string = await get("flow.network")
  const cleanedNetwork = cleanNetwork(network)
  const {flowJSON} = data

  invariant(Boolean(flowJSON), "config.load -- 'flowJSON' must be defined")

  invariant(
    !!cleanedNetwork,
    `Flow Network Required -- In order for FCL to load your contracts please define "flow.network" to "emulator", "local", "testnet", or "mainnet" in your config. See more here: https://developers.flow.com/tools/fcl-js/reference/configure-fcl`
  )

  if (anyHasPrivateKeys(flowJSON)) {
    const isEmulator = cleanedNetwork === "emulator"

    logger.log({
      title: "Private Keys Detected",
      message: `Private keys should be stored in a separate flow.json file for security. See more here: https://developers.flow.com/tools/flow-cli/security`,
      level: isEmulator ? logger.LEVELS.warn : logger.LEVELS.error,
    })

    invariant(
      isEmulator,
      `Private keys should be stored in a separate flow.json file for security. See more here: https://developers.flow.com/tools/flow-cli/security`
    )
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
 * @param values - The values to set
 * @returns The config object
 */
function config(values?: Record<string, unknown>) {
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

/**
 * @description Temporarily overloads the config with the given values and calls the callback
 * @param values - The values to overload the config with
 * @param callback - The callback to call with the overloaded config
 * @returns The result of the callback
 */
async function overload<T>(
  values: Record<string, unknown>,
  callback: (oldConfig: Record<string, unknown>) => T
) {
  const oldConfig = await all()
  try {
    config(values)
    const result = await callback(await all())
    return result
  } finally {
    await resetConfig(oldConfig)
  }
}
