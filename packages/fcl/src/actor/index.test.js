import {spawn, send, kill} from "./"

const COUNT = "COUNT"
const DUMP = "DUMP"
const INC = "INC"
const KEYS = "KEYS"
const UPDATED = "UPDATED"
const SUBSCRIBE = "SUBSCRIBE"
const UNSUBSCRIBE = "UNSUBSCRIBE"

const counterLogic = async ctx => {
  ctx.put(COUNT, 0)

  __loop: while (1) {
    const letter = await ctx.receive()
    const data = letter.data

    switch (letter.tag) {
      case SUBSCRIBE:
        ctx.subscribe(letter.from)
        ctx.send(letter.from, UPDATED, ctx.get(COUNT, 0))
        continue __loop

      case UNSUBSCRIBE:
        ctx.unsubscribe(letter.from)
        continue __loop

      case INC:
        ctx.update(COUNT, c => c + (data.delta || 1))
        ctx.broadcast(UPDATED, ctx.get(COUNT, 0))
        continue __loop

      case DUMP:
        letter.reply(ctx.get(COUNT, 0))
        continue __loop

      case KEYS:
        letter.reply(ctx.keys())
        continue __loop

      default:
        console.error("Sad Message recieved by Counter", letter)
    }
  }
}

const counter = name => spawn(counterLogic, name)
const dump = addr => send(addr, DUMP, null, {expectReply: true, timeout: 100})
const inc = (addr, delta = 1) => send(addr, INC, {delta})

const subscribe = (addr, callback) => {
  const EXIT = "@EXIT"
  const self = spawn(async ctx => {
    ctx.send(addr, SUBSCRIBE)
    while (1) {
      const letter = await ctx.receive()
      if (letter.tag === EXIT) {
        ctx.send(addr, UNSUBSCRIBE)
        return
      }
      callback(letter.data)
    }
  })
  return () => send(self, EXIT)
}

// Waits for the v8 MicroTask queue to drain.
// for testing purposes this needs to be run before and after most
// subscribing and unsubscribing tasks.
const idle = async () => new Promise(resolve => setTimeout(resolve, 0))

describe("golden path", () => {
  describe("init, send, receive", () => {
    test("rpc initial value", async () => {
      const c = counter()
      expect(await dump(c)).toBe(0)
      kill(c)
    })

    test("send message and rpc value", async () => {
      const c = counter()
      inc(c, 5)
      expect(await dump(c)).toBe(5)
      kill(c)
    })

    test("named", async () => {
      const c = counter("NAMED")
      expect(c).toBe("NAMED")
      expect(await dump("NAMED")).toBe(0)
      inc(c)
      expect(await dump(c)).toBe(1)
      kill(c)
    })

    test("kvs keys", async () => {
      const c = counter("RPC-KVS-KEYS")
      expect(
        await send(c, KEYS, null, {expectReply: true, timeout: 10})
      ).toEqual([COUNT])
    })
  })

  test("rough reactive subscribers", async () => {
    const c = counter("REACTIVE")

    // Do some work before we subscribe
    inc(c)
    inc(c)

    // Subscribe. Subscribers should be called with broadcast value.
    await idle()
    const fn1 = jest.fn()
    const fn2 = jest.fn()
    const unsub1 = subscribe(c, fn1)
    const unsub2 = subscribe(c, fn2)
    await idle()

    // Do some more work. Every time we do the work subscribers should be called with broadcast value.
    inc(c)
    inc(c)

    // Unsubscribe one of the subscribers. It should no longer receive broadcast values.
    await idle()
    unsub1()
    await idle()

    // Do some more work. Only one of our subscribers should be receiving broadcast values.
    inc(c)
    inc(c)

    // Unsubscribe our other subscriber. Now nothing should be receiving broadcast values.
    await idle()
    unsub2()
    await idle()

    inc(c)
    inc(c)
    await idle()

    expect(fn1).toHaveBeenCalledTimes(3)
    expect(fn1).toHaveBeenNthCalledWith(1, 2)
    expect(fn1).toHaveBeenLastCalledWith(4)

    expect(fn2).toHaveBeenCalledTimes(5)
    expect(fn2).toHaveBeenNthCalledWith(1, 2)
    expect(fn2).toHaveBeenLastCalledWith(6)

    kill(c)
  })

  test("actors with same name only spawn once", async () => {
    const fn = jest.fn()

    const c1 = spawn(fn, "foo")
    const c2 = spawn(fn, "foo")

    await idle()
    expect(c1).toBe(c2)
    expect(fn).toHaveBeenCalledTimes(1)
  })
})
