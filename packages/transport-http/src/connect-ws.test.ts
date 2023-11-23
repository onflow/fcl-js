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
    let mockWs: any
    let mockWebSocket: any
    let connection: ReturnType<typeof connectWs>
    beforeEach(() => {
      mockWs = {
        onmessage: () => {},
        onopen: () => {},
        onclose: () => {},
        onerror: () => {},
        close: jest.fn(() => {
          mockWs.onclose()
        }),
      }
      mockWebSocket = jest.fn().mockReturnValue(mockWs)
      jest.spyOn(WebSocketModule, "WebSocket").mockImplementation(mockWebSocket)

      connection = connectWs({
        hostname: "http://example.com",
        path: "/events",
        params: {a: "b"},
      })
    })

    test("should connect to the websocket", () => {
      expect(mockWebSocket).toHaveBeenCalledWith("ws://example.com/events?a=b")
    })

    test("should emit data events", () => {
      const mockListener = jest.fn()
      connection.on("data", mockListener)
      mockWs.onmessage({data: '{"foo": "bar"}'})
      expect(mockListener).toHaveBeenCalledWith({foo: "bar"})
    })

    test("should emit open events", () => {
      const mockListener = jest.fn()
      connection.on("open", mockListener)
      mockWs.onopen()
      expect(mockListener).toHaveBeenCalled()
    })

    test("should emit close events", () => {
      const mockListener = jest.fn()
      connection.on("close", mockListener)
      mockWs.onclose()
      expect(mockListener).toHaveBeenCalled()
    })

    test("should emit error events", () => {
      const mockListener = jest.fn()
      connection.on("error", mockListener)
      mockWs.onerror("error")
      expect(mockListener).toHaveBeenCalledWith("error")
    })

    test("should remove listeners when closed", async () => {
      const mockListener = jest.fn()
      connection.on("data", mockListener)
      connection.close()

      await new Promise(resolve => setTimeout(resolve, 0))

      mockWs.onmessage({data: '{"foo": "bar"}'})

      expect(mockListener).not.toHaveBeenCalled()
    })
  })
})
