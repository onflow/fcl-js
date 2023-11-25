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

    const decodedStream = decodeStream(mockStream, mockDecodeResponse)
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

    expect(mockDecodeResponse).toHaveBeenCalledWith({
      dummy: {foo: "bar"},
    })
    expect(mockDecodeResponse).toHaveBeenCalledWith({
      other: {foo: "baz"},
    })

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
})
