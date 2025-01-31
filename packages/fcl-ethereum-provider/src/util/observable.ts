export class Observable<T, R = Error> {
  private _subscribe: (subscriber: Observer<T, R>) => Subscription
  constructor(subscribe: (subscriber: Observer<T, R>) => Subscription) {
    this._subscribe = subscribe
  }

  subscribe(observerOrNext: ObserverOrNext<T, R>): Subscription {
    const observer = normalizeObserver(observerOrNext)
    return this._subscribe(observer)
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
  pipe<T1, R1, T2, R2, T3, R3, T4, R4, T5, R5, T6, R6>(
    op1: (source: Observable<T, R>) => Observable<T1, R1>,
    op2: (source: Observable<T1, R1>) => Observable<T2, R2>,
    op3: (source: Observable<T2, R2>) => Observable<T3, R3>,
    op4: (source: Observable<T3, R3>) => Observable<T4, R4>,
    op5: (source: Observable<T4, R4>) => Observable<T5, R5>,
    op6: (source: Observable<T5, R5>) => Observable<T6, R6>
  ): Observable<T6, R6>
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
    super(observers => {
      this.subscribers.push(observers)
      return () => {
        this.subscribers = this.subscribers.filter(s => s !== observers)
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

  subscribe(observerOrNext: ObserverOrNext<T, R>): Subscription {
    const observer = normalizeObserver(observerOrNext)
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
      const subscription = source.subscribe({
        next: value => {
          // Unsubscribe from previous observable (if any)
          if (activeSubscription) {
            activeSubscription()
          }

          // Create a new observable from the current value
          const innerObservable = project(value)

          // Subscribe to the new observable
          activeSubscription = innerObservable.subscribe(subscriber)
        },
        error: subscriber.error?.bind(subscriber),
        complete: subscriber.complete?.bind(subscriber),
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

export function map<T1, T2, R>(project: (value: T1) => T2) {
  return (source: Observable<T1, R>): Observable<T2, R> => {
    return new Observable<T2, R>(subscriber => {
      return source.subscribe({
        next: value => subscriber.next(project(value)),
        error: subscriber.error?.bind(subscriber),
        complete: subscriber.complete?.bind(subscriber),
      })
    })
  }
}

export function fromPromise<T, R = Error>(promise: Promise<T>) {
  return new Observable<T, R>(subscriber => {
    let isCancelled = false
    promise
      .then(value => {
        if (isCancelled) return
        subscriber.next(value)
      })
      .catch(error => {
        if (isCancelled) return
        subscriber.error?.(error)
      })

    return () => {
      isCancelled = true
    }
  })
}

export async function firstValueFrom<T, R = Error>(
  source: Observable<T, R>
): Promise<T> {
  return await new Promise((resolve, reject) => {
    const sub = source.subscribe({
      next: value => {
        resolve(value)
        setTimeout(() => {
          sub()
        }, 0)
      },
      error: reject,
      complete: () => {
        reject(new Error("Observable completed without emitting a value"))
      },
    })
  })
}

export function distinctUntilChanged<T, R>(source: Observable<T, R>) {
  return new Observable<T, R>(subscriber => {
    let lastValue: T | undefined
    return source.subscribe({
      next: value => {
        if (value !== lastValue) {
          lastValue = value
          subscriber.next(value)
        }
      },
      error: subscriber.error?.bind(subscriber),
      complete: subscriber.complete?.bind(subscriber),
    })
  })
}

export function concat<T, R>(...sources: Observable<T, R>[]) {
  return new Observable<T, R>(subscriber => {
    let activeSubscription: Subscription | null = null

    function subscribeNext() {
      if (sources.length === 0) {
        subscriber.complete?.()
        return
      }

      const source = sources.shift()!
      activeSubscription = source.subscribe({
        next: subscriber.next.bind(subscriber),
        error: subscriber.error?.bind(subscriber),
        complete() {
          activeSubscription = null
          subscribeNext()
        },
      })
    }

    subscribeNext()

    return () => {
      activeSubscription?.()
    }
  })
}

export function filter<T, R>(predicate: (value: T) => boolean) {
  return (source: Observable<T, R>): Observable<T, R> => {
    return new Observable<T, R>(subscriber => {
      return source.subscribe({
        next: value => {
          if (predicate(value)) {
            subscriber.next(value)
          }
        },
        error: subscriber.error?.bind(subscriber),
        complete: subscriber.complete?.bind(subscriber),
      })
    })
  }
}

export function of<T>(value: T) {
  return new Observable<T>(subscriber => {
    subscriber.next(value)
    subscriber.complete?.()
    return () => {}
  })
}

function normalizeObserver<T, R>(
  observer: ObserverOrNext<T, R>
): Observer<T, R> {
  return typeof observer === "function" ? {next: observer} : observer
}
