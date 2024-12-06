import {config} from "@onflow/config"
import {rawSubscribe} from "./raw-subscribe"
import {SdkTransport} from "@onflow/typedefs"
import {getTransport} from "../get-transport"

jest.mock("../get-transport")

describe("subscribe", () => {
  let mockTransport: jest.Mocked<SdkTransport.Transport>
  let mockSub: jest.Mocked<SdkTransport.Subscription> = {
    unsubscribe: jest.fn(),
  }

  beforeEach(() => {
    jest.resetAllMocks()

    mockTransport = {
      subscribe: jest.fn().mockReturnValue(mockSub),
      send: jest.fn(),
    }
    jest.mocked(getTransport).mockResolvedValue(mockTransport)
  })

  test("subscribes to a topic and returns subscription from transport", async () => {
    const topic = "topic" as SdkTransport.SubscriptionTopic
    const args = {foo: "bar"} as SdkTransport.SubscriptionArguments<any>
    const onData = jest.fn()
    const onError = jest.fn()

    const sub = await config().overload(
      {
        "accessNode.api": "http://localhost:8080",
      },
      async () => {
        return await rawSubscribe({topic, args, onData, onError})
      }
    )

    expect(mockTransport.subscribe).toHaveBeenCalledTimes(1)
    expect(mockTransport.subscribe).toHaveBeenCalledWith(
      {topic, args, onData: onData, onError},
      {node: "http://localhost:8080"}
    )

    expect(sub).toBe(mockSub)
  })
})
