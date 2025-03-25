import WS from "jest-websocket-mock"
import {WebSocket as mockSocket} from "mock-socket"
import {
  Action,
  SubscribeMessageRequest,
  SubscribeMessageResponse,
  SubscriptionDataMessage,
} from "./models"
import {
  SubscriptionManager,
  SubscriptionManagerConfig,
} from "./subscription-manager"
import {SdkTransport} from "@onflow/typedefs"
import {DataSubscriber, SubscriptionHandler} from "./handlers/types"

jest.mock("./websocket", () => ({
  WebSocket: mockSocket,
}))

describe("SubscriptionManager", () => {
  let mockWs: WS
  let mockSubscriber: jest.Mocked<DataSubscriber<any, any>>
  let mockHandler: jest.Mocked<SubscriptionHandler<any>>
  const mockConnectionArgs = {mock: "connection args"}

  beforeEach(() => {
    jest.resetAllMocks()

    mockWs = new WS("wss://localhost:8080")
    mockSubscriber = {
      onData: jest.fn(),
      onError: jest.fn(),
      getConnectionArgs: jest.fn().mockReturnValue(mockConnectionArgs),
    }
    mockHandler = {
      topic: "topic",
      createSubscriber: jest.fn().mockReturnValue(mockSubscriber),
    }
  })

  afterEach(() => {
    WS.clean()
  })

  test("does not connect to the socket when no subscriptions are made", async () => {
    new SubscriptionManager([mockHandler], {node: "wss://localhost:8080"})

    await new Promise(resolve => setTimeout(resolve, 0))
    expect(mockWs.server.clients).toHaveLength(0)
  })

  test("disconnects from the socket when the last subscription is removed", async () => {
    const config: SubscriptionManagerConfig = {
      node: "wss://localhost:8080",
    }
    const subscriptionManager = new SubscriptionManager([mockHandler], config)
    const topic = "topic" as SdkTransport.SubscriptionTopic
    const args = {key: "value"} as any
    const onData = jest.fn()
    const onError = jest.fn()

    let serverPromise = (async () => {
      await mockWs.connected

      const msg = (await mockWs.nextMessage) as string
      const data = JSON.parse(msg) as SubscribeMessageRequest
      expect(data).toEqual({
        action: "subscribe",
        subscription_id: "0",
        topic,
        arguments: mockConnectionArgs,
      })

      const response: SubscribeMessageResponse = {
        subscription_id: "0",
        action: Action.SUBSCRIBE,
        topic,
      }
      mockWs.send(JSON.stringify(response))
    })()

    const subscription = subscriptionManager.subscribe({
      topic,
      args,
      onData,
      onError,
    })

    await serverPromise

    expect(subscription).toBeDefined()
    expect(subscription.unsubscribe).toBeInstanceOf(Function)

    subscription.unsubscribe()
    await new Promise(resolve => setTimeout(resolve, 0))

    await mockWs.closed
    expect(mockWs.server.clients).toHaveLength(0)
  })

  test("subscribes, receives data, and unsubscribes", async () => {
    const config: SubscriptionManagerConfig = {
      node: "wss://localhost:8080",
    }
    const subscriptionManager = new SubscriptionManager([mockHandler], config)
    const topic = "topic" as SdkTransport.SubscriptionTopic
    const args = {key: "value"} as any
    const onData = jest.fn()
    const onError = jest.fn()

    let serverPromise = (async () => {
      await mockWs.connected

      const msg = (await mockWs.nextMessage) as string
      const data = JSON.parse(msg) as SubscribeMessageRequest
      expect(data).toEqual({
        action: "subscribe",
        subscription_id: "0",
        topic,
        arguments: mockConnectionArgs,
      })

      const response: SubscribeMessageResponse = {
        subscription_id: "0",
        action: Action.SUBSCRIBE,
        topic,
      }
      mockWs.send(JSON.stringify(response))
    })()

    const subscription = subscriptionManager.subscribe({
      topic,
      args,
      onData,
      onError,
    })

    await serverPromise

    expect(subscription).toBeDefined()
    expect(subscription.unsubscribe).toBeInstanceOf(Function)

    serverPromise = (async () => {
      const data = {
        subscription_id: "0",
        payload: {key: "value"},
      } as SubscriptionDataMessage
      mockWs.send(JSON.stringify(data))
    })()

    await serverPromise

    expect(mockSubscriber.onData).toHaveBeenCalledTimes(1)
    expect(mockSubscriber.onData).toHaveBeenCalledWith({
      key: "value",
    })
    expect(mockSubscriber.onError).toHaveBeenCalledTimes(0)

    // Unsubscribe from the only subscription
    subscription.unsubscribe()

    // Connection should be closed as there are no more subscriptions
    await mockWs.closed
  })

  test("reconnects to stream on close", async () => {
    const config: SubscriptionManagerConfig = {
      node: "wss://localhost:8080",
    }
    const subscriptionManager = new SubscriptionManager([mockHandler], config)
    const topic = "topic" as SdkTransport.SubscriptionTopic
    const args = {key: "value"} as any
    const onData = jest.fn()
    const onError = jest.fn()

    let serverPromise = (async () => {
      await mockWs.connected

      const msg = (await mockWs.nextMessage) as string
      const data = JSON.parse(msg) as SubscribeMessageRequest
      expect(data).toEqual({
        action: "subscribe",
        subscription_id: "0",
        topic,
        arguments: mockConnectionArgs,
      })

      const response: SubscribeMessageResponse = {
        subscription_id: "0",
        action: Action.SUBSCRIBE,
        topic,
      }
      mockWs.send(JSON.stringify(response))
    })()

    const subscription = subscriptionManager.subscribe({
      topic,
      args,
      onData,
      onError,
    })

    await serverPromise

    expect(subscription).toBeDefined()
    expect(subscription.unsubscribe).toBeInstanceOf(Function)
    expect(mockHandler.createSubscriber).toHaveBeenCalledTimes(1)
    expect(mockHandler.createSubscriber).toHaveBeenCalledWith(
      args,
      onData,
      onError
    )

    serverPromise = (async () => {
      const data = {
        subscription_id: "0",
        payload: {key: "value"},
      } as SubscriptionDataMessage
      mockWs.send(JSON.stringify(data))
    })()

    await serverPromise

    expect(mockSubscriber.onData).toHaveBeenCalledTimes(1)
    expect(mockSubscriber.onData).toHaveBeenCalledWith({
      key: "value",
    })
    expect(mockSubscriber.onError).toHaveBeenCalledTimes(0)

    // Close the connection and create a new one
    mockWs.close()
    mockWs = new WS("wss://localhost:8080")

    serverPromise = (async () => {
      await mockWs.connected

      const msg = (await mockWs.nextMessage) as string
      const data = JSON.parse(msg) as SubscribeMessageRequest
      expect(data).toEqual({
        subscription_id: "0",
        action: "subscribe",
        topic,
        arguments: mockConnectionArgs,
      })

      const response: SubscribeMessageResponse = {
        subscription_id: "0",
        action: Action.SUBSCRIBE,
        topic,
      }
      mockWs.send(JSON.stringify(response))
    })()

    await serverPromise

    // Wait for client to register the new subscription
    await new Promise(resolve => setTimeout(resolve, 0))

    serverPromise = (async () => {
      const data = {
        subscription_id: "0",
        payload: {key: "value2"},
      } as SubscriptionDataMessage
      mockWs.send(JSON.stringify(data))
    })()

    await serverPromise

    expect(mockSubscriber.onData).toHaveBeenCalledTimes(2)
    expect(mockSubscriber.onData.mock.calls[1]).toEqual([
      {
        key: "value2",
      },
    ])
  })
})
