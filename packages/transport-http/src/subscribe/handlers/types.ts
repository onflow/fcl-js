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
  ): DataSubscriber<T["Args"], T["ArgsDto"], T["DataDto"]>
}

export interface DataSubscriber<Args, ArgsModel, Data> {
  /**
   * The callback to call when a data is received
   */
  sendData(data: Data): void

  /**
   * The callback to call when an error is received
   */
  sendError(error: Error): void

  /**
   * The arguments to connect or reconnect to the subscription
   */
  encodeArgs(args: Args): ArgsModel

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
    ArgsDto: any
    DataDto: any
  },
>(handler: SubscriptionHandler<T>): SubscriptionHandler<T> {
  return handler
}
