export interface DataConsumer<Data> {
  onData(data: Data): void
  onError(error: Error): void
}

export interface SubscriptionHandler<
  T extends {
    Topic: string
    Args: any
    Data: any
    RawData: any
  },
> {
  readonly topic: T["Topic"]
  createSubscriber(
    initialArgs: T["Args"],
    onData: (data: T["Data"]) => void,
    onError: (error: Error) => void
  ): DataSubscriber<T["Args"], T["RawData"]>
}

export interface DataSubscriber<Args, RawData> {
  /**
   * The callback to call when a data is received
   */
  sendData(data: RawData): void

  /**
   * The callback to call when an error is received
   */
  sendError(error: Error): void

  /**
   * Get the arguments to connect or reconnect to the subscription
   */
  get connectionArgs(): Args
}

export function createSubscriptionHandler<
  T extends {
    Topic: string
    Args: any
    Data: any
    RawData: any
  },
>(handler: SubscriptionHandler<T>): SubscriptionHandler<T> {
  return handler
}
