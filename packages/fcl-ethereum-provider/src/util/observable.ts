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
        console.log("Unsubscribing from source observable")
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

export function concatMap<T1, T2, R>(
  project: (value: T1) => Observable<T2, R>
) {
  return (source: Observable<T1, R>): Observable<T2, R> => {
    return new Observable<T2, R>(subscriber => {
      let activeSubscription: Subscription | null = null

      return source.subscribe({
        next: value => {
          if (activeSubscription) {
            return
          }

          const innerObservable = project(value)
          activeSubscription = innerObservable.subscribe({
            next: subscriber.next.bind(subscriber),
            error: subscriber.error?.bind(subscriber),
            complete() {
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

export function catchError<T, R>(
  handler: (error: R, source: Observable<T, R>) => Observable<T, R>
) {
  return (source: Observable<T, R>): Observable<T, R> => {
    return new Observable<T, R>(subscriber => {
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

export function shareReplay<T, R>(bufferSize = 1) {
  return (source: Observable<T, R>): Observable<T, R> => {
    // Cache for the last 'bufferSize' values
    let cache: T[] = []
    // Track whether we've seen completion or error
    let hasCompleted = false
    let hasErrored = false
    let cachedError: R | null = null

    // Keep a list of active subscribers to forward new values
    let subscribers: Observer<T, R>[] = []

    // We only subscribe to the source once
    let sourceSubscription: Subscription | null = null

    function subscribeToSource() {
      sourceSubscription = source.subscribe({
        next: (value: T) => {
          // 1) Update our cache
          cache.push(value)
          if (cache.length > bufferSize) {
            cache.shift() // remove oldest to maintain size
          }
          // 2) Push the new value to all current subscribers
          subscribers.forEach(sub => sub.next(value))
        },

        error: (err: R) => {
          hasErrored = true
          cachedError = err
          // Notify all current subscribers of error
          subscribers.forEach(sub => sub.error?.(err))
          // We don’t clear subscribers or cache, so new ones get the error too
        },

        complete: () => {
          hasCompleted = true
          // Notify all current subscribers of completion
          subscribers.forEach(sub => sub.complete?.())
          // No further values will arrive
        },
      })
    }

    return new Observable<T, R>(subscriber => {
      // If this is the first subscriber, we subscribe to the source
      if (!sourceSubscription) {
        subscribeToSource()
      }

      // If the source has already errored out, immediately error the new subscriber
      if (hasErrored && cachedError !== null) {
        subscriber.error?.(cachedError)
        return () => {
          /* Nothing to unsubscribe from in the shareReplay pipeline,
             since we've already erred out */
        }
      }

      // If the source has already completed, immediately complete the new subscriber
      if (hasCompleted) {
        // But first replay any cached values (some shareReplay variants do still replay after completion)
        for (const c of cache) {
          subscriber.next(c)
        }
        subscriber.complete?.()
        return () => {
          /* Nothing to unsubscribe from in the shareReplay pipeline,
             since we've already completed */
        }
      }

      // 1) Add subscriber to the list
      subscribers.push(subscriber)
      // 2) Replay any cached values
      for (const c of cache) {
        subscriber.next(c)
      }

      // Return an unsubscribe function
      return () => {
        subscribers = subscribers.filter(s => s !== subscriber)
      }
    })
  }
}

export function throwError<T, R>(error: R) {
  return new Observable<T, R>(subscriber => {
    subscriber.error?.(error)
    return () => {}
  })
}

export function tap<T, R>(next: (value: T) => void) {
  return (source: Observable<T, R>): Observable<T, R> => {
    return new Observable<T, R>(subscriber => {
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
        console.log("RESOLVING", {value})
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

export function skip<T, R>(count: number) {
  return (source: Observable<T, R>): Observable<T, R> => {
    return new Observable<T, R>(subscriber => {
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
