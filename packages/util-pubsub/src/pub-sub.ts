export type Operator<T, R, S extends Subscribable<R> = Subscribable<R>> = (
  source: Subscribable<T>
) => S
export class Subscriber<T> {
  private nextMutex = Promise.resolve()
  private errorMutex = Promise.resolve()
  private completeMutex = Promise.resolve()

  constructor(
    private readonly _next?: (value: T) => void | Promise<void>,
    private readonly _error?: (err: any) => void | Promise<void>,
    private readonly _complete?: () => void | Promise<void>
  ) {}

  next(value: T) {
    setTimeout(() => {
      this.nextMutex = deliverMessage()
    }, 0)

    const deliverMessage = async () => {
      await this.nextMutex
      if (this._next) await this._next(value)
    }
  }

  error(err: any) {
    setTimeout(() => {
      this.errorMutex = deliverMessage()
    }, 0)

    const deliverMessage = async () => {
      await this.errorMutex
      if (this._error) await this._error(err)
    }
  }

  complete() {
    setTimeout(() => {
      this.completeMutex = deliverMessage()
    }, 0)

    const deliverMessage = async () => {
      await this.completeMutex
      if (this._complete) await this._complete()
    }
  }
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
    next?: (value: T) => void | Promise<void>,
    error?: (err: any) => void | Promise<void>,
    complete?: () => void | Promise<void>
  ): Subscription {
    const observer: Subscriber<T> = new Subscriber(next, error, complete)
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
    this.observers.forEach(observer => observer.next(data))
  }

  error(err: any, sync = false) {
    this.observers.forEach(observer => observer.error(err))
    this.observers = []
  }

  /**
   *
   * @param sync
   */
  complete(sync = false) {
    this.observers.forEach(observer => observer.complete())
    this.observers = []
  }

  /**
   * Returns the number of subscribers connected to the PubSub instance.
   */
  get subscriberCount() {
    return this.observers.length
  }
}
