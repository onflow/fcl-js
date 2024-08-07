import {RpcClient} from "./rpc-client"
import {RpcError, RpcErrorCode} from "./rpc-error"

describe("rpc client", () => {
  test("request", async () => {
    const a = new RpcClient<any, any>({
      notifications: [],
    })
    const b = new RpcClient<any, any>({
      notifications: [],
    })

    a.on("test", msg => {
      return {hello: msg}
    })

    a.connect({
      send: b.receive.bind(b),
    })
    b.connect({
      send: a.receive.bind(a),
    })

    const result = await b.request("test", {world: "world"})
    expect(result).toEqual({hello: {world: "world"}})
  })

  test("request error", async () => {
    const a = new RpcClient<any, any>({
      notifications: [],
    })
    const b = new RpcClient<any, any>({
      notifications: [],
    })

    a.on("test", async msg => {
      throw new RpcError(RpcErrorCode.INTERNAL_ERROR, "test error")
    })

    a.connect({
      send: b.receive.bind(b),
    })
    b.connect({
      send: a.receive.bind(a),
    })

    try {
      await b.request("test", {})
      fail("should throw")
    } catch (error) {
      expect(error).toBeInstanceOf(RpcError)
      expect(error.code).toBe(RpcErrorCode.INTERNAL_ERROR)
      expect(error.message).toBe("test error")
    }
  })

  test("request method not found", async () => {
    const a = new RpcClient<any, any>({
      notifications: [],
    })
    const b = new RpcClient<any, any>({
      notifications: [],
    })

    a.connect({
      send: b.receive.bind(b),
    })
    b.connect({
      send: a.receive.bind(a),
    })

    try {
      await a.request("foobar", {})
      fail("should throw")
    } catch (error) {
      expect(error).toBeInstanceOf(RpcError)
      expect(error.code).toBe(RpcErrorCode.METHOD_NOT_FOUND)
      expect(error.message).toBe("Method not found: foobar")
    }
  })

  test("notify", async () => {
    const a = new RpcClient<any, any>({
      notifications: ["something"],
    })
    const b = new RpcClient<any, any>({
      notifications: [],
    })

    let subFn = jest.fn()
    a.subscribe("something", subFn)

    a.connect({
      send: b.receive.bind(b),
    })
    b.connect({
      send: a.receive.bind(a),
    })

    b.notify("something", {hello: "world"})

    await new Promise(resolve => setTimeout(resolve, 0))

    expect(subFn).toHaveBeenCalledTimes(1)
    expect(subFn).toHaveBeenCalledWith({hello: "world"})
  })

  test("get notifications", async () => {
    const a = new RpcClient<any, any>({
      notifications: ["something"],
    })
    const b = new RpcClient<any, any>({
      notifications: ["something2"],
    })

    let subFn = jest.fn()
    a.subscribe("something", subFn)

    a.connect({
      send: b.receive.bind(b),
    })
    b.connect({
      send: a.receive.bind(a),
    })

    expect(await a.getAvailableNotifications()).toContain("something2")
    expect(await b.getAvailableNotifications()).toContain("something")
  })

  test("get requests", async () => {
    const a = new RpcClient<any, any>({
      notifications: [],
    })
    const b = new RpcClient<any, any>({
      notifications: [],
    })

    a.on("test", () => ({}))
    b.on("test2", () => ({}))

    a.connect({
      send: b.receive.bind(b),
    })
    b.connect({
      send: a.receive.bind(a),
    })

    expect(await a.getAvailableRequests()).toContain("test2")
    expect(await b.getAvailableRequests()).toContain("test")
  })
})
