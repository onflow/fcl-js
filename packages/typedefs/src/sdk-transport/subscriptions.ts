import {Block, BlockDigest, BlockHeader, Event, EventFilter} from ".."

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
