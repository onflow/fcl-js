import {Event, Subscription} from "@onflow/typedefs"
import {events} from "."
import {subscribe, SubscriptionsNotSupportedError} from "@onflow/sdk"
import {createLegacyEvents} from "./legacy-events"
import {createGetChainId} from "../utils"

jest.mock("@onflow/sdk")
jest.mock("./legacy-events")
jest.mock("../utils")

describe("events", () => {
  let mockSubscription: jest.Mocked<Subscription>
  let mockLegacySubscribeObject: jest.Mocked<{
    subscribe: (
      callback: (data: Event | null, error: Error | null) => void
    ) => () => void
  }>
  let mockLegacyUnsubscribe: jest.MockedFunction<() => void>
  let legacyEvents: jest.MockedFunction<ReturnType<typeof createLegacyEvents>>
  let mockGetChainId: jest.MockedFunction<() => Promise<string>>

  beforeEach(() => {
    mockSubscription = {
      unsubscribe: jest.fn(),
    }
    mockLegacyUnsubscribe = jest.fn()
    mockLegacySubscribeObject = {
      subscribe: jest.fn().mockReturnValue(mockLegacyUnsubscribe),
    }
    legacyEvents = jest.fn((_: string) => mockLegacySubscribeObject)

    jest.mocked(subscribe).mockReturnValue(mockSubscription)
    jest.mocked(createLegacyEvents).mockReturnValue(legacyEvents)

    // Mock the getChainId function to return "mainnet" by default
    mockGetChainId = jest.fn().mockResolvedValue("mainnet")
    jest.mocked(createGetChainId).mockReturnValue(mockGetChainId)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test("subscribe should call subscribe with the correct arguments", async () => {
    const filter = {eventTypes: ["A"]}

    events(filter).subscribe(() => {})

    // Flush the event loop
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(subscribe).toHaveBeenCalledWith({
      topic: "events",
      args: filter,
      onData: expect.any(Function),
      onError: expect.any(Function),
    })
  })

  test("should work with a string", async () => {
    events("A").subscribe(() => {})

    // Flush the event loop
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(subscribe).toHaveBeenCalledWith({
      topic: "events",
      args: {eventTypes: ["A"]},
      onData: expect.any(Function),
      onError: expect.any(Function),
    })
  })

  test("should work with empty args", async () => {
    events().subscribe(() => {})

    // Flush the event loop
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(subscribe).toHaveBeenCalledWith({
      topic: "events",
      args: {},
      onData: expect.any(Function),
      onError: expect.any(Function),
    })
  })

  test("subscribe should pipe the events to the callback", async () => {
    const filter = {eventTypes: ["A"]}
    const onData = jest.fn()
    const onError = jest.fn()

    const mockEvents = [{type: "A"}, {type: "B"}] as any[]

    jest.mocked(subscribe).mockImplementation(({onData}) => {
      mockEvents.forEach(event => onData(event))
      return mockSubscription
    })

    events(filter).subscribe(onData, onError)

    // Flush the event loop
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(onData.mock.calls).toEqual([[{type: "A"}], [{type: "B"}]])
    expect(onError).not.toHaveBeenCalled()
  })

  test("subscribe should pipe the errors to the callback", async () => {
    const filter = {eventTypes: ["A"]}
    const onData = jest.fn()
    const onError = jest.fn()

    const mockError = new Error("mock error")

    jest.mocked(subscribe).mockImplementation(({onError: _onError}) => {
      _onError(mockError)
      return mockSubscription
    })

    events(filter).subscribe(onData, onError)

    // Flush the event loop
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(onData).not.toHaveBeenCalled()
    expect(onError).toHaveBeenCalledTimes(1)
    expect(onError).toHaveBeenCalledWith(mockError)
  })

  test("fallback to legacy polling if subscriptions are not supported", async () => {
    const filter = "A"
    const onData = jest.fn()
    const onError = jest.fn()

    const mockNotSupportedError = new SubscriptionsNotSupportedError()

    jest.mocked(subscribe).mockImplementation(({onError: _onError}) => {
      _onError(mockNotSupportedError)
      return mockSubscription
    })

    const unsubscribe = events(filter).subscribe(onData, onError)

    // Flush the event loop
    await new Promise(resolve => setTimeout(resolve, 0))

    // Check that the error did not propagate to the onError callback
    expect(onData).not.toHaveBeenCalled()
    expect(onError).not.toHaveBeenCalled()

    // Check that the legacy subscribe was called
    expect(mockLegacySubscribeObject.subscribe).toHaveBeenCalledTimes(1)
    expect(mockLegacyUnsubscribe).not.toHaveBeenCalled()

    // Check that the legacy events were called with the correct filter
    expect(legacyEvents).toHaveBeenCalledWith(filter)
    expect(mockLegacySubscribeObject.subscribe).toHaveBeenCalledWith(
      expect.any(Function)
    )

    // Mock the legacy subscribe to call the onData callback
    const legacyOnData = (
      mockLegacySubscribeObject.subscribe.mock.calls as any
    )[0][0] as jest.Mock
    const mockLegacyEvents = [{type: "A"}, {type: "B"}] as any[]
    mockLegacyEvents.forEach(event => legacyOnData(event))

    // Flush the event loop
    await new Promise(resolve => setTimeout(resolve, 0))

    // Check that the onData callback was called with the legacy events
    expect(onData.mock.calls).toEqual([[{type: "A"}], [{type: "B"}]])
    expect(onError).not.toHaveBeenCalled()
    expect(mockLegacyUnsubscribe).not.toHaveBeenCalled()

    // Unsubscribe
    unsubscribe()

    // Flush the event loop
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(mockSubscription.unsubscribe).toHaveBeenCalledTimes(1)
    expect(mockLegacyUnsubscribe).toHaveBeenCalledTimes(1)
  })

  test("emulator should fallback to legacy polling", async () => {
    const filter = "A"
    const onData = jest.fn()
    const onError = jest.fn()

    // Mock the getChainId to return "local" to simulate the Flow emulator
    mockGetChainId.mockResolvedValue("local")

    events(filter).subscribe(onData, onError)

    // Flush the event loop
    await new Promise(resolve => setTimeout(resolve, 10))

    expect(legacyEvents).toHaveBeenCalledWith(filter)
    expect(mockLegacySubscribeObject.subscribe).toHaveBeenCalledWith(
      expect.any(Function)
    )
  })
})
