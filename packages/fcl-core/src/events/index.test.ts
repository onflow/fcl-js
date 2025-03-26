import {SdkTransport} from "@onflow/typedefs"
import {events} from "."
import {subscribe} from "@onflow/sdk"

jest.mock("@onflow/sdk")

describe("events", () => {
  let mockSubscription: jest.Mocked<SdkTransport.Subscription>

  beforeEach(() => {
    mockSubscription = {
      unsubscribe: jest.fn(),
    }

    jest.mocked(subscribe).mockReturnValue(mockSubscription)
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

  /*test("subscribe should pipe the errors to the callback", async () => {
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
  })*/
})
