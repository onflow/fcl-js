import {SendFn} from "./requests"
import {SubscribeFn} from "./subscriptions"

export type Transport = {
  send: SendFn
  subscribe: SubscribeFn
}

export type TransportConfig = {
  node: string
}

export type TransportFactory = (config: TransportConfig) => Transport

export * from "./subscriptions"
export * from "./requests"
