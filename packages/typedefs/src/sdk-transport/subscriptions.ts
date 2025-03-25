import {
  Block,
  BlockDigest,
  BlockHeader,
  Event,
  EventFilter,
  TransactionExecutionStatus,
} from ".."

export type SubscriptionSchema = {
  [SubscriptionTopic.BLOCKS]: SchemaItem<
    BlockArgs,
    {
      block: Block
    }
  >
  [SubscriptionTopic.BLOCK_HEADERS]: SchemaItem<
    BlockArgs,
    {
      blockHeader: BlockHeader
    }
  >
  [SubscriptionTopic.BLOCK_DIGESTS]: SchemaItem<
    BlockArgs,
    {
      blockDigest: BlockDigest
    }
  >
  [SubscriptionTopic.ACCOUNT_STATUSES]: SchemaItem<
    AccountStatusesArgs,
    {
      accountStatus: Omit<Event, "data"> & {
        payload: string
        accountAddress: string
      }
    }
  >
  [SubscriptionTopic.TRANSACTION_STATUSES]: SchemaItem<
    {
      transactionId: string
    },
    {
      transactionStatus: {
        blockId: string
        status: TransactionExecutionStatus
        statusString: string
        statusCode: 0 | 1
        errorMessage: string
        events: Array<RawEvent>
      }
    }
  >
  [SubscriptionTopic.EVENTS]: SchemaItem<
    EventFilter,
    {
      event: Omit<Event, "data"> & {
        payload: string
      }
    }
  >
}

export enum SubscriptionTopic {
  BLOCKS = "blocks",
  BLOCK_HEADERS = "block_headers",
  BLOCK_DIGESTS = "block_digests",
  ACCOUNT_STATUSES = "account_statuses",
  TRANSACTION_STATUSES = "transaction_statuses",
  EVENTS = "events",
}

type BlockArgs =
  | {
      blockStatus: "finalized" | "sealed"
      startBlockId?: string
    }
  | {
      blockStatus: "finalized" | "sealed"
      startBlockHeight?: number
    }

type AccountStatusesArgs = {
  startBlockId?: string
  startBlockHeight?: number
  eventTypes?: string[]
  addresses?: string[]
  accountAddresses?: string[]
}

type SchemaItem<TArgs, TData> = {
  args: TArgs
  data: TData
}

export type SubscriptionArguments<T extends SubscriptionTopic> =
  SubscriptionSchema[T]["args"]
export type SubscriptionData<T extends SubscriptionTopic> =
  SubscriptionSchema[T]["data"]

export type Subscription = {
  unsubscribe: () => void
}

export type SubscribeFn = <T extends SubscriptionTopic>(
  params: {
    topic: T
    args: SubscriptionArguments<T>
    onData: (data: SubscriptionData<T>) => void
    onError: (error: Error) => void
  },
  opts: {node: string}
) => Subscription

type RawEvent = {
  type: string
  transactionId: string
  transactionIndex: number
  eventIndex: number
  payload: any
}
