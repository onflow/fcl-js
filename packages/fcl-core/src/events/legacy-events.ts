import {getEventsAtBlockHeightRange} from "@onflow/sdk"
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
import {FCLContext} from "../context"
import {createPartialGlobalFCLContext} from "../context/global"

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

const scheduleTick = async (
  fclContext: Pick<FCLContext, "sdk" | "config">,
  ctx: ActorContext
): Promise<NodeJS.Timeout> => {
  return setTimeout(
    () => ctx.sendSelf(TICK),
    await fclContext.config.get("fcl.eventPollRate", RATE)
  )
}

function createHandlers(
  fclContext: Pick<FCLContext, "sdk" | "config">
): ActorHandlers {
  const HANDLERS: ActorHandlers = {
    [TICK]: async (ctx: ActorContext): Promise<void> => {
      if (!ctx.hasSubs()) return
      let hwm: Block | null = ctx.get(HIGH_WATER_MARK)
      if (hwm == null) {
        ctx.put(HIGH_WATER_MARK, await fclContext.sdk.block())
        ctx.put(TICK, await scheduleTick(fclContext, ctx))
      } else {
        let next: Block = await fclContext.sdk.block()
        ctx.put(HIGH_WATER_MARK, next)
        if (hwm.height < next.height) {
          const data: Event[] = await fclContext.sdk
            .send([
              getEventsAtBlockHeightRange(
                ctx.self(),
                hwm.height + 1,
                next.height
              ),
            ])
            .then(fclContext.sdk.decode)
          for (let d of data) ctx.broadcast(UPDATED, d)
        }
        ctx.put(TICK, await scheduleTick(fclContext, ctx))
      }
    },
    [SUBSCRIBE]: async (ctx: ActorContext, letter: Letter): Promise<void> => {
      if (!ctx.hasSubs()) {
        ctx.put(TICK, await scheduleTick(fclContext, ctx))
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

  return HANDLERS
}

const spawnEvents = (
  fclContext: Pick<FCLContext, "sdk" | "config">,
  key?: string
) => spawn(createHandlers(fclContext), key)

export function createLegacyEvents(
  context: Pick<FCLContext, "sdk" | "config">
) {
  /**
   * @description Subscribe to events
   * @param key A valid event name
   * @returns An object with a subscribe method
   *
   * @example
   * import * as fcl from "@onflow/fcl"
   * fcl.events(eventName).subscribe((event) => console.log(event))
   */
  function legacyEvents(key: string): SubscribeObject {
    return {
      /**
       * @description Subscribe to events
       * @param {Function} callback The callback function
       * @returns {SubscriptionCallback}
       */
      subscribe: callback =>
        subscriber(key, address => spawnEvents(context, address), callback),
    }
  }

  return legacyEvents
}
