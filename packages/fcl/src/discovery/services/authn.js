import {spawn, subscriber, snapshoter, INIT, SUBSCRIBE, UNSUBSCRIBE} from "@onflow/util-actor"
import {getServices} from "../services"

export const SERVICE_ACTOR_KEYS = {
  NAME: "authn",
  RESULTS: "results",
  SNAPSHOT: "SNAPSHOT",
  UPDATED: "UPDATED",
  UPDATE_RESULTS: "UPDATE_RESULTS"
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

const HANDLERS = {
  [INIT]: async ctx => {
    warn(typeof window === "undefined", '"fcl.discovery" is only available in the browser.')
    const services = await getServices({ type: SERVICE_ACTOR_KEYS.NAME })
    ctx.put(SERVICE_ACTOR_KEYS.RESULTS, services)
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
  [SERVICE_ACTOR_KEYS.SNAPSHOT]: async (ctx, letter) => letter.reply({...ctx.all()}),
}

const spawnProviders = () => spawn(HANDLERS, SERVICE_ACTOR_KEYS.NAME)

const authn = {
  subscribe: cb => subscriber(SERVICE_ACTOR_KEYS.NAME, spawnProviders, cb),
  snapshot: () => snapshoter(SERVICE_ACTOR_KEYS.NAME, spawnProviders)
}

export default authn
