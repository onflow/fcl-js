import {DataStream} from "./data-stream"
describe("data-stream", () => {
  test("should subscribe to a stream", () => {
    const mockPubSub = {
      subscribe: jest.fn(),
    }
    const mockCloseFn = jest.fn()
    const dataStream = new DataStream(mockPubSub, mockCloseFn)
    const mockHandlers = {
      next: jest.fn(),
      error: jest.fn(),
      close: jest.fn(),
    }
    dataStream.subscribe(
      mockHandlers.next,
      mockHandlers.error,
      mockHandlers.close
    )
    expect(mockPubSub.subscribe).toHaveBeenCalledTimes(1)
    expect(mockPubSub.subscribe).toHaveBeenCalledWith(
      mockHandlers.next,
      mockHandlers.error,
      mockHandlers.close
    )
  })

  test("should close a stream", () => {
    const mockPubSub = {
      subscribe: jest.fn(),
    }
    const mockCloseFn = jest.fn()
    const dataStream = new DataStream(mockPubSub, mockCloseFn)
    dataStream.close()
    expect(mockCloseFn).toHaveBeenCalledTimes(1)
  })

  test("should map a stream", () => {
    const mockPubSub = {
      subscribe: jest.fn(),
    }
    const mockCloseFn = jest.fn()
    const dataStream = new DataStream<number>(mockPubSub, mockCloseFn)
    const mockHandlers = {
      next: jest.fn(),
      error: jest.fn(),
      close: jest.fn(),
    }
    const mappedDataStream = dataStream.map(value => value + 1)
    mappedDataStream.subscribe(
      mockHandlers.next,
      mockHandlers.error,
      mockHandlers.close
    )
    expect(mockPubSub.subscribe).toHaveBeenCalledTimes(1)
    expect(mockPubSub.subscribe).toHaveBeenCalledWith(
      expect.any(Function),
      mockHandlers.error,
      mockHandlers.close
    )
    const mockNext = mockPubSub.subscribe.mock.calls[0][0]
    mockNext(1)
    expect(mockHandlers.next).toHaveBeenCalledTimes(1)
    expect(mockHandlers.next).toHaveBeenCalledWith(2)
  })
})
