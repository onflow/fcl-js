import {connectSubscribeEvents} from "./connect-subscribe-events"
import {Buffer} from "@onflow/rlp"
import {response as responseADT} from "@onflow/sdk"
import {StreamConnection} from "@onflow/typedefs"
import EventEmitter from "events"

describe("Subscribe Events", () => {
  let emitter
  let mockStream: StreamConnection<{
    data: {
      events: any[]
      heartbeat: {
        blockId: string
        blockHeight: number
        blockTimestamp: number
      }
    }
  }>
  let connectWsMock

  beforeEach(async () => {
    connectWsMock = jest.fn(() => mockStream)
    emitter = new EventEmitter()
    mockStream = {
      on: jest.fn((event, callback) => {
        emitter.on(event, callback)
      }) as any,
      off: jest.fn((event, callback) => {
        emitter.off(event, callback)
      }) as any,
      close: jest.fn(),
    }

    connectWsMock.mockReturnValue(mockStream)
  })

  test("should initiate socket conection with correct params", async () => {
    await connectSubscribeEvents(
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
        connectWs: connectWsMock,
        node: "http://localhost",
      }
    )

    expect(connectWsMock).toHaveBeenCalledWith({
      hostname: "http://localhost",
      path: "/v1/subscribe_events",
      getParams: expect.any(Function),
    })

    const params = connectWsMock.mock.calls[0][0].getParams()
    expect(params).toEqual({
      start_block_id: "abc123",
      start_height: 1,
      event_types: ["A.7e60df042a9c0868.FlowToken.TokensWithdrawn"],
      addresses: ["0x1", "0x2"],
      contracts: ["A.7e60df042a9c0868.FlowToken"],
      heartbeat_interval: 1000,
    })
  })

  test("should process events & heartbeat then map to response adt", async () => {
    const response = await connectSubscribeEvents(
      {
        tag: "SUBSCRIBE_EVENTS",
        subscribeEvents: {
          startBlockId: "abc123",
          startHeight: 1,
          eventTypes: ["A.7e60df042a9c0868.FlowToken.TokensWithdrawn"],
          addresses: ["0x1", "0x2"],
          contracts: ["A.7e60df042a9c0868.FlowToken"],
          heartbeatInterval: 1,
        },
      },
      {
        response: responseADT,
        Buffer,
      },
      {
        connectWs: connectWsMock,
        node: "http://localhost",
      }
    )

    const mockPayload = Buffer.from(
      JSON.stringify({
        value: {
          id: "A.912d5440f7e3769e.FlowFees.FeesDeducted",
          fields: [
            {
              value: {value: "0.00000119", type: "UFix64"},
              name: "amount",
            },
            {
              value: {value: "1.00000000", type: "UFix64"},
              name: "inclusionEffort",
            },
            {
              value: {value: "0.00000004", type: "UFix64"},
              name: "executionEffort",
            },
          ],
        },
        type: "Event",
      })
    ).toString("base64")

    let allData: any[] = []
    response.streamConnection.on("data", data => {
      allData.push(data)
    })

    emitter.emit("data", {
      BlockID: "abc123",
      Height: 1,
      Timestamp: "1",
      Events: [
        {
          Type: "A.7e60df042a9c0868.FlowToken.TokensWithdrawn",
          TransactionID: "123abc",
          TransactionIndex: 1,
          EventIndex: 1,
          Payload: mockPayload,
        },
      ],
    })

    emitter.emit("data", {
      BlockID: "def456",
      Height: 2,
      Timestamp: "2",
      Events: [],
    })

    await new Promise(resolve => setTimeout(resolve, 0))

    expect(allData).toEqual([
      {
        ...responseADT(),
        tag: "SUBSCRIBE_EVENTS",
        events: [
          {
            type: "A.7e60df042a9c0868.FlowToken.TokensWithdrawn",
            transactionId: "123abc",
            transactionIndex: 1,
            eventIndex: 1,
            blockId: "abc123",
            blockHeight: 1,
            blockTimestamp: "1",
            payload: JSON.parse(Buffer.from(mockPayload, "base64").toString()),
          },
        ],
        heartbeat: {
          blockId: "abc123",
          blockHeight: 1,
          blockTimestamp: "1",
        },
      },
      {
        ...responseADT(),
        tag: "SUBSCRIBE_EVENTS",
        heartbeat: {
          blockId: "def456",
          blockHeight: 2,
          blockTimestamp: "2",
        },
      },
    ])
  })

  test("close should propogate the websocket connection", async () => {
    const response = await connectSubscribeEvents(
      {
        tag: "SUBSCRIBE_EVENTS",
        subscribeEvents: {
          startBlockId: "abc123",
          startHeight: 1,
          eventTypes: ["A.7e60df042a9c0868.FlowToken.TokensWithdrawn"],
          addresses: ["0x1", "0x2"],
          contracts: ["A.7e60df042a9c0868.FlowToken"],
          heartbeatInterval: 1,
        },
      },
      {
        response: responseADT,
        Buffer,
      },
      {
        connectWs: connectWsMock,
        node: "http://localhost",
      }
    )

    response.streamConnection.close()

    await new Promise(resolve => setTimeout(resolve, 0))

    expect(mockStream.close).toHaveBeenCalled()
  })

  test("should unsubscribe when the stream is closed", async () => {
    const response = await connectSubscribeEvents(
      {
        tag: "SUBSCRIBE_EVENTS",
        subscribeEvents: {
          startBlockId: "abc123",
          startHeight: 1,
          eventTypes: ["A.7e60df042a9c0868.FlowToken.TokensWithdrawn"],
          addresses: ["0x1", "0x2"],
          contracts: ["A.7e60df042a9c0868.FlowToken"],
          heartbeatInterval: 1,
        },
      },
      {
        response: responseADT,
        Buffer,
      },
      {
        connectWs: connectWsMock,
        node: "http://localhost",
      }
    )

    response.streamConnection.close()

    await new Promise(resolve => setTimeout(resolve, 0))

    expect(mockStream.close).toHaveBeenCalled()
  })

  test("getParams for next connection should use next block height if available", async () => {
    const response = await connectSubscribeEvents(
      {
        tag: "SUBSCRIBE_EVENTS",
        subscribeEvents: {
          startBlockId: "abc123",
          eventTypes: ["A.7e60df042a9c0868.FlowToken.TokensWithdrawn"],
          addresses: ["0x1", "0x2"],
          contracts: ["A.7e60df042a9c0868.FlowToken"],
          heartbeatInterval: 1,
        },
      },
      {
        response: responseADT,
        Buffer,
      },
      {
        connectWs: connectWsMock,
        node: "http://localhost",
      }
    )

    // Expect same params as initial connection since no data has been received
    expect(connectWsMock.mock.calls[0][0].getParams()).toEqual({
      start_block_id: "abc123",
      event_types: ["A.7e60df042a9c0868.FlowToken.TokensWithdrawn"],
      addresses: ["0x1", "0x2"],
      contracts: ["A.7e60df042a9c0868.FlowToken"],
      heartbeat_interval: 1,
    })

    // Expect next connection to use the next block height as it has seen a heartbeat
    emitter.emit("data", {
      BlockID: "abc123",
      Height: 1,
      Timestamp: "1",
      Events: [],
    })

    expect(connectWsMock.mock.calls[0][0].getParams()).toEqual({
      start_height: 2,
      event_types: ["A.7e60df042a9c0868.FlowToken.TokensWithdrawn"],
      addresses: ["0x1", "0x2"],
      contracts: ["A.7e60df042a9c0868.FlowToken"],
      heartbeat_interval: 1,
    })
  })
})
