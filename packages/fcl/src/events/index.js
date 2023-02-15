import {spawn, subscriber, SUBSCRIBE, UNSUBSCRIBE} from "@onflow/util-actor"
import {
  config,
  block,
  getEventsAtBlockHeightRange,
  send,
  decode,
} from "@onflow/sdk"

const RATE = 10000
const UPDATED = "UPDATED"
const TICK = "TICK"
const HIGH_WATER_MARK = "hwm"

const scheduleTick = async ctx => {
  return setTimeout(
    () => ctx.sendSelf(TICK),
    await config().get("fcl.eventPollRate", RATE)
  )
}

const HANDLERS = {
  [TICK]: async ctx => {
    if (!ctx.hasSubs()) return
    let hwm = ctx.get(HIGH_WATER_MARK)
    if (hwm == null) {
      ctx.put(HIGH_WATER_MARK, await block())
      ctx.put(TICK, await scheduleTick(ctx))
    } else {
      let next = await block()
      ctx.put(HIGH_WATER_MARK, next)
      if (hwm.height < next.height) {
        const data = await send([
          getEventsAtBlockHeightRange(ctx.self(), hwm.height + 1, next.height),
        ]).then(decode)
        for (let d of data) ctx.broadcast(UPDATED, d.data)
      }
      ctx.put(TICK, await scheduleTick(ctx))
    }
  },
  [SUBSCRIBE]: async (ctx, letter) => {
    if (!ctx.hasSubs()) {
      ctx.put(TICK, await scheduleTick(ctx))
    }
    ctx.subscribe(letter.from)
  },
  [UNSUBSCRIBE]: (ctx, letter) => {
    ctx.unsubscribe(letter.from)
    if (!ctx.hasSubs()) {
      clearTimeout(ctx.get(TICK))
      ctx.delete(TICK)
      ctx.delete(HIGH_WATER_MARK)
    }
  },
}

const spawnEvents = key => spawn(HANDLERS, key)

/**
 * @typedef {object} Event
 * @property {string} blockId - ID of the block that contains the event.
 * @property {number} blockHeight - Height of the block that contains the event.
 * @property {string} blockTimestamp - The timestamp of when the block was sealed in a DateString format. eg. '2021-06-25T13:42:04.227Z'
 * @property {string} type - A string containing the event name.
 * @property {string} transactionId - Can be used to query transaction information, eg. via a Flow block explorer.
 * @property {number} transactionIndex - Used to prevent replay attacks.
 * @property {number} eventIndex - Used to prevent replay attacks.
 * @property {any} data - The data emitted from the event.
 */

/**
 * @typedef {object} SubscribeObject
 * @property {function} subscribe - The subscribe function.
 */

/**
 * @callback SubscriptionCallback
 * @returns {Event}
 */

/**
 * @description - Subscribe to events
 * @param {string} key - A valid event name
 * @returns {SubscribeObject}
 * 
 * @example
 * import * as fcl from "@onflow/fcl"
 * fcl.events(eventName).subscribe((event) => console.log(event))
 */
export function events(key) {
  return {
    /**
     * @description - Subscribe to events
     * @returns {SubscriptionCallback}
     */
    subscribe: callback => subscriber(key, spawnEvents, callback),
  }
}
