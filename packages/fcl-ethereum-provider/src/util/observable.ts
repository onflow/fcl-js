export class Observable<T, R = Error> {
  private _subscribe: (subscriber: Observer<T, R>) => Subscription
  constructor(subscribe: (subscriber: Observer<T, R>) => Subscription) {
    this._subscribe = subscribe
  }

  subscribe(next: Observer<T, R>["next"]): Subscription
  subscribe(
    next: Observer<T, R>["next"],
    error: Observer<T, R>["error"]
  ): Subscription
  subscribe(
    next: Observer<T, R>["next"],
    error: Observer<T, R>["error"],
    complete: Observer<T, R>["complete"]
  ): Subscription
  subscribe(subscriber: Observer<T, R>): Subscription
  subscribe(...args: any[]): Subscription {
    const subscriber =
      typeof args[0] === "function"
        ? {next: args[0], error: args[1], complete: args[2]}
        : args[0]

    return this._subscribe(subscriber)
  }

  pipe<T1, R1>(
    op1: (source: Observable<T, R>) => Observable<T1, R1>
  ): Observable<T1, R1>
  pipe<T1, R1, T2, R2>(
    op1: (source: Observable<T, R>) => Observable<T1, R1>,
    op2: (source: Observable<T1, R1>) => Observable<T2, R2>
  ): Observable<T2, R2>
  pipe<T1, R1, T2, R2, T3, R3>(
    op1: (source: Observable<T, R>) => Observable<T1, R1>,
    op2: (source: Observable<T1, R1>) => Observable<T2, R2>,
    op3: (source: Observable<T2, R2>) => Observable<T3, R3>
  ): Observable<T3, R3>
  pipe<T1, R1, T2, R2, T3, R3, T4, R4>(
    op1: (source: Observable<T, R>) => Observable<T1, R1>,
    op2: (source: Observable<T1, R1>) => Observable<T2, R2>,
    op3: (source: Observable<T2, R2>) => Observable<T3, R3>,
    op4: (source: Observable<T3, R3>) => Observable<T4, R4>
  ): Observable<T4, R4>
  pipe<T1, R1, T2, R2, T3, R3, T4, R4, T5, R5>(
    op1: (source: Observable<T, R>) => Observable<T1, R1>,
    op2: (source: Observable<T1, R1>) => Observable<T2, R2>,
    op3: (source: Observable<T2, R2>) => Observable<T3, R3>,
    op4: (source: Observable<T3, R3>) => Observable<T4, R4>,
    op5: (source: Observable<T4, R4>) => Observable<T5, R5>
  ): Observable<T5, R5>
  pipe(
    ...operators: ((input: Observable<any, any>) => Observable<any, any>)[]
  ): Observable<any, any> {
    return operators.reduce(
      (prev, operator) => operator(prev),
      this as Observable<any, any>
    )
  }
}

export type Subscription = () => void

export type Observer<T, R = Error> = {
  next: (value: T) => void
  complete?: () => void
  error?: (error: R) => void
}

export type ObserverOrNext<T, R = Error> = Observer<T, R> | ((value: T) => void)

export class Subject<T, R = Error> extends Observable<T, R> {
  private subscribers: Observer<T, R>[] = []

  constructor() {
    super(subscriber => {
      this.subscribers.push(subscriber)
      return () => {
        this.subscribers = this.subscribers.filter(s => s !== subscriber)
      }
    })
  }

  next(value: T) {
    this.subscribers.forEach(subscriber => subscriber.next(value))
  }

  error(error: any) {
    this.subscribers.forEach(subscriber => subscriber.error?.(error))
  }

  complete() {
    this.subscribers = []
  }
}

export class BehaviorSubject<T, R = Error> extends Subject<T, R> {
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

  subscribe(next: Observer<T, R>["next"]): Subscription
  subscribe(
    next: Observer<T, R>["next"],
    error: Observer<T, R>["error"]
  ): Subscription
  subscribe(
    next: Observer<T, R>["next"],
    error: Observer<T, R>["error"],
    complete: Observer<T, R>["complete"]
  ): Subscription
  subscribe(observer: Observer<T, R>): Subscription
  subscribe(...args: any[]): Subscription {
    const observer =
      typeof args[0] === "function"
        ? {next: args[0], error: args[1], complete: args[2]}
        : args[0]
    observer.next(this.value)
    return super.subscribe(observer)
  }
}

export function switchMap<T1, T2, R>(
  project: (value: T1) => Observable<T2, R>
) {
  return (source: Observable<T1, R>): Observable<T2, R> => {
    return new Observable<T2, R>(subscriber => {
      let activeSubscription: Subscription | null = null

      // Define the logic to handle each new value emitted
      const subscription = source.subscribe(
        value => {
          // Unsubscribe from previous observable (if any)
          if (activeSubscription) {
            activeSubscription()
          }

          // Create a new observable from the current value
          const innerObservable = project(value)

          // Subscribe to the new observable
          activeSubscription = innerObservable.subscribe(subscriber)
        },
        subscriber.error,
        subscriber.complete
      )

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

export function map<T1, T2, R>(project: (value: T1) => T2) {
  return (source: Observable<T1, R>): Observable<T2, R> => {
    return new Observable<T2, R>(subscriber => {
      return source.subscribe(
        value => subscriber.next(project(value)),
        subscriber.error,
        subscriber.complete
      )
    })
  }
}

export function catchError<T, R>(handler: (error: R) => Observable<T, R>) {
  return (source: Observable<T, R>): Observable<T, R> => {
    return new Observable<T, R>(subscriber => {
      return source.subscribe(
        subscriber.next,
        error => {
          const observable = handler(error)
          observable.subscribe(subscriber)
        },
        subscriber.complete
      )
    })
  }
}

export function tap<T, R>(observerOrNext: ObserverOrNext<T, R>) {
  const {next, error, complete} = normalizeObserver(observerOrNext)
  return (source: Observable<T, R>): Observable<T, R> => {
    return new Observable<T, R>(subscriber => {
      return source.subscribe(
        value => {
          next(value)
          subscriber.next(value)
        },
        err => {
          error?.(err)
          subscriber.error?.(err)
        },
        () => {
          complete?.()
          subscriber.complete?.()
        }
      )
    })
  }
}

export function fromPromise<T, R>(promise: Promise<T>) {
  return new Observable<T, R>(subscriber => {
    let isCancelled = false
    promise
      .then(value => {
        if (isCancelled) return
        subscriber.next(value)
      })
      .catch(error => {
        if (isCancelled) return
        console.error("Error in promise", error, subscriber)
        subscriber.error?.(error)
      })

    return () => {
      isCancelled = true
    }
  })
}

export function distinctUntilChanged<T, R>(source: Observable<T, R>) {
  return new Observable<T, R>(subscriber => {
    let lastValue: T | undefined
    return source.subscribe(
      value => {
        if (value !== lastValue) {
          lastValue = value
          subscriber.next(value)
        }
      },
      subscriber.error,
      subscriber.complete
    )
  })
}

export function skip<T, R>(count: number) {
  return (source: Observable<T, R>): Observable<T, R> => {
    return new Observable<T, R>(subscriber => {
      let skipped = 0
      return source.subscribe(
        value => {
          if (skipped < count) {
            skipped++
            return
          }
          subscriber.next(value)
        },
        subscriber.error,
        subscriber.complete
      )
    })
  }
}

// Util functions

function normalizeObserver<T, R>(
  observerOrNext: ObserverOrNext<T, R>
): Observer<T, R> {
  return typeof observerOrNext === "function"
    ? {next: observerOrNext}
    : observerOrNext
}
