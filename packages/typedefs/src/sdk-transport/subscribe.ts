import {
  Subscription,
  SubscriptionArgs,
  SubscriptionData,
  SubscriptionTopic,
} from "../subscriptions"

export type SubscribeFn = <T extends SubscriptionTopic>(
  params: {
    topic: T
    args: SubscriptionArgs<T>
    onData: (data: SubscriptionData<T>) => void
    onError: (error: Error) => void
  },
  opts: {node: string}
) => Subscription
