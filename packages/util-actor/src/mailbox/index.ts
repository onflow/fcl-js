export interface IMailbox<T> {
  deliver(msg: T): Promise<void>
  receive(): Promise<T>
}
export const mailbox = <T>(): IMailbox<T> => {
  const queue: T[] = []
  let next: ((msg: T) => void) | undefined

  return {
    async deliver(msg: T) {
      queue.push(msg)
      if (next) {
        next(queue.shift() as T)
        next = undefined
      }
    },

    receive(): Promise<T> {
      return new Promise<T>(function innerReceive(resolve) {
        const msg = queue.shift()
        if (msg) return resolve(msg)
        next = resolve
      })
    },
  }
}
