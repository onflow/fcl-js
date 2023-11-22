import {Subscribable, Subscription} from "./pub-sub"

/**
 * Used to create a stream of data from a PubSub instance with a callback for the receiver to close the stream.
 */
export class DataStream<T> implements Subscribable<T> {
  constructor(private stream: Subscribable<T>, private closeFn: () => void) {}

  subscribe(
    next?: (value: T) => void,
    error?: (err: any) => void,
    close?: () => void
  ): Subscription {
    return this.stream.subscribe(next, error, close)
  }

  close(): void {
    this.closeFn()
  }

  /**
   * Map the data stream to a new stream of data.
   * @param fn The function to map the data.
   * @returns A new DataStream instance.
   */
  map<R>(fn: (value: T) => R | Promise<R>): DataStream<R> {
    return new DataStream(
      {
        subscribe: (next, error, close) => {
          return this.subscribe(
            async value => {
              next && next(await fn(value))
            },
            error,
            close
          )
        },
      },
      this.closeFn
    )
  }
}
