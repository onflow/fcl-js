export interface SubscriptionHandler<
  T extends {
    Topic: string
    Args: any
    Data: any
    ArgsDto: any
    DataDto: any
  },
> {
  readonly topic: T["Topic"]
  createSubscriber(
    initialArgs: T["Args"],
    onData: (data: T["Data"]) => void,
    onError: (error: Error) => void
  ): DataSubscriber<T["ArgsDto"], T["DataDto"]>
}

export interface DataSubscriber<ArgsDto, DataDto> {
  /**
   * The callback to call when a data is received
   */
  onData(data: DataDto): void

  /**
   * The callback to call when an error is received
   */
  onError(error: Error): void

  /**
   * The arguments to connect or reconnect to the subscription
   */
  getConnectionArgs(): ArgsDto
}

export function createSubscriptionHandler<
  T extends {
    Topic: string
    Args: any
    Data: any
    ArgsDto: any
    DataDto: any
  },
>(handler: SubscriptionHandler<T>): SubscriptionHandler<T> {
  return handler
}
