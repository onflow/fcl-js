import {
  SubscriptionTopic,
  SubscriptionData,
  SubscriptionArgs,
  RawSubscriptionData,
} from "@onflow/typedefs"

export type SubscribeParams<T extends SubscriptionTopic> = {
  /**
   * The topic to subscribe to.
   */
  topic: T
  /**
   * The arguments for the subscription.
   */
  args: SubscriptionArgs<T>
  /**
   * The callback to call when data is received.
   */
  onData: (data: SubscriptionData<T>) => void
  /**
   * The callback to call when a fatal error occurs.
   */
  onError: (error: Error) => void
}

export type SubscribeRawParams<T extends SubscriptionTopic> = {
  /**
   * The topic to subscribe to.
   */
  topic: T
  /**
   * The arguments for the subscription.
   */
  args: SubscriptionArgs<T>
  /**
   * The callback to call when data is received.
   */
  onData: (data: RawSubscriptionData<T>) => void
  /**
   * The callback to call when a fatal error occurs.
   */
  onError: (error: Error) => void
}
