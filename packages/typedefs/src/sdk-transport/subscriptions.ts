type SchemaItem<TArgs, TData> = {
  args: TArgs
  data: TData
}

export enum SubscriptionTopic {
  PLACEHOLDER = "PLACEHOLDER",
}

export type SubscriptionSchema = {
  [SubscriptionTopic.PLACEHOLDER]: SchemaItem<
    {},
    {
      placeholder: string
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
