import {sendSubscribeEvents} from "./connect-subscribe-events"
import {Buffer} from "@onflow/rlp"
import {
  build,
  subscribeEvents,
  subscription,
  resolve,
  response as responseADT,
} from "@onflow/sdk"
import {DataStream} from "@onflow/util-pubsub"

describe("Subscribe Events", () => {
  let mockStream
  let subscribeWsMock
  let unsubscribeMock

  beforeEach(async () => {
    mockStream = new DataStream()
    subscribeWsMock = jest.fn(() => mockStream)
    unsubscribeMock = jest.fn()

    subscribeWsMock.mockReturnValue({
      unsubscribeCallback: unsubscribeMock,
    })
  })

  test("should initiate socket conection with correct params", async () => {
    await sendSubscribeEvents(
      {
        tag: "SUBSCRIBE_EVENTS",
        subscribeEvents: {
          startBlockId: "abc123",
          startHeight: 1,
          eventTypes: ["A.7e60df042a9c0868.FlowToken.TokensWithdrawn"],
          addresses: ["0x1", "0x2"],
          contracts: ["A.7e60df042a9c0868.FlowToken"],
          heartbeatInterval: 1000,
        },
      },
      {
        response: responseADT,
        Buffer,
      },
      {
        subscribeWs: subscribeWsMock,
        node: "localhost",
      }
    )

    expect(subscribeWsMock).toHaveBeenCalledWith({
      hostname: "localhost",
      path: "/v1/subscribe_events",
      params: {
        start_block_id: "abc123",
        start_height: 1,
        event_types: ["A.7e60df042a9c0868.FlowToken.TokensWithdrawn"],
        addresses: ["0x1", "0x2"],
        contracts: ["A.7e60df042a9c0868.FlowToken"],
        heartbeat_interval: 1000,
      },
    })
  })

  test("should return a stream that pushes events when received from socket", async () => {
    const response = await sendSubscribeEvents(
      {
        tag: "SUBSCRIBE_EVENTS",
        subscribeEvents: {
          startBlockId: "abc123",
          startHeight: 1,
          eventTypes: ["A.7e60df042a9c0868.FlowToken.TokensWithdrawn"],
          addresses: ["0x1", "0x2"],
          contracts: ["A.7e60df042a9c0868.FlowToken"],
          heartbeatInterval: 1000,
        },
      },
      {
        response: responseADT,
        Buffer,
      },
      {
        subscribeWs: subscribeWsMock,
        node: "localhost",
      }
    )

    response.subscribe(e => {
      expect(e).toEqual({
        tag: "SUBSCRIBE_EVENTS",
        dataStream: mockStream,
      })
    })

    mockStream.next("hello")
  })
})
