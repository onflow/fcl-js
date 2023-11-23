import {events} from "."
import * as sdk from "@onflow/sdk"

test("events", () => {
  let sendSpy
  let decodeSpy
  let subscribeEventsSpy

  beforeEach(() => {
    const mockSubscribeEventsIx = {}
    const mockEventsStream: SubscribeEventsStream = {}

    sendSpy = jest.spyOn(sdk, "send")
    decodeSpy = jest.spyOn(sdk, "decode")
    subscribeEventsSpy = jest.spyOn(sdk, "subscribeEvents")

    sendSpy.mockReturnValue()
    decodeSpy.mockReturnValue()
    subscribeEventsSpy.mockReturnValue(mockSubscribeEventsIx)
  })

  afterEach(() => {
    sendSpy.mockRestore()
    decodeSpy.mockRestore()
    subscribeEventsSpy.mockRestore()
  })

  test("should call send with subscribeEvents", () => {
    const filter = {eventTypes: ["A"]}
    sdk.events(filter)
    expect(sendSpy).toHaveBeenCalledWith([sdk.subscribeEvents(filter)])
  })

  test("subscribe should pipe the events to the callback", async () => {
    const filter = {eventTypes: ["A"]}
    const callback = jest.fn()
    const stream = {
      on: jest.fn(),
    }
    const streamPromise = Promise.resolve(stream)
    sendSpy.mockReturnValueOnce(streamPromise)
    decodeSpy.mockReturnValueOnce(stream)
    events(filter).subscribe(callback)
    await streamPromise
    expect(stream.on).toHaveBeenCalledWith("events", expect.any(Function))
    const onEvents = stream.on.mock.calls[0][1]
    const event = {type: "A"}
    onEvents(event)
    expect(callback).toHaveBeenCalledWith(event, null)
  })

  test("subscribe should pipe the errors to the callback", async () => {})
})
