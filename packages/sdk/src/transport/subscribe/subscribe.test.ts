import {
  Subscription,
  SubscriptionArgs,
  SubscriptionTopic,
  SdkTransport,
} from "@onflow/typedefs"
import {subscribe} from "./subscribe"
import {createSubscribeRawAsync} from "./subscribe-raw"

jest.mock("./subscribe-raw")
jest.mock("../../context/global")

describe("subscribe", () => {
  let mockSub: jest.Mocked<Subscription> = {
    unsubscribe: jest.fn(),
  }

  beforeEach(() => {
    jest.resetAllMocks()
    jest
      .mocked(createSubscribeRawAsync)
      .mockReturnValueOnce(jest.fn().mockReturnValue(mockSub))
  })

  test("subscribes to a topic and returns a subscription", async () => {
    const topic = "topic" as SubscriptionTopic
    const args = {foo: "bar"} as SubscriptionArgs<any>
    const onData = jest.fn()
    const onError = jest.fn()

    const sub = subscribe({
      topic,
      args,
      onData,
      onError,
    })

    const mockSubscribedRaw = jest.mocked(createSubscribeRawAsync).mock
      .results[0].value

    expect(sub).toBe(mockSub)
    expect(mockSubscribedRaw).toHaveBeenCalledTimes(1)
    expect(mockSubscribedRaw).toHaveBeenCalledWith(
      {topic, args, onData: expect.any(Function), onError},
      {}
    )
  })

  test("unsubscribes from a subscription", async () => {
    const topic = "topic" as SubscriptionTopic
    const args = {foo: "bar"} as SubscriptionArgs<any>
    const onData = jest.fn()
    const onError = jest.fn()

    const sub = subscribe({
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

    const sub = subscribe(
      {
        topic,
        args,
        onData,
        onError,
      },
      {node}
    )

    const mockSubscribedRaw = jest.mocked(createSubscribeRawAsync).mock
      .results[0].value

    expect(sub).toBe(mockSub)
    expect(mockSubscribedRaw).toHaveBeenCalledTimes(1)
    expect(mockSubscribedRaw).toHaveBeenCalledWith(
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

    const sub = subscribe(
      {
        topic,
        args,
        onData,
        onError,
      },
      {node, transport}
    )

    const mockSubscribedRaw = jest.mocked(createSubscribeRawAsync).mock
      .results[0].value

    expect(sub).toBe(mockSub)
    expect(mockSubscribedRaw).toHaveBeenCalledTimes(1)
    expect(mockSubscribedRaw).toHaveBeenCalledWith(
      {topic, args, onData: expect.any(Function), onError},
      {node, transport}
    )
  })
})
