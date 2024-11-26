import {config} from "@onflow/config"
import {subscribe} from "./subscribe"
import {SdkTransport} from "@onflow/typedefs"
import {getTransport} from "./transport"

jest.mock("./transport")

describe("subscribe", () => {
  let mockTransport: jest.Mocked<SdkTransport.Transport>

  beforeEach(() => {
    jest.resetAllMocks()

    mockTransport = {
      subscribe: jest.fn().mockReturnValue({
        unsubscribe: jest.fn(),
      }),
      send: jest.fn(),
    }
    jest.mocked(getTransport).mockResolvedValue(mockTransport)
  })

  test("subscribes to a topic and returns a subscription", async () => {
    const topic = "topic" as SdkTransport.SubscriptionTopic
    const args = {foo: "bar"} as SdkTransport.SubscriptionArguments<any>
    const onData = jest.fn()
    const onError = jest.fn()

    const sub = await config().overload(
      {
        "accessNode.api": "http://localhost:8080",
      },
      async () => {
        return await subscribe({topic, args, onData, onError})
      }
    )

    expect(mockTransport.subscribe).toHaveBeenCalledTimes(1)
    expect(mockTransport.subscribe).toHaveBeenCalledWith(
      {topic, args, onData: expect.any(Function), onError},
      {node: "http://localhost:8080"}
    )

    expect(sub).toStrictEqual({
      unsubscribe: expect.any(Function),
    })
  })
})
