export const mailbox = () => {
  const queue = []
  var next

  return {
    async deliver(msg) {
      queue.push(msg)
      if (next) {
        next(queue.shift())
        next = undefined
      }
    },

    receive() {
      return new Promise(function innerReceive(resolve) {
        const msg = queue.shift()
        if (msg) return resolve(msg)
        next = resolve
      })
    },
  }
}
