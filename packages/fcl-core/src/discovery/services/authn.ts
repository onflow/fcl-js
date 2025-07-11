import {
  spawn,
  subscriber,
  snapshoter,
  INIT,
  SUBSCRIBE,
  UNSUBSCRIBE,
  send,
  Letter as ActorLetter,
  ActorContext,
} from "@onflow/util-actor"
import {getServices} from "../services"
import {LEVELS, log} from "@onflow/util-logger"
import {Service} from "@onflow/typedefs"

export const SERVICE_ACTOR_KEYS = {
  AUTHN: "authn",
  RESULTS: "results",
  SNAPSHOT: "SNAPSHOT",
  UPDATED: "UPDATED",
  UPDATE_RESULTS: "UPDATE_RESULTS",
} as const

export interface ServiceData {
  results: Service[]
}

export type SubscriptionCallback = (
  data: Service[] | null,
  error: Error | null
) => void

export interface Authn {
  subscribe: (cb: SubscriptionCallback) => () => void
  snapshot: () => Promise<ServiceData>
  update: () => void
}

const warn = (fact: boolean, msg: string): void => {
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

const fetchServicesFromDiscovery = async (): Promise<void> => {
  try {
    const services = await getServices({types: [SERVICE_ACTOR_KEYS.AUTHN]})
    send(SERVICE_ACTOR_KEYS.AUTHN, SERVICE_ACTOR_KEYS.UPDATE_RESULTS, {
      results: services,
    })
  } catch (error: any) {
    log({
      title: `${error.name} Error fetching Discovery API services.`,
      message: error.message,
      level: LEVELS.error,
    })
  }
}

const HANDLERS = {
  [INIT]: async (ctx: ActorContext) => {
    warn(
      typeof window === "undefined",
      '"fcl.discovery" is only available in the browser.'
    )
    // If you call this before the window is loaded extensions will not be set yet
    if (document.readyState === "complete") {
      fetchServicesFromDiscovery()
    } else {
      window.addEventListener("load", () => {
        fetchServicesFromDiscovery()
      })
    }
  },
  [SERVICE_ACTOR_KEYS.UPDATE_RESULTS]: (
    ctx: ActorContext,
    _letter: ActorLetter,
    data: ServiceData
  ) => {
    ctx.merge(data)
    ctx.broadcast(SERVICE_ACTOR_KEYS.UPDATED, {...ctx.all()})
  },
  [SUBSCRIBE]: (ctx: ActorContext, letter: ActorLetter) => {
    ctx.subscribe(letter.from!)
    ctx.send(letter.from!, SERVICE_ACTOR_KEYS.UPDATED, {...ctx.all()})
  },
  [UNSUBSCRIBE]: (ctx: ActorContext, letter: ActorLetter) =>
    ctx.unsubscribe(letter.from!),
  [SERVICE_ACTOR_KEYS.SNAPSHOT]: async (
    ctx: ActorContext,
    letter: ActorLetter
  ) => letter.reply({...ctx.all()}),
}

const spawnProviders = () => spawn(HANDLERS as any, SERVICE_ACTOR_KEYS.AUTHN)

/**
 * @description Discovery methods for interacting with Authn.
 */
const authn: Authn = {
  // Subscribe to Discovery authn services
  subscribe: cb => subscriber(SERVICE_ACTOR_KEYS.AUTHN, spawnProviders, cb),
  // Get the current Discovery authn services snapshot
  snapshot: () => snapshoter(SERVICE_ACTOR_KEYS.AUTHN, spawnProviders),
  // Trigger an update of authn services
  update: () => {
    // Only fetch services if the window is loaded
    // Otherwise, this will be called by the INIT handler
    if (document.readyState === "complete") {
      fetchServicesFromDiscovery()
    }
  },
}

export default authn
