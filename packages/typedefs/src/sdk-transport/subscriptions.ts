type SchemaItem<TArgs, TData> = {
  args: TArgs
  data: TData
}

// TODO: PLACEHOLDER - Replace with actual subscription topics
export enum SubscriptionTopic {
  BLOCKS = "blocks",
  FOO = "foo",
}

export type SubscriptionSchema = {
  [SubscriptionTopic.BLOCKS]: SchemaItem<
    {
      start: number
    },
    {
      placeholder: string
    }
  >
  [SubscriptionTopic.FOO]: SchemaItem<
    {
      x: number
    },
    {
      x: string
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
