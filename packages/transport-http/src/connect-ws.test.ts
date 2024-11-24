import {buildConnectionUrl, connectWs} from "./connect-ws"
import * as WebSocketModule from "./websocket"

describe("connectWs", () => {
  describe("buildConnectionUrl", () => {
    test("should build http url", () => {
      const url = buildConnectionUrl("http://example.com", "/events", {
        a: "b",
        c: "d",
      })
      expect(url).toEqual("ws://example.com/events?a=b&c=d")
    })

    test("should build https url", () => {
      const url = buildConnectionUrl("https://example.com", "/events", {
        a: "b",
        c: "d",
      })
      expect(url).toEqual("wss://example.com/events?a=b&c=d")
    })

    test("should preserve port", () => {
      const url = buildConnectionUrl("http://example.com:8080", "/events", {
        a: "b",
        c: "d",
      })
      expect(url).toEqual("ws://example.com:8080/events?a=b&c=d")
    })

    test("should build url with no params", () => {
      const url = buildConnectionUrl("http://example.com", "/events")
      expect(url).toEqual("ws://example.com/events")
    })

    test("should build url with no path", () => {
      const url = buildConnectionUrl("http://example.com")
      expect(url).toEqual("ws://example.com/")
    })

    test("should filter out null and undefined params", () => {
      const url = buildConnectionUrl("http://example.com", "/events", {
        a: "b",
        c: null,
        d: undefined,
      })
      expect(url).toEqual("ws://example.com/events?a=b")
    })

    test("should build url with array params", () => {
      const url = buildConnectionUrl("http://example.com", "/events", {
        a: ["b", "c"],
        b: [1, 2],
      })
      expect(url).toEqual("ws://example.com/events?a=b%2Cc&b=1%2C2")
    })
  })

  describe("connectWs", () => {
    let mockWs: {[key: number]: any} // get websocket by connection attempt index
    let mockWebSocket: any // mock implementation of WebSocket (new WebSocket())

    beforeEach(() => {
      const mockWsStub = {
        onmessage: () => {},
        onopen: () => {},
        onclose: () => {},
        onerror: () => {},
        close() {
          return jest
            .fn(() => {
              this.onclose()
              // Prevent handlers from being called after close
              // This is so that we emulate the behavior of the real WebSocket
              // And don't accidentally simulate events on a closed connection
              this.onclose = () => {}
              this.onmessage = () => {}
              this.onopen = () => {}
              this.onerror = () => {}
            })
            .bind(this)()
        },
      }

      let wsIdx = 0
      mockWs = new Proxy({} as any, {
        get(target, name) {
          let idx = Number(name)
          if (!isNaN(idx)) {
            target[idx] = target[idx] || {...mockWsStub}
            return target[idx]
          }
          return null
        },
      })
      mockWebSocket = jest.fn().mockImplementation(() => {
        return mockWs[wsIdx++]
      })
      jest.spyOn(WebSocketModule, "WebSocket").mockImplementation(mockWebSocket)
    })

    test("should connect to the websocket", () => {
      const connection = connectWs({
        hostname: "http://example.com",
        path: "/events",
        params: {a: "b"},
      })
      expect(mockWebSocket).toHaveBeenCalledWith("ws://example.com/events?a=b")
    })

    test("should emit data events", () => {
      const connection = connectWs({
        hostname: "http://example.com",
        path: "/events",
        params: {a: "b"},
      })
      const mockListener = jest.fn()
      connection.on("data", mockListener)
      mockWs[0].onmessage({data: '{"foo": "bar"}'})
      expect(mockListener).toHaveBeenCalledWith({foo: "bar"})
    })

    test("should retry on close", async () => {
      const connection = connectWs({
        hostname: "http://example.com",
        path: "/events",
        params: {a: "b"},
        retryLimit: 1,
        retryIntervalMs: 0,
      })
      const mockCloseListener = jest.fn()
      connection.on("close", mockCloseListener)
      mockWs[0].onclose({
        code: 1006,
        reason: "connection failed",
      })
      await new Promise(resolve => setTimeout(resolve, 0))
      expect(mockCloseListener).not.toHaveBeenCalled()

      mockWs[1].onopen()
      await new Promise(resolve => setTimeout(resolve, 0))
      expect(mockCloseListener).not.toHaveBeenCalled()
      expect(mockWebSocket.mock.calls.length).toEqual(2)
    })

    test("should emit close & error events on final retry", async () => {
      const connection = connectWs({
        hostname: "http://example.com",
        path: "/events",
        params: {a: "b"},
        retryLimit: 1,
        retryIntervalMs: 0,
      })
      const mockCloseListener = jest.fn()
      const mockErrorListener = jest.fn()
      connection.on("close", mockCloseListener)
      connection.on("error", mockErrorListener) // error must be handled so process doesn't exit
      mockWs[0].onclose({
        code: 1006,
        reason: "connection failed",
      })

      // Wait for retry
      await new Promise(resolve => setTimeout(resolve, 10))
      expect(mockCloseListener).not.toHaveBeenCalled()
      expect(mockErrorListener).not.toHaveBeenCalled()

      mockWs[1].onclose({
        code: 1006,
        reason: "connection failed",
      })
      await new Promise(resolve => setTimeout(resolve, 0))
      expect(mockCloseListener).toHaveBeenCalled()
      expect(mockErrorListener).toHaveBeenCalled()
    })

    test("retry count should reset on successful connection", async () => {
      const connection = connectWs({
        hostname: "http://example.com",
        path: "/events",
        params: {a: "b"},
        retryLimit: 1,
        retryIntervalMs: 0,
      })
      const mockCloseListener = jest.fn()
      const mockErrorListener = jest.fn()
      connection.on("close", mockCloseListener)
      connection.on("error", mockErrorListener)

      mockWs[0].onclose({
        code: 1006,
        reason: "connection failed",
      })
      await new Promise(resolve => setTimeout(resolve, 10))
      expect(mockCloseListener).not.toHaveBeenCalled()
      expect(mockErrorListener).not.toHaveBeenCalled()

      mockWs[1].onopen()
      await new Promise(resolve => setTimeout(resolve, 0))

      mockWs[1].onclose({
        code: 1006,
        reason: "connection failed",
      })
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(mockCloseListener).not.toHaveBeenCalled()
      expect(mockErrorListener).not.toHaveBeenCalled()
    })

    test("should remove listeners when closed", async () => {
      const connection = connectWs({
        hostname: "http://example.com",
        path: "/events",
        params: {a: "b"},
      })
      const mockListener = jest.fn()
      connection.on("data", mockListener)
      connection.close()

      await new Promise(resolve => setTimeout(resolve, 10))

      mockWs[0].onmessage({data: '{"foo": "bar"}'})

      expect(mockListener).not.toHaveBeenCalled()
    })

    test("should not retry when closed by user", async () => {
      const connection = connectWs({
        hostname: "http://example.com",
        path: "/events",
        params: {a: "b"},
        retryLimit: 1,
        retryIntervalMs: 0,
      })
      const mockCloseListener = jest.fn()
      connection.on("close", mockCloseListener)
      connection.close()

      await new Promise(resolve => setTimeout(resolve, 10))
      expect(mockCloseListener).toHaveBeenCalled()
      expect(mockWebSocket.mock.calls.length).toEqual(1)
    })
  })
})
