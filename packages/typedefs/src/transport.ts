import {Interaction} from "./interaction"
import {
  RawSubscriptionData,
  Subscription,
  SubscriptionArgs,
  SubscriptionTopic,
} from "./subscriptions"

interface InteractionModule {
  isTransaction: (ix: Interaction) => boolean
  isGetTransactionStatus: (ix: Interaction) => boolean
  isGetTransaction: (ix: Interaction) => boolean
  isScript: (ix: Interaction) => boolean
  isGetAccount: (ix: Interaction) => boolean
  isGetEvents: (ix: Interaction) => boolean
  isGetBlock: (ix: Interaction) => boolean
  isGetBlockHeader: (ix: Interaction) => boolean
  isGetCollection: (ix: Interaction) => boolean
  isPing: (ix: Interaction) => boolean
  isGetNetworkParameters: (ix: Interaction) => boolean
  isSubscribeEvents?: (ix: Interaction) => boolean
  isGetNodeVersionInfo?: (ix: Interaction) => boolean
}
interface IContext {
  ix: InteractionModule
}
interface IOptsCommon {
  node?: string
}

interface IOpts extends IOptsCommon {
  sendTransaction?: (
    ix: Interaction,
    context: IContext,
    opts: IOptsCommon
  ) => void
  sendGetTransactionStatus?: (
    ix: Interaction,
    context: IContext,
    opts: IOptsCommon
  ) => void
  sendGetTransaction?: (
    ix: Interaction,
    context: IContext,
    opts: IOptsCommon
  ) => void
  sendExecuteScript?: (
    ix: Interaction,
    context: IContext,
    opts: IOptsCommon
  ) => void
  sendGetAccount?: (
    ix: Interaction,
    context: IContext,
    opts: IOptsCommon
  ) => void
  sendGetEvents?: (
    ix: Interaction,
    context: IContext,
    opts: IOptsCommon
  ) => void
  sendGetBlockHeader?: (
    ix: Interaction,
    context: IContext,
    opts: IOptsCommon
  ) => void
  sendGetCollection?: (
    ix: Interaction,
    context: IContext,
    opts: IOptsCommon
  ) => void
  sendPing?: (ix: Interaction, context: IContext, opts: IOptsCommon) => void
  sendGetBlock?: (ix: Interaction, context: IContext, opts: IOptsCommon) => void
  sendGetNetworkParameters?: (
    ix: Interaction,
    context: IContext,
    opts: IOptsCommon
  ) => void
  connectSubscribeEvents?: (
    ix: Interaction,
    context: IContext,
    opts: IOptsCommon
  ) => void
  sendGetNodeVersionInfo?: (
    ix: Interaction,
    context: IContext,
    opts: IOptsCommon
  ) => void
}

type SubscribeFn = <T extends SubscriptionTopic>(
  params: {
    topic: T
    args: SubscriptionArgs<T>
    onData: (data: RawSubscriptionData<T>) => void
    onError: (error: Error) => void
  },
  opts: {node: string}
) => Subscription

type SendFn = (ix: Interaction, context: IContext, opts: IOpts) => void

export type SdkTransport = {
  send: SendFn
  subscribe: SubscribeFn
}
