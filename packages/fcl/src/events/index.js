import {spawn, subscriber, SUBSCRIBE, UNSUBSCRIBE} from "@onflow/util-actor"
import {config} from "@onflow/config"
export {getEvents} from "@onflow/sdk-build-get-events"
export {getLatestBlock} from "@onflow/sdk-build-get-latest-block"
import {send} from "../send"
import {decode} from "../decode"

const RATE = 10000
const UPDATED = "UPDATED"
const TICK = "TICK"

const currentBlock = async () => {
  return decode(await send([getLatestBlock()]))
}

const scheduleTick = async ctx => {
  return setTimeout(
    () => ctx.sendSelf(TICK),
    await config().get("fcl.eventPollRate", RATE)
  )
}

const HANDLERS = {
  [TICK]: async ctx => {
    if (!ctx.hasSubs()) return
    let hwm = ctx.get("hwm")
    if (hwm == null) {
      ctx.put("hwm", await currentBlock())
      ctx.put("tick", await scheduleTick(ctx))
    } else {
      let next = await currentBlock()
      ctx.put("hwm", next)
      const resp = await send([
        getEvents(ctx.self(), hwm.height, next.height - 1),
      ])
      const data = await decode(resp)
      for (let d of data) ctx.broadcast(UPDATED, d.data)
      ctx.put("tick", await scheduleTick(ctx))
    }
  },
  [SUBSCRIBE]: async (ctx, letter) => {
    if (!ctx.hasSubs()) {
      ctx.put("tick", await scheduleTick(ctx))
    }
    ctx.subscribe(letter.from)
  },
  [UNSUBSCRIBE]: (ctx, letter) => {
    ctx.unsubscribe(letter.from)
    if (!ctx.hasSubs()) {
      clearTimeout(ctx.get("tick"))
      ctx.delete("tick")
      ctx.delete("hwm")
    }
  },
}

const spawnEvents = key => spawn(HANDLERS, key)

export function events(key) {
  return {
    subscribe: callback => subscriber(key, spawnEvents, callback),
  }
}
