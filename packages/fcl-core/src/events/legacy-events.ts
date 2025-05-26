import {
  block,
  config,
  decode,
  getEventsAtBlockHeightRange,
  send,
} from "@onflow/sdk"
import type {Block, Event} from "@onflow/typedefs"
import {
  ActorContext,
  ActorHandlers,
  Letter,
  spawn,
  SUBSCRIBE,
  subscriber,
  UNSUBSCRIBE,
} from "@onflow/util-actor"

export interface SubscribeObject {
  /**
   * @description Subscribe to events
   * @param callback The callback function
   * @returns A function to unsubscribe
   */
  subscribe: (
    callback: (data: Event | null, error: Error | null) => void
  ) => () => void
}

const RATE: number = 10000
const UPDATED: string = "UPDATED"
const TICK: string = "TICK"
const HIGH_WATER_MARK: string = "hwm"

const scheduleTick = async (ctx: ActorContext): Promise<NodeJS.Timeout> => {
  return setTimeout(
    () => ctx.sendSelf(TICK),
    await config().get("fcl.eventPollRate", RATE)
  )
}

const HANDLERS: ActorHandlers = {
  [TICK]: async (ctx: ActorContext): Promise<void> => {
    if (!ctx.hasSubs()) return
    let hwm: Block | null = ctx.get(HIGH_WATER_MARK)
    if (hwm == null) {
      ctx.put(HIGH_WATER_MARK, await block())
      ctx.put(TICK, await scheduleTick(ctx))
    } else {
      let next: Block = await block()
      ctx.put(HIGH_WATER_MARK, next)
      if (hwm.height < next.height) {
        const data: Event[] = await send([
          getEventsAtBlockHeightRange(ctx.self(), hwm.height + 1, next.height),
        ]).then(decode)
        for (let d of data) ctx.broadcast(UPDATED, d)
      }
      ctx.put(TICK, await scheduleTick(ctx))
    }
  },
  [SUBSCRIBE]: async (ctx: ActorContext, letter: Letter): Promise<void> => {
    if (!ctx.hasSubs()) {
      ctx.put(TICK, await scheduleTick(ctx))
    }
    ctx.subscribe(letter.from)
  },
  [UNSUBSCRIBE]: (ctx: ActorContext, letter: Letter): void => {
    ctx.unsubscribe(letter.from)
    if (!ctx.hasSubs()) {
      clearTimeout(ctx.get(TICK))
      ctx.delete(TICK)
      ctx.delete(HIGH_WATER_MARK)
    }
  },
}

const spawnEvents = (key?: string): string => spawn(HANDLERS, key)

/**
 * @description Subscribe to events
 * @param key A valid event name
 * @returns An object with a subscribe method
 *
 * @example
 * import * as fcl from "@onflow/fcl"
 * fcl.events(eventName).subscribe((event) => console.log(event))
 */
export function events(key: string): SubscribeObject {
  return {
    /**
     * @description Subscribe to events
     * @param {Function} callback The callback function
     * @returns {SubscriptionCallback}
     */
    subscribe: callback => subscriber(key, spawnEvents, callback),
  }
}
