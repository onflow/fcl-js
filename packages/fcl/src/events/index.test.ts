import {EventStream} from "@onflow/typedefs"
import {events} from "."
import * as sdk from "@onflow/sdk"

describe("events", () => {
  let sendSpy
  let decodeSpy
  let subscribeEventsSpy
  let mockEventsStream: EventStream

  beforeEach(() => {
    mockEventsStream = {
      on: jest.fn(() => mockEventsStream),
      off: jest.fn(() => mockEventsStream),
      close: jest.fn(),
    }

    sendSpy = jest.spyOn(sdk, "send")
    decodeSpy = jest.spyOn(sdk, "decode")
    subscribeEventsSpy = jest.spyOn(sdk, "subscribeEvents")

    sendSpy.mockReturnValue(Promise.resolve(mockEventsStream))
    decodeSpy.mockImplementation(async x => x)
    subscribeEventsSpy.mockImplementation(async x => x)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test("subscribe should call send with the subscribeEvents ix", () => {
    const filter = {eventTypes: ["A"]}
    events(filter).subscribe(() => {})
    expect(sendSpy).toHaveBeenCalledWith([sdk.subscribeEvents(filter)])
  })

  test("should work with a string", () => {
    events("A").subscribe(() => {})
    expect(sendSpy).toHaveBeenCalledWith([
      sdk.subscribeEvents({eventTypes: ["A"]}),
    ])
  })

  test("should work with empty args", () => {
    events().subscribe(() => {})
    expect(sendSpy).toHaveBeenCalledWith([sdk.subscribeEvents({})])
  })

  test("subscribe should pipe the events to the callback", async () => {
    const filter = {eventTypes: ["A"]}
    const callback = jest.fn()

    const mockEvents = [{type: "A"}, {type: "B"}]

    mockEventsStream.on.mockImplementation((event, cb) => {
      if (event === "events") {
        cb(mockEvents)
      }
      return mockEventsStream
    })

    events(filter).subscribe(callback)
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(callback.mock.calls).toEqual([
      [mockEvents[0], null],
      [mockEvents[1], null],
    ])
  })

  test("subscribe should pipe the errors to the callback", async () => {
    const filter = {eventTypes: ["A"]}
    const callback = jest.fn()

    const mockError = new Error("mock error")

    mockEventsStream.on.mockImplementation((event, cb) => {
      if (event === "error") {
        cb(mockError)
      }
      return mockEventsStream
    })

    events(filter).subscribe(callback)
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(callback.mock.calls).toEqual([[null, mockError]])
  })
})
