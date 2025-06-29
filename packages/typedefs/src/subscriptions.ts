import {
  AccountStatusEvent,
  Block,
  BlockDigest,
  BlockHeader,
  Event,
  EventFilter,
  TransactionExecutionStatus,
  TransactionStatus,
} from "."

export const SubscriptionTopic = {
  BLOCKS: "blocks",
  BLOCK_HEADERS: "block_headers",
  BLOCK_DIGESTS: "block_digests",
  ACCOUNT_STATUSES: "account_statuses",
  TRANSACTION_STATUSES: "transaction_statuses",
  EVENTS: "events",
} as const
/**
 * Represents different topics that can be subscribed to for real-time data from the Flow blockchain
 */
export type SubscriptionTopic =
  (typeof SubscriptionTopic)[keyof typeof SubscriptionTopic]

/**
 * The data returned by a subscription, which will vary depending on the topic
 */
export type SubscriptionData<T extends SubscriptionTopic> =
  SubscriptionDataMap[T]

/**
 * Raw data returned by a subscription, which will vary depending on the topic and is not decoded
 */
export type RawSubscriptionData<T extends SubscriptionTopic> =
  RawSubscriptionDataMap[T]

/**
 * Arguments for a subscription, which will vary depending on the topic
 */
export type SubscriptionArgs<T extends SubscriptionTopic> =
  SubscriptionArgsMap[T]

/**
 * A subscription object that allows managing the subscription lifecycle
 */
export type Subscription = {
  /**
   * Function to unsubscribe from the subscription
   */
  unsubscribe: () => void
}

type SubscriptionArgsMap = {
  [SubscriptionTopic.BLOCKS]: BlockSubscriptionArgs
  [SubscriptionTopic.BLOCK_HEADERS]: BlockSubscriptionArgs
  [SubscriptionTopic.BLOCK_DIGESTS]: BlockSubscriptionArgs
  [SubscriptionTopic.ACCOUNT_STATUSES]: AccountStatusSubscriptionArgs
  [SubscriptionTopic.TRANSACTION_STATUSES]: TransactionStatusSubscriptionArgs
  [SubscriptionTopic.EVENTS]: EventSubscriptionArgs
}

type SubscriptionDataMap = {
  [SubscriptionTopic.EVENTS]: Event
  [SubscriptionTopic.BLOCKS]: Block
  [SubscriptionTopic.BLOCK_HEADERS]: BlockHeader
  [SubscriptionTopic.BLOCK_DIGESTS]: BlockHeader
  [SubscriptionTopic.ACCOUNT_STATUSES]: AccountStatusEvent
  [SubscriptionTopic.TRANSACTION_STATUSES]: TransactionStatus
}

type RawSubscriptionDataMap = {
  [SubscriptionTopic.EVENTS]: {
    event: Omit<Event, "data"> & {
      payload: {
        type: string
        value: any
      }
    }
  }
  [SubscriptionTopic.BLOCKS]: {
    block: Block
  }
  [SubscriptionTopic.BLOCK_HEADERS]: {
    blockHeader: BlockHeader
  }
  [SubscriptionTopic.BLOCK_DIGESTS]: {
    blockDigest: BlockDigest
  }
  [SubscriptionTopic.ACCOUNT_STATUSES]: {
    accountStatusEvent: Omit<Event, "data" | "blockTimestamp"> & {
      payload: {
        type: string
        value: any
      }
      accountAddress: string
    }
  }
  [SubscriptionTopic.TRANSACTION_STATUSES]: {
    transactionStatus: {
      blockId: string
      status: TransactionExecutionStatus
      statusString: string
      statusCode: 0 | 1
      errorMessage: string
      events: {
        type: string
        transactionId: string
        transactionIndex: number
        eventIndex: number
        payload: {
          type: string
          value: any
        }
      }[]
    }
  }
}

type BlockSubscriptionArgs =
  | {
      blockStatus: "finalized" | "sealed"
      startBlockId?: string
    }
  | {
      blockStatus: "finalized" | "sealed"
      startBlockHeight?: number
    }

type AccountStatusSubscriptionArgs = {
  startBlockId?: string
  startBlockHeight?: number
  eventTypes?: string[]
  addresses?: string[]
  accountAddresses?: string[]
}

type TransactionStatusSubscriptionArgs = {
  transactionId: string
}

type EventSubscriptionArgs = EventFilter
