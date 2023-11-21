export type Operator<T, R, S extends Subscribable<R> = Subscribable<R>> = (
  source: Subscribable<T>
) => S
export interface Subscriber<T> {
  next?: (value: T) => void
  error?: (err: any) => void
  complete?: () => void
}

export interface Subscription {
  unsubscribe: () => void
}

export interface Subscribable<T> {
  subscribe: (
    next?: (value: T) => void,
    error?: (err: any) => void,
    complete?: () => void
  ) => Subscription
}

/**
 * Non-blocking pub-sub implementation.  Observers are notified after the event loop flushes.
 */
export class PubSub<T> implements Subscribable<T> {
  private observers: Subscriber<T>[] = []

  subscribe(
    next?: (value: T) => void,
    error?: (err: any) => void,
    complete?: () => void
  ): Subscription {
    const observer: Subscriber<T> = {next, error, complete}
    this.observers.push(observer)

    return {
      unsubscribe: () => {
        const index = this.observers.indexOf(observer)
        if (index > -1) {
          this.observers.splice(index, 1)
        }
      },
    }
  }

  next(data: T, sync = false) {
    this.observers.forEach(observer =>
      this.publish("next", observer, sync, data)
    )
  }

  error(err: any, sync = false) {
    this.observers.forEach(observer =>
      this.publish("error", observer, sync, err)
    )
    this.observers = []
  }

  /**
   *
   * @param sync
   */
  complete(sync = false) {
    this.observers.forEach(observer => this.publish("complete", observer, sync))
    this.observers = []
  }

  /**
   * Returns the number of subscribers connected to the PubSub instance.
   */
  get subscriberCount() {
    return this.observers.length
  }

  private publish<V extends keyof Subscriber<T>>(
    channel: V,
    observer: Subscriber<T>,
    sync: boolean,
    ...args: Parameters<NonNullable<Subscriber<T>[V]>>
  ) {
    const deliverMessage = () => {
      if (!this.observers.includes(observer)) return
      observer[channel]?.apply(observer, args as any)
    }

    if (sync) return deliverMessage()
    setTimeout(deliverMessage, 0)
  }
}
