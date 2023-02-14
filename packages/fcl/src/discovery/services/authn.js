import {
  spawn,
  subscriber,
  snapshoter,
  INIT,
  SUBSCRIBE,
  UNSUBSCRIBE,
  send,
} from "@onflow/util-actor"
import {getServices} from "../services"
import {LEVELS, log} from "@onflow/util-logger"

export const SERVICE_ACTOR_KEYS = {
  AUTHN: "authn",
  RESULTS: "results",
  SNAPSHOT: "SNAPSHOT",
  UPDATED: "UPDATED",
  UPDATE_RESULTS: "UPDATE_RESULTS",
}

const warn = (fact, msg) => {
  if (fact) {
    console.warn(
      `
      %cFCL Warning
      ============================
      ${msg}
      For more info, please see the docs: https://docs.onflow.org/fcl/
      ============================
      `,
      "font-weight:bold;font-family:monospace;"
    )
  }
}

const fetchServicesFromDiscovery = async () => {
  try {
    const services = await getServices({types: [SERVICE_ACTOR_KEYS.AUTHN]})
    send(SERVICE_ACTOR_KEYS.AUTHN, SERVICE_ACTOR_KEYS.UPDATE_RESULTS, {
      results: services,
    })
  } catch (error) {
    log({
      title: `${error.name} Error fetching Discovery API services.`,
      message: error.message,
      level: LEVELS.error,
    })
  }
}

const HANDLERS = {
  [INIT]: async ctx => {
    warn(
      typeof window === "undefined",
      '"fcl.discovery" is only available in the browser.'
    )
    // If you call this before the window is loaded extensions will not be set yet
    if (document.readyState === 'complete') {
      fetchServicesFromDiscovery()
    } else {
      window.onload = async () => {
        fetchServicesFromDiscovery()
      }
    }
  },
  [SERVICE_ACTOR_KEYS.UPDATE_RESULTS]: (ctx, _letter, data) => {
    ctx.merge(data)
    ctx.broadcast(SERVICE_ACTOR_KEYS.UPDATED, {...ctx.all()})
  },
  [SUBSCRIBE]: (ctx, letter) => {
    ctx.subscribe(letter.from)
    ctx.send(letter.from, SERVICE_ACTOR_KEYS.UPDATED, {...ctx.all()})
  },
  [UNSUBSCRIBE]: (ctx, letter) => ctx.unsubscribe(letter.from),
  [SERVICE_ACTOR_KEYS.SNAPSHOT]: async (ctx, letter) =>
    letter.reply({...ctx.all()}),
}

const spawnProviders = () => spawn(HANDLERS, SERVICE_ACTOR_KEYS.AUTHN)


/**
 * @typedef {Object} Service
 * @property {string} f_type - A type identifier used internally by FCL
 * @property {string} f_vsn - FCL protocol version
 * @property {string} type - Service type
 * @property {string} method - Service method
 * @property {string} [uid] - Service uid
 * @property {string} endpoint - Service endpoint
 * @property {Object} provider - Service provider object
 */

/**
 * @callback SubscriptionCallback
 * @returns {Service[]}
 */

/**
 * @description
 * Discovery methods for interacting with Authn.
 * 
 * @typedef {Object} Authn
 * @property {Function} subscribe - Subscribe to Discovery authn services
 * @property {Function} snapshot - Get the current Discovery authn services spanshot
 * @property {Function} update - Trigger an update of authn services
 */
const authn = {
  /**
   * @description - Subscribe to Discovery authn services
   * @returns {SubscriptionCallback}
   */
  subscribe: cb => subscriber(SERVICE_ACTOR_KEYS.AUTHN, spawnProviders, cb),
  /**
   * @description - Get the current Discovery authn services spanshot
   * @returns {Service[]}
   */
  snapshot: () => snapshoter(SERVICE_ACTOR_KEYS.AUTHN, spawnProviders),
  /**
   * @description - Trigger an update of authn services
   * @returns {void}
   */
  update: () => fetchServicesFromDiscovery(),
}

export default authn
