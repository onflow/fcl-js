import {SendFn} from "./send"
import {SubscribeFn} from "./subscribe"

export type Transport = {
  send: SendFn
  subscribe: SubscribeFn
}

export * from "./subscribe"
export * from "./send"
