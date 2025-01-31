/*******************************
 * Core Observable/Types
 *******************************/

export class Observable<T> {
  private _subscribe: (subscriber: Observer<T>) => Subscription

  constructor(subscribe: (subscriber: Observer<T>) => Subscription) {
    this._subscribe = subscribe
  }

  subscribe(observerOrNext: ObserverOrNext<T>): Subscription {
    const observer = normalizeObserver(observerOrNext)
    return this._subscribe(observer)
  }

  /**
   * Pipe overloads — remove error type parameter
   */
  pipe<T1>(op1: (source: Observable<T>) => Observable<T1>): Observable<T1>
  pipe<T1, T2>(
    op1: (source: Observable<T>) => Observable<T1>,
    op2: (source: Observable<T1>) => Observable<T2>
  ): Observable<T2>
  pipe<T1, T2, T3>(
    op1: (source: Observable<T>) => Observable<T1>,
    op2: (source: Observable<T1>) => Observable<T2>,
    op3: (source: Observable<T2>) => Observable<T3>
  ): Observable<T3>
  pipe<T1, T2, T3, T4>(
    op1: (source: Observable<T>) => Observable<T1>,
    op2: (source: Observable<T1>) => Observable<T2>,
    op3: (source: Observable<T2>) => Observable<T3>,
    op4: (source: Observable<T3>) => Observable<T4>
  ): Observable<T4>
  pipe<T1, T2, T3, T4, T5>(
    op1: (source: Observable<T>) => Observable<T1>,
    op2: (source: Observable<T1>) => Observable<T2>,
    op3: (source: Observable<T2>) => Observable<T3>,
    op4: (source: Observable<T3>) => Observable<T4>,
    op5: (source: Observable<T4>) => Observable<T5>
  ): Observable<T5>
  pipe<T1, T2, T3, T4, T5, T6>(
    op1: (source: Observable<T>) => Observable<T1>,
    op2: (source: Observable<T1>) => Observable<T2>,
    op3: (source: Observable<T2>) => Observable<T3>,
    op4: (source: Observable<T3>) => Observable<T4>,
    op5: (source: Observable<T4>) => Observable<T5>,
    op6: (source: Observable<T5>) => Observable<T6>
  ): Observable<T6>

  pipe(
    ...operators: Array<(input: Observable<any>) => Observable<any>>
  ): Observable<any> {
    return operators.reduce(
      (prev, operator) => operator(prev),
      this as Observable<any>
    )
  }
}

export type Subscription = () => void

export type Observer<T> = {
  next: (value: T) => void
  complete?: () => void
  error?: (error: any) => void // In RxJS, `error` is usually typed as `any`
}

// A type for either an Observer<T> or a next callback
export type ObserverOrNext<T> = Observer<T> | ((value: T) => void)

/*******************************
 * Subjects
 *******************************/

export class Subject<T> extends Observable<T> {
  private subscribers: Observer<T>[] = []

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
    this.subscribers.forEach(subscriber => subscriber.complete?.())
    this.subscribers = []
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

  subscribe(observerOrNext: ObserverOrNext<T>): Subscription {
    const observer = normalizeObserver(observerOrNext)
    // Emit the current value immediately
    observer.next(this.value)
    return super.subscribe(observer)
  }
}

/*******************************
 * Operators
 *******************************/

/** switchMap */
export function switchMap<T, R>(
  project: (value: T) => Observable<R>
): (source: Observable<T>) => Observable<R> {
  return (source: Observable<T>) => {
    return new Observable<R>(subscriber => {
      let activeSubscription: Subscription | null = null

      const subscription = source.subscribe({
        next: value => {
          if (activeSubscription) {
            activeSubscription()
          }
          const innerObservable = project(value)
          activeSubscription = innerObservable.subscribe({
            next: subscriber.next.bind(subscriber),
            error: subscriber.error?.bind(subscriber),
            complete: () => {
              activeSubscription = null
            },
          })
        },
        error: subscriber.error?.bind(subscriber),
        complete: subscriber.complete?.bind(subscriber),
      })

      return () => {
        if (activeSubscription) {
          activeSubscription()
        }
        subscription()
      }
    })
  }
}

/** map */
export function map<T, R>(
  project: (value: T) => R
): (source: Observable<T>) => Observable<R> {
  return (source: Observable<T>) => {
    return new Observable<R>(subscriber => {
      return source.subscribe({
        next: value => subscriber.next(project(value)),
        error: subscriber.error?.bind(subscriber),
        complete: subscriber.complete?.bind(subscriber),
      })
    })
  }
}

/** concatMap */
export function concatMap<T, R>(
  project: (value: T) => Observable<R>
): (source: Observable<T>) => Observable<R> {
  return (source: Observable<T>) => {
    return new Observable<R>(subscriber => {
      let activeSubscription: Subscription | null = null

      return source.subscribe({
        next: value => {
          if (activeSubscription) {
            // if there's an active subscription, wait for it to complete
            return
          }
          const innerObservable = project(value)
          activeSubscription = innerObservable.subscribe({
            next: subscriber.next.bind(subscriber),
            error: subscriber.error?.bind(subscriber),
            complete: () => {
              activeSubscription = null
            },
          })
        },
        error: subscriber.error?.bind(subscriber),
        complete: subscriber.complete?.bind(subscriber),
      })
    })
  }
}

/** catchError */
export function catchError<T>(
  handler: (error: any, source: Observable<T>) => Observable<T>
): (source: Observable<T>) => Observable<T> {
  return source => {
    return new Observable<T>(subscriber => {
      return source.subscribe({
        next: subscriber.next,
        error: error => {
          const result = handler(error, source)
          result.subscribe(subscriber)
        },
        complete: subscriber.complete?.bind(subscriber),
      })
    })
  }
}

/** shareReplay */
export function shareReplay<T>(
  bufferSize = 1
): (source: Observable<T>) => Observable<T> {
  return source => {
    let cache: T[] = []
    let hasCompleted = false
    let hasErrored = false
    let cachedError: any = null

    let subscribers: Observer<T>[] = []
    let sourceSubscription: Subscription | null = null

    function subscribeToSource() {
      sourceSubscription = source.subscribe({
        next: (value: T) => {
          cache.push(value)
          if (cache.length > bufferSize) {
            cache.shift()
          }
          subscribers.forEach(sub => sub.next(value))
        },
        error: (err: any) => {
          hasErrored = true
          cachedError = err
          subscribers.forEach(sub => sub.error?.(err))
        },
        complete: () => {
          hasCompleted = true
          subscribers.forEach(sub => sub.complete?.())
        },
      })
    }

    return new Observable<T>(subscriber => {
      // If no source subscription, subscribe now
      if (!sourceSubscription) {
        subscribeToSource()
      }

      // If we've already errored, immediately error this subscriber
      if (hasErrored && cachedError !== null) {
        subscriber.error?.(cachedError)
        return () => {}
      }

      // If the source completed, replay then complete
      if (hasCompleted) {
        // Replay any cached values
        for (const c of cache) {
          subscriber.next(c)
        }
        subscriber.complete?.()
        return () => {}
      }

      subscribers.push(subscriber)
      // Replay the cache
      for (const c of cache) {
        subscriber.next(c)
      }

      return () => {
        subscribers = subscribers.filter(s => s !== subscriber)
      }
    })
  }
}

/** throwError */
export function throwError<T>(error: any): Observable<T> {
  return new Observable<T>(subscriber => {
    subscriber.error?.(error)
    return () => {}
  })
}

/** tap */
export function tap<T>(
  next: (value: T) => void
): (source: Observable<T>) => Observable<T> {
  return source => {
    return new Observable<T>(subscriber => {
      return source.subscribe({
        next: value => {
          next(value)
          subscriber.next(value)
        },
        error: subscriber.error,
        complete: subscriber.complete?.bind(subscriber),
      })
    })
  }
}

/** from (promise) */
export function from<T>(promise: Promise<T>): Observable<T> {
  return new Observable<T>(subscriber => {
    let isCancelled = false

    promise
      .then(value => {
        if (!isCancelled) {
          subscriber.next(value)
          subscriber.complete?.()
        }
      })
      .catch(error => {
        if (!isCancelled) {
          subscriber.error?.(error)
        }
      })

    return () => {
      isCancelled = true
    }
  })
}

/** firstValueFrom */
export async function firstValueFrom<T>(source: Observable<T>): Promise<T> {
  return await new Promise<T>((resolve, reject) => {
    const unsub = source.subscribe({
      next: value => {
        resolve(value)
        // unsub after the first value
        setTimeout(() => unsub(), 0)
      },
      error: reject,
      complete: () => {
        reject(new Error("Observable completed without emitting a value"))
      },
    })
  })
}

/** distinctUntilChanged */
export function distinctUntilChanged<T>(): (
  source: Observable<T>
) => Observable<T> {
  return source => {
    return new Observable<T>(subscriber => {
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
}

/** skip */
export function skip<T>(
  count: number
): (source: Observable<T>) => Observable<T> {
  return source => {
    return new Observable<T>(subscriber => {
      let skipped = 0
      return source.subscribe({
        next: value => {
          if (skipped < count) {
            skipped++
            return
          }
          subscriber.next(value)
        },
        error: subscriber.error?.bind(subscriber),
        complete: subscriber.complete?.bind(subscriber),
      })
    })
  }
}

/** concat */
export function concat<T>(...sources: Observable<T>[]): Observable<T> {
  return new Observable<T>(subscriber => {
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
        complete: () => {
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

/** filter */
export function filter<T>(
  predicate: (value: T) => boolean
): (source: Observable<T>) => Observable<T> {
  return source => {
    return new Observable<T>(subscriber => {
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

/** of */
export function of<T>(value: T): Observable<T> {
  return new Observable<T>(subscriber => {
    subscriber.next(value)
    subscriber.complete?.()
    return () => {}
  })
}

/*******************************
 * Internal utility
 *******************************/

function normalizeObserver<T>(observer: ObserverOrNext<T>): Observer<T> {
  return typeof observer === "function" ? {next: observer} : observer
}
