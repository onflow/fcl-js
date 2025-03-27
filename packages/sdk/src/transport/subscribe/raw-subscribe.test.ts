import {config} from "@onflow/config"
import {rawSubscribe} from "./raw-subscribe"
import {
  Subscription,
  SubscriptionArgs,
  SubscriptionTopic,
} from "@onflow/typedefs"
import {getTransport} from "../get-transport"

jest.mock("../get-transport")

describe("subscribe", () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  test("subscribes to a topic and returns subscription from transport", async () => {
    const mockSub: jest.Mocked<Subscription> = {
      unsubscribe: jest.fn(),
    }
    const mockTransport = {
      subscribe: jest.fn().mockReturnValue(mockSub),
      send: jest.fn(),
    }
    jest.mocked(getTransport).mockResolvedValue(mockTransport)

    const topic = "topic" as SubscriptionTopic
    const args = {foo: "bar"} as SubscriptionArgs<any>
    const onData = jest.fn()
    const onError = jest.fn()

    const sub = await config().overload(
      {
        "accessNode.api": "http://localhost:8080",
      },
      () => {
        return rawSubscribe({topic, args, onData, onError})
      }
    )

    expect(mockTransport.subscribe).toHaveBeenCalledTimes(1)
    expect(mockTransport.subscribe).toHaveBeenCalledWith(
      {topic, args, onData: onData, onError},
      {node: "http://localhost:8080"}
    )

    // Ensure that unsubscribe calls the transport's unsubscribe method
    sub.unsubscribe()
    await new Promise(setImmediate)
    expect(mockSub.unsubscribe).toHaveBeenCalledTimes(1)
  })

  test("reports error from getTransport", async () => {
    jest.mocked(getTransport).mockRejectedValue(new Error("Test Error"))

    const topic = "topic" as SubscriptionTopic
    const args = {foo: "bar"} as SubscriptionArgs<any>
    const onData = jest.fn()
    const onError = jest.fn()

    await config().overload(
      {
        "accessNode.api": "http://localhost:8080",
      },
      () => {
        return rawSubscribe({topic, args, onData, onError})
      }
    )

    expect(onError).toHaveBeenCalledTimes(1)
    expect(onError).toHaveBeenCalledWith(new Error("Test Error"))
  })

  test("reports error if accessNode.api is not defined", async () => {
    const topic = "topic" as SubscriptionTopic
    const args = {foo: "bar"} as SubscriptionArgs<any>
    const onData = jest.fn()
    const onError = jest.fn()

    await config().overload({}, () => {
      return rawSubscribe({topic, args, onData, onError})
    })

    expect(onError).toHaveBeenCalledTimes(1)
    expect(onError).toHaveBeenCalledWith(
      new Error(
        `INVARIANT SDK Send Error: Either opts.node or "accessNode.api" in config must be defined.`
      )
    )
  })
})
