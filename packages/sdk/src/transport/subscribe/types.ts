import {
  Block,
  BlockHeader,
  Event,
  SdkTransport,
  TransactionStatus,
} from "@onflow/typedefs"

export type SubscriptionParams<T extends SdkTransport.SubscriptionTopic> =
  SubscribeParams<T>

export type SubscriptionArgs<T extends SdkTransport.SubscriptionTopic> =
  SdkTransport.SubscriptionArguments<T>

export type SubscriptionData<T extends SdkTransport.SubscriptionTopic> =
  SubscriptionDataMap[T]

export type RawSubscriptionData<T extends SdkTransport.SubscriptionTopic> =
  SdkTransport.SubscriptionData<T>

export type SubscriptionDataMap = {
  [SdkTransport.SubscriptionTopic.EVENTS]: Event
  [SdkTransport.SubscriptionTopic.BLOCKS]: Block
  [SdkTransport.SubscriptionTopic.BLOCK_HEADERS]: BlockHeader
  [SdkTransport.SubscriptionTopic.BLOCK_DIGESTS]: BlockHeader
  [SdkTransport.SubscriptionTopic.ACCOUNT_STATUSES]: any
  [SdkTransport.SubscriptionTopic.TRANSACTION_STATUSES]: TransactionStatus
}

export type SubscribeParams<T extends SdkTransport.SubscriptionTopic> = {
  /**
   * The topic to subscribe to.
   */
  topic: T
  /**
   * The arguments for the subscription.
   */
  args: SdkTransport.SubscriptionArguments<T>
  /**
   * The callback to call when data is received.
   */
  onData: (data: SdkTransport.SubscriptionData<T>) => void
  /**
   * The callback to call when a fatal error occurs.
   */
  onError: (error: Error) => void
}

export type RawSubscribeParams<T extends SdkTransport.SubscriptionTopic> = {
  /**
   * The topic to subscribe to.
   */
  topic: T
  /**
   * The arguments for the subscription.
   */
  args: SdkTransport.SubscriptionArguments<T>
  /**
   * The callback to call when data is received.
   */
  onData: (data: RawSubscriptionData<T>) => void
  /**
   * The callback to call when a fatal error occurs.
   */
  onError: (error: Error) => void
}
