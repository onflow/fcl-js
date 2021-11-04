import {spawn, subscriber, snapshoter, INIT, SUBSCRIBE, UNSUBSCRIBE} from "@onflow/util-actor"
import {getServices} from "../services"

const NAME = "authn"
const RESULTS = "results"
const SNAPSHOT = "SNAPSHOT"
const UPDATED = "UPDATED"

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
    const services = await getServices({ type: NAME })
    ctx.put(RESULTS, services)
  },
  [SUBSCRIBE]: (ctx, letter) => {
    ctx.subscribe(letter.from)
    ctx.send(letter.from, UPDATED, {...ctx.all()})
  },
  [UNSUBSCRIBE]: (ctx, letter) => ctx.unsubscribe(letter.from),
  [SNAPSHOT]: async (ctx, letter) => letter.reply({...ctx.all()}),
}

const spawnProviders = () => spawn(HANDLERS, NAME)

const authn = {
  subscribe: cb => subscriber(NAME, spawnProviders, cb),
  snapshot: () => snapshoter(NAME, spawnProviders)
}

export default authn
