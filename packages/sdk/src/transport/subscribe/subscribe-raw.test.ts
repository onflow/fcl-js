import {subscribeRaw} from "./subscribe-raw"
import {
  Subscription,
  SubscriptionArgs,
  SubscriptionTopic,
} from "@onflow/typedefs"
import {createContext} from "../../context/context"
import {getGlobalContext} from "../../context/global"

jest.mock("../../context/global")

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
    const context = createContext({
      transport: mockTransport,
      accessNode: "http://localhost:8080",
      computeLimit: 1000,
    })
    jest.mocked(getGlobalContext).mockResolvedValue(context)

    const topic = "topic" as SubscriptionTopic
    const args = {foo: "bar"} as SubscriptionArgs<any>
    const onData = jest.fn()
    const onError = jest.fn()

    const sub = subscribeRaw({topic, args, onData, onError})
    await new Promise(setImmediate)

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

  test("reports error from global context", async () => {
    jest.mocked(getGlobalContext).mockRejectedValue(new Error("Test Error"))

    const topic = "topic" as SubscriptionTopic
    const args = {foo: "bar"} as SubscriptionArgs<any>
    const onData = jest.fn()
    const onError = jest.fn()

    subscribeRaw({topic, args, onData, onError})
    await new Promise(setImmediate)

    expect(onError).toHaveBeenCalledTimes(1)
    expect(onError).toHaveBeenCalledWith(new Error("Test Error"))
  })

  /*test("reports error if accessNode.api is not defined", async () => {
    const topic = "topic" as SubscriptionTopic
    const args = {foo: "bar"} as SubscriptionArgs<any>
    const onData = jest.fn()
    const onError = jest.fn()

    subscribeRaw({topic, args, onData, onError})
    await new Promise(setImmediate)

    expect(onError).toHaveBeenCalledTimes(1)
    expect(onError).toHaveBeenCalledWith(
      new Error(
        `INVARIANT SDK Send Error: Either opts.node or "accessNode.api" in config must be defined.`
      )
    )
  })*/
})
