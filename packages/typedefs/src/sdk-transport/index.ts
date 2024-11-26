import {SendFn} from "./requests"
import {SubscribeFn} from "./subscriptions"

export type Transport = {
  send: SendFn
  subscribe: SubscribeFn
}

export * from "./subscriptions"
export * from "./requests"
