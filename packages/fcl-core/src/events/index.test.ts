import {Subscription} from "@onflow/typedefs"
import {events} from "."
import {subscribe, SubscriptionsNotSupportedError} from "@onflow/sdk"
import {events as legacyEvents} from "./legacy-events"

jest.mock("@onflow/sdk")
jest.mock("./legacy-events")

describe("events", () => {
  let mockSubscription: jest.Mocked<Subscription>
  let mockLegacySubscribeObject: jest.Mocked<{subscribe: () => void}>
  let mockLegacyUnsubscribe: jest.MockedFunction<() => void>

  beforeEach(() => {
    mockSubscription = {
      unsubscribe: jest.fn(),
    }
    mockLegacyUnsubscribe = jest.fn()
    mockLegacySubscribeObject = {
      subscribe: jest.fn().mockReturnValue(mockLegacyUnsubscribe),
    }

    jest.mocked(subscribe).mockReturnValue(mockSubscription)
    jest.mocked(legacyEvents).mockReturnValue(mockLegacySubscribeObject)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test("subscribe should call subscribe with the correct arguments", () => {
    const filter = {eventTypes: ["A"]}

    events(filter).subscribe(() => {})

    expect(subscribe).toHaveBeenCalledWith({
      topic: "events",
      args: filter,
      onData: expect.any(Function),
      onError: expect.any(Function),
    })
  })

  test("should work with a string", () => {
    events("A").subscribe(() => {})
    expect(subscribe).toHaveBeenCalledWith({
      topic: "events",
      args: {eventTypes: ["A"]},
      onData: expect.any(Function),
      onError: expect.any(Function),
    })
  })

  test("should work with empty args", () => {
    events().subscribe(() => {})
    expect(subscribe).toHaveBeenCalledWith({
      topic: "events",
      args: {},
      onData: expect.any(Function),
      onError: expect.any(Function),
    })
  })

  test("subscribe should pipe the events to the callback", async () => {
    const filter = {eventTypes: ["A"]}
    const callback = jest.fn()

    const mockEvents = [{type: "A"}, {type: "B"}] as any[]

    jest.mocked(subscribe).mockImplementation(({onData}) => {
      mockEvents.forEach(event => onData(event))
      return mockSubscription
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

    jest.mocked(subscribe).mockImplementation(({onError}) => {
      onError(mockError)
      return mockSubscription
    })

    events(filter).subscribe(callback)
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(callback.mock.calls).toEqual([[null, mockError]])
  })

  test("fallback to legacy polling if subscriptions are not supported", async () => {
    const filter = "A"
    const callback = jest.fn()

    const mockError = new SubscriptionsNotSupportedError()

    jest.mocked(subscribe).mockImplementation(({onError}) => {
      onError(mockError)
      return mockSubscription
    })

    const unsubscribe = events(filter).subscribe(callback)
    await new Promise(resolve => setTimeout(resolve, 0))

    // Check that the callback was called
    expect(callback).toHaveBeenCalledTimes(0)
    expect(subscribe).toHaveBeenCalledTimes(1)

    // Check that legacy polling was called
    expect(legacyEvents).toHaveBeenCalledWith(filter)
    expect(mockLegacySubscribeObject.subscribe).toHaveBeenCalledWith(callback)

    // Unsubscribe
    unsubscribe()
    expect(mockSubscription.unsubscribe).toHaveBeenCalledTimes(1)
    expect(mockLegacyUnsubscribe).toHaveBeenCalledTimes(1)
  })
})
