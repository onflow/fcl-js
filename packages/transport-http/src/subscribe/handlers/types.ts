export interface DataConsumer<Data> {
  onData(data: Data): void
  onError(error: Error): void
}

export interface SubscriptionHandler<
  T extends {
    Topic: string
    Args: any
    Data: any
    DataModel: any
    ArgsModel: any
  },
> {
  readonly topic: T["Topic"]
  createSubscriber(
    initialArgs: T["Args"],
    onData: (data: T["Data"]) => void,
    onError: (error: Error) => void
  ): DataSubscriber<T["Args"], T["ArgsModel"], T["DataModel"]>
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
    DataModel: any
    ArgsModel: any
  },
>(handler: SubscriptionHandler<T>): SubscriptionHandler<T> {
  return handler
}

export type BlockArgsModel =
  | {
      block_status?: number
      start_block_id?: string
    }
  | {
      block_status?: number
      start_block_height?: number
    }
