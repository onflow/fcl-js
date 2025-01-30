export type Subscribable<T> = {
  subscribe: (subscriber: Subscriber<T>) => Subscription
}

export class Observable<T> implements Subscribable<T> {
  private _subscribe: (subscriber: Subscriber<T>) => Subscription
  constructor(subscribe: (subscriber: Subscriber<T>) => Subscription) {
    this._subscribe = subscribe
  }

  subscribe(subscriber: Subscriber<T>) {
    return this._subscribe(subscriber)
  }

  pipe<A>(op1: (source: Observable<T>) => Observable<A>): Observable<A>
  pipe<A, B>(
    op1: (source: Observable<T>) => Observable<A>,
    op2: (source: Observable<A>) => Observable<B>
  ): Observable<B>
  pipe<A, B, C>(
    op1: (source: Observable<T>) => Observable<A>,
    op2: (source: Observable<A>) => Observable<B>,
    op3: (source: Observable<B>) => Observable<C>
  ): Observable<C>
  pipe<A, B, C, D>(
    op1: (source: Observable<T>) => Observable<A>,
    op2: (source: Observable<A>) => Observable<B>,
    op3: (source: Observable<B>) => Observable<C>,
    op4: (source: Observable<C>) => Observable<D>
  ): Observable<D>
  pipe<A, B, C, D, E>(
    op1: (source: Observable<T>) => Observable<A>,
    op2: (source: Observable<A>) => Observable<B>,
    op3: (source: Observable<B>) => Observable<C>,
    op4: (source: Observable<C>) => Observable<D>,
    op5: (source: Observable<D>) => Observable<E>
  ): Observable<E>
  pipe(
    ...operators: ((input: Observable<any>) => Observable<any>)[]
  ): Observable<any> {
    return operators.reduce(
      (prev, operator) => operator(prev),
      this as Observable<any>
    )
  }
}

export type Subscription = () => void

export type Subscriber<T> = (value: T) => void

export class Subject<T> extends Observable<T> {
  private subscribers: Subscriber<T>[] = []

  constructor() {
    super(subscriber => {
      this.subscribers.push(subscriber)
      return () => {
        this.subscribers = this.subscribers.filter(s => s !== subscriber)
      }
    })
  }

  next(value: T) {
    this.subscribers.forEach(subscriber => subscriber(value))
  }
}

export class BehaviorSubject<T> extends Subject<T> {
  private value: T

  constructor(initialValue: T) {
    super()
    this.value = initialValue
  }

  next(value: T) {
    this.value = value
    super.next(value)
  }

  getValue() {
    return this.value
  }

  subscribe(subscriber: Subscriber<T>): Subscription {
    subscriber(this.value)
    return super.subscribe(subscriber)
  }
}

export function switchMap<T, R>(project: (value: T) => Observable<R>) {
  return (source: Observable<T>): Observable<R> => {
    return new Observable<R>(subscriber => {
      let activeSubscription: Subscription | null = null

      // Define the logic to handle each new value emitted
      const subscription = source.subscribe(value => {
        // Unsubscribe from previous observable (if any)
        if (activeSubscription) {
          activeSubscription()
        }

        // Create a new observable from the current value
        const innerObservable = project(value)

        // Subscribe to the new observable
        activeSubscription = innerObservable.subscribe(subscriber)
      })

      // Return a cleanup function to cancel the subscription
      return () => {
        if (activeSubscription) {
          activeSubscription()
        }
        subscription() // Unsubscribe from the source observable
      }
    })
  }
}

export function map<T, R>(project: (value: T) => R) {
  return (source: Observable<T>): Observable<R> => {
    return new Observable<R>(subscriber => {
      return source.subscribe(value => {
        subscriber(project(value))
      })
    })
  }
}

export function tap<T>(callback: (value: T) => void) {
  return (source: Observable<T>): Observable<T> => {
    return new Observable<T>(subscriber => {
      return source.subscribe(value => {
        callback(value)
        subscriber(value)
      })
    })
  }
}

export function fromPromise<T>(promise: Promise<T>) {
  return new Observable<T>(subscriber => {
    let isCancelled = false
    promise.then(value => {
      if (isCancelled) return
      subscriber(value)
    })

    return () => {
      isCancelled = true
    }
  })
}

export function distinctUntilChanged<T>(source: Observable<T>) {
  return new Observable<T>(subscriber => {
    let lastValue: T | undefined
    return source.subscribe(value => {
      if (value !== lastValue) {
        lastValue = value
        subscriber(value)
      }
    })
  })
}

export function skip<T>(count: number) {
  return (source: Observable<T>): Observable<T> => {
    return new Observable<T>(subscriber => {
      let skipped = 0
      return source.subscribe(value => {
        if (skipped < count) {
          skipped++
          return
        }
        subscriber(value)
      })
    })
  }
}
