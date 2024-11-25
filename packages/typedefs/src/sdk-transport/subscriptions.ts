type SchemaItem<TArgs, TData> = {
  args: TArgs
  data: TData
}

export enum SubscriptionTopic {
  EVENTS = "events",
  BLOCKS = "blocks",
}

export type SubscriptionSchema = {
  [SubscriptionTopic.EVENTS]: SchemaItem<
    {
      startBlock: number
      endBlock: number
    },
    {
      type: string
      data: any
    }
  >
  [SubscriptionTopic.BLOCKS]: SchemaItem<
    {
      startBlock: number
      endBlock: number
    },
    {
      type: string
      data: any
    }
  >
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
