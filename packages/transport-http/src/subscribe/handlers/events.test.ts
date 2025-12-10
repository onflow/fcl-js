import {eventsHandler} from "./events"

describe("eventsHandler", () => {
  it("should handle messages with events", () => {
    const onData = jest.fn()
    const onError = jest.fn()

    const subscriber = eventsHandler.createSubscriber(
      {eventTypes: ["A.Contract.Event"]},
      onData,
      onError
    )

    subscriber.onData({
      block_id: "block123",
      block_height: "12345",
      block_timestamp: "2024-01-01T00:00:00Z",
      events: [
        {
          type: "A.Contract.Event",
          transaction_id: "tx123",
          transaction_index: "0",
          event_index: "0",
          payload: Buffer.from(JSON.stringify({value: "test"})).toString(
            "base64"
          ),
        },
      ],
    })

    expect(onData).toHaveBeenCalledTimes(1)
    expect(onData).toHaveBeenCalledWith({
      event: {
        blockId: "block123",
        blockHeight: 12345,
        blockTimestamp: "2024-01-01T00:00:00Z",
        type: "A.Contract.Event",
        transactionId: "tx123",
        transactionIndex: 0,
        eventIndex: 0,
        payload: {value: "test"},
      },
    })
  })

  it("should handle heartbeat messages without events field", () => {
    const onData = jest.fn()
    const onError = jest.fn()

    const subscriber = eventsHandler.createSubscriber(
      {eventTypes: ["A.Contract.Event"], startBlockHeight: 100},
      onData,
      onError
    )

    const heartbeat: any = {
      block_id: "block123",
      block_height: "12345",
      block_timestamp: "2024-01-01T00:00:00Z",
    }

    expect(() => subscriber.onData(heartbeat)).not.toThrow()
    expect(onData).not.toHaveBeenCalled()
    expect(subscriber.getConnectionArgs().start_block_height).toBe("12346")
  })
})
