import {EventEmitter} from "stream"
import {decodeStream} from "./decode-stream"
import {StreamConnection} from "@onflow/typedefs"
import * as decodeResponseModule from "./decode"

describe("decode stream", () => {
  let mockStream: StreamConnection<{data: any}>
  let emitter: EventEmitter
  let mockDecodeResponse

  beforeEach(() => {
    mockDecodeResponse = jest.fn()
    jest
      .spyOn(decodeResponseModule, "decodeResponse")
      .mockImplementation(mockDecodeResponse)
    emitter = new EventEmitter()
    mockStream = {
      on: jest.fn((event, callback) => {
        emitter.on(event, callback)
      }) as any,
      off: jest.fn((event, callback) => {
        emitter.off(event, callback)
      }) as any,
      close: jest.fn(),
    }
  })

  test("data is mapped to decoded data per channel for non-null values", async () => {
    const originalData = {
      dummy: {foo: "bar"},
      other: {foo: "baz"},
      nullExample: null,
    }
    const decodedData = {
      dummy: {foo2: "bar2"},
      other: {foo2: "baz2"},
    }
    mockDecodeResponse.mockImplementation(response => {
      if (response.dummy) {
        return decodedData.dummy
      } else if (response.other) {
        return decodedData.other
      } else {
        throw new Error("unexpected response")
      }
    })

    const customDecoders = {
      foo: jest.fn(),
      bar: jest.fn(),
    }

    const decodedStream = decodeStream(
      mockStream,
      mockDecodeResponse,
      customDecoders
    )
    const dummyCallback = jest.fn(data => {
      expect(data).toEqual(decodedData.dummy)
    })
    const otherCallback = jest.fn(data => {
      expect(data).toEqual(decodedData.other)
    })
    const nullCallback = jest.fn()
    decodedStream.on("dummy", dummyCallback)
    decodedStream.on("other", otherCallback)
    decodedStream.on("nullExample", nullCallback)

    emitter.emit("data", originalData)

    // wait for next tick
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(mockDecodeResponse).toHaveBeenNthCalledWith(
      1,
      {
        dummy: {foo: "bar"},
      },
      customDecoders
    )
    expect(mockDecodeResponse).toHaveBeenNthCalledWith(
      2,
      {
        other: {foo: "baz"},
      },
      customDecoders
    )

    expect(dummyCallback).toHaveBeenCalled()
    expect(otherCallback).toHaveBeenCalled()
    expect(nullCallback).not.toHaveBeenCalled()
  })

  test("data is emitted in order", async () => {
    const incomingData = [{foo: "one"}, {bar: "two"}]
    mockDecodeResponse.mockImplementation(async response => {
      if (response.foo) {
        await new Promise(resolve => setTimeout(resolve, 100))
        return response.foo
      } else if (response.bar) {
        return response.bar
      } else {
        throw new Error("unexpected response")
      }
    })

    const decodedStream = decodeStream(mockStream, mockDecodeResponse)
    const cb = jest.fn()
    decodedStream.on("foo", msg => {
      cb("foo", msg)
    })
    decodedStream.on("bar", msg => {
      cb("bar", msg)
    })

    emitter.emit("data", incomingData[0])
    emitter.emit("data", incomingData[1])

    // Wait for data to be processed
    await new Promise(resolve => setTimeout(resolve, 200))

    expect(cb).toHaveBeenNthCalledWith(1, "foo", "one")
    expect(cb).toHaveBeenNthCalledWith(2, "bar", "two")
  })

  test("each channel is emitted in order", async () => {
    const decodedStream = decodeStream(mockStream, mockDecodeResponse)
    // Data will take time to decode but must arrive before error/close
    mockDecodeResponse.mockImplementation(async response => {
      await new Promise(resolve => setTimeout(resolve, 100))
      return response
    })
    const cb = jest.fn()
    decodedStream.on("foo", msg => {
      cb("foo", msg)
    })
    decodedStream.on("bar", msg => {
      cb("bar", msg)
    })
    decodedStream.on("error", err => {
      cb("error", err)
    })
    decodedStream.on("close", () => {
      cb("close")
    })

    emitter.emit("data", {foo: "one"})
    emitter.emit("error", new Error("error"))
    emitter.emit("data", {bar: "two"})
    emitter.emit("close")

    // Wait for data to be processed
    await new Promise(resolve => setTimeout(resolve, 250))

    expect(cb).toHaveBeenNthCalledWith(1, "foo", {foo: "one"})
    expect(cb).toHaveBeenNthCalledWith(2, "error", new Error("error"))
    expect(cb).toHaveBeenNthCalledWith(3, "bar", {bar: "two"})
    expect(cb).toHaveBeenNthCalledWith(4, "close")
  })
})
