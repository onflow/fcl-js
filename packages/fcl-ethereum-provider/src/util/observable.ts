export type Observable<T> = {
  subscribe(listener: (value: T) => void): () => void
}

export type Subject<T> = {
  subscribe(listener: (value: T) => void): () => void
  next(value: T): void
  asObservable(): Observable<T>
}

export type BehaviorSubject<T> = {
  subscribe(listener: (value: T) => void): () => void
  next(value: T): void
  getValue(): T
  asObservable(): Observable<T>
}

export function createObservable<T>() {
  const listeners: Array<(value: T) => void> = []
  return {
    subscribe(listener: (value: T) => void) {
      listeners.push(listener)
      return () => {
        const index = listeners.indexOf(listener)
        if (index !== -1) {
          listeners.splice(index, 1)
        }
      }
    },
    next(value: T) {
      listeners.forEach(listener => listener(value))
    },
  }
}

export function createSubject<T>(): Subject<T> {
  const listeners: Array<(value: T) => void> = []
  return {
    subscribe(listener: (value: T) => void) {
      listeners.push(listener)
      return () => {
        const index = listeners.indexOf(listener)
        if (index !== -1) {
          listeners.splice(index, 1)
        }
      }
    },
    next(value) {
      listeners.forEach(listener => listener(value))
    },
    asObservable() {
      return {
        subscribe: this.subscribe,
      }
    },
  }
}

export function createBehaviorSubject<T>(initialValue: T): BehaviorSubject<T> {
  let value = initialValue
  const subject = createSubject<T>()
  return {
    subscribe: subject.subscribe,
    next(newValue) {
      value = newValue
      subject.next(value)
    },
    getValue() {
      return value
    },
    asObservable() {
      return {
        subscribe: this.subscribe,
      }
    },
  }
}
