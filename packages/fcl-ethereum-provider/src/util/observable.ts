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
}

export class AsyncBehaviourSubject