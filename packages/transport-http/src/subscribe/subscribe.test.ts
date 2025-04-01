import {SubscriptionTopic} from "@onflow/typedefs"
import {subscribe} from "./subscribe"
import {SubscriptionManager} from "./subscription-manager"

jest.mock("./subscription-manager", () => ({
  SubscriptionManager: jest.fn().mockImplementation(() => {
    subscribe: jest.fn().mockReturnValue({unsubscribe: jest.fn()})
  }) as any,
}))

describe("subscribe", () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  test("subscribes to a topic with correct arguments", () => {
    jest.mocked(SubscriptionManager).mockImplementation(
      () =>
        ({
          subscribe: jest.fn().mockReturnValue({unsubscribe: jest.fn()}),
        }) as any
    )

    const onData = jest.fn()
    const onError = jest.fn()

    const sub = subscribe(
      {
        topic: SubscriptionTopic.BLOCKS,
        args: {blockStatus: "sealed"},
        onData,
        onError,
      },
      {
        node: "wss://localhost:8080",
      }
    )

    expect(SubscriptionManager).toHaveBeenCalledTimes(1)
    expect(SubscriptionManager).toHaveBeenCalledWith(expect.any(Array), {
      node: "wss://localhost:8080/v1/ws",
    })
    const instance = jest.mocked(SubscriptionManager).mock.results[0].value

    expect(instance.subscribe).toHaveBeenCalledTimes(1)
    expect(instance.subscribe).toHaveBeenCalledWith({
      topic: SubscriptionTopic.BLOCKS,
      args: {blockStatus: "sealed"},
      onData,
      onError,
    })

    const mockSub = instance.subscribe.mock.results[0].value

    expect(sub).toBeDefined()
    expect(sub).toBe(mockSub)
  })
})
