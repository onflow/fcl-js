import {
  Block,
  BlockDigest,
  BlockHeader,
  Transaction,
  TransactionExecutionStatus,
} from ".."

export type SubscriptionSchema = {
  [SubscriptionTopic.BLOCKS]: SchemaItem<
    BlockArgs,
    {
      block: Block
    }
  >
  [SubscriptionTopic.BLOCK_DIGESTS]: SchemaItem<
    BlockArgs,
    {
      blockDigest: BlockDigest
    }
  >
  [SubscriptionTopic.TRANSACTION_STATUSES]: SchemaItem<
    Transaction,
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
  [SubscriptionTopic.BLOCK_HEADERS]: SchemaItem<
    BlockArgs,
    {
      blockHeader: BlockHeader
    }
  >
}

export enum SubscriptionTopic {
  BLOCKS = "blocks",
  BLOCK_DIGESTS = "block_digests",
  TRANSACTION_STATUSES = "transaction_statuses",
  BLOCK_HEADERS = "block_headers",
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
) => Promise<Subscription>

type RawEvent = {
  type: string
  transactionId: string
  transactionIndex: number
  eventIndex: number
  payload: any
}
