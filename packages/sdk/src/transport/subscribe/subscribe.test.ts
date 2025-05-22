import {
  Subscription,
  SubscriptionArgs,
  SubscriptionTopic,
  SdkTransport,
} from "@onflow/typedefs"
import {subscribe} from "./subscribe"
import {subscribeRaw} from "./raw-subscribe"

jest.mock("./raw-subscribe")
const mocksubscribeRaw = jest.mocked(subscribeRaw)

describe("subscribe", () => {
  let mockSub: jest.Mocked<Subscription> = {
    unsubscribe: jest.fn(),
  }

  beforeEach(() => {
    jest.resetAllMocks()
    mocksubscribeRaw.mockReturnValue(mockSub)
  })

  test("subscribes to a topic and returns a subscription", async () => {
    const topic = "topic" as SubscriptionTopic
    const args = {foo: "bar"} as SubscriptionArgs<any>
    const onData = jest.fn()
    const onError = jest.fn()

    const sub = await subscribe({
      topic,
      args,
      onData,
      onError,
    })

    expect(sub).toBe(mockSub)
    expect(mocksubscribeRaw).toHaveBeenCalledTimes(1)
    expect(mocksubscribeRaw).toHaveBeenCalledWith(
      {topic, args, onData: expect.any(Function), onError},
      {}
    )
  })

  test("unsubscribes from a subscription", async () => {
    const topic = "topic" as SubscriptionTopic
    const args = {foo: "bar"} as SubscriptionArgs<any>
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
    const topic = "topic" as SubscriptionTopic
    const args = {foo: "bar"} as SubscriptionArgs<any>
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
    expect(mocksubscribeRaw).toHaveBeenCalledTimes(1)
    expect(mocksubscribeRaw).toHaveBeenCalledWith(
      {topic, args, onData: expect.any(Function), onError},
      {node}
    )
  })

  test("subscribes to a topic with custom node and transport", async () => {
    const topic = "topic" as SubscriptionTopic
    const args = {foo: "bar"} as SubscriptionArgs<any>
    const onData = jest.fn()
    const onError = jest.fn()

    const node = "http://localhost:8080"
    const transport = {
      send: jest.fn(),
      subscribe: jest.fn().mockResolvedValue(mockSub),
    } as jest.Mocked<SdkTransport>

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
    expect(mocksubscribeRaw).toHaveBeenCalledTimes(1)
    expect(mocksubscribeRaw).toHaveBeenCalledWith(
      {topic, args, onData: expect.any(Function), onError},
      {node, transport}
    )
  })
})
