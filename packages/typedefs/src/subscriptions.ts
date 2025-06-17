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

export type SubscriptionTopic =
  (typeof SubscriptionTopic)[keyof typeof SubscriptionTopic]

export type SubscriptionData<T extends SubscriptionTopic> =
  SubscriptionDataMap[T]

export type RawSubscriptionData<T extends SubscriptionTopic> =
  RawSubscriptionDataMap[T]

export type SubscriptionArgs<T extends SubscriptionTopic> =
  SubscriptionArgsMap[T]

export type Subscription = {
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
