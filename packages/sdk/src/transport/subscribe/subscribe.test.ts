import {SdkTransport} from "@onflow/typedefs"
import {subscribe} from "./subscribe"
import {rawSubscribe} from "./raw-subscribe"

jest.mock("./raw-subscribe")
const mockRawSubscribe = jest.mocked(rawSubscribe)

describe("subscribe", () => {
  let mockSub: jest.Mocked<SdkTransport.Subscription> = {
    unsubscribe: jest.fn(),
  }

  beforeEach(() => {
    jest.resetAllMocks()
    mockRawSubscribe.mockResolvedValue(mockSub)
  })

  test("subscribes to a topic and returns a subscription", async () => {
    const topic = "topic" as SdkTransport.SubscriptionTopic
    const args = {foo: "bar"} as SdkTransport.SubscriptionArguments<any>
    const onData = jest.fn()
    const onError = jest.fn()

    const sub = await subscribe({
      topic,
      args,
      onData,
      onError,
    })

    expect(sub).toBe(mockSub)
    expect(mockRawSubscribe).toHaveBeenCalledTimes(1)
    expect(mockRawSubscribe).toHaveBeenCalledWith(
      {topic, args, onData: expect.any(Function), onError},
      {}
    )
  })

  test("unsubscribes from a subscription", async () => {
    const topic = "topic" as SdkTransport.SubscriptionTopic
    const args = {foo: "bar"} as SdkTransport.SubscriptionArguments<any>
    const onData = jest.fn()
    const onError = jest.fn()

    const sub = await subscribe({
      topic,
      args,
      onData,
      onError,
    })

    sub.unsubscribe()

    expect(mockSub.unsubscribe).toHaveBeenCalledTimes(1)
  })

  test("subscribes to a topic with a node", async () => {
    const topic = "topic" as SdkTransport.SubscriptionTopic
    const args = {foo: "bar"} as SdkTransport.SubscriptionArguments<any>
    const onData = jest.fn()
    const onError = jest.fn()

    const node = "http://localhost:8080"

    const sub = await subscribe(
      {
        topic,
        args,
        onData,
        onError,
      },
      {node}
    )

    expect(sub).toBe(mockSub)
    expect(mockRawSubscribe).toHaveBeenCalledTimes(1)
    expect(mockRawSubscribe).toHaveBeenCalledWith(
      {topic, args, onData: expect.any(Function), onError},
      {node}
    )
  })

  test("subscribes to a topic with custom node and transport", async () => {
    const topic = "topic" as SdkTransport.SubscriptionTopic
    const args = {foo: "bar"} as SdkTransport.SubscriptionArguments<any>
    const onData = jest.fn()
    const onError = jest.fn()

    const node = "http://localhost:8080"
    const transport = {
      send: jest.fn(),
      subscribe: jest.fn().mockResolvedValue(mockSub),
    } as jest.Mocked<SdkTransport.Transport>

    const sub = await subscribe(
      {
        topic,
        args,
        onData,
        onError,
      },
      {node, transport}
    )

    expect(sub).toBe(mockSub)
    expect(mockRawSubscribe).toHaveBeenCalledTimes(1)
    expect(mockRawSubscribe).toHaveBeenCalledWith(
      {topic, args, onData: expect.any(Function), onError},
      {node, transport}
    )
  })
})
