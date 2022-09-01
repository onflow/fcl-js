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
    window.onload = async () => {
      fetchServicesFromDiscovery()
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

const authn = {
  subscribe: cb => subscriber(SERVICE_ACTOR_KEYS.AUTHN, spawnProviders, cb),
  snapshot: () => snapshoter(SERVICE_ACTOR_KEYS.AUTHN, spawnProviders),
  update: () => fetchServicesFromDiscovery(),
}

export default authn
