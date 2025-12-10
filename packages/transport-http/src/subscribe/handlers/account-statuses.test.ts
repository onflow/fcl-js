import {accountStatusesHandler} from "./account-statuses"

describe("accountStatusesHandler", () => {
  it("should handle messages with account events", () => {
    const onData = jest.fn()
    const onError = jest.fn()

    const subscriber = accountStatusesHandler.createSubscriber(
      {accountAddresses: ["0x1234"]},
      onData,
      onError
    )

    subscriber.onData({
      block_id: "block123",
      height: "12345",
      account_events: {
        "0x1234": [
          {
            type: "flow.AccountKeyAdded",
            transaction_id: "tx123",
            transaction_index: "0",
            event_index: "0",
            payload: Buffer.from(JSON.stringify({value: "test"})).toString(
              "base64"
            ),
          },
        ],
      },
      message_index: "0",
    })

    expect(onData).toHaveBeenCalledTimes(1)
    expect(onData).toHaveBeenCalledWith({
      accountStatusEvent: {
        accountAddress: "0x1234",
        blockId: "block123",
        blockHeight: 12345,
        type: "flow.AccountKeyAdded",
        transactionId: "tx123",
        transactionIndex: 0,
        eventIndex: 0,
        payload: {value: "test"},
      },
    })
  })

  it("should handle heartbeat messages without account_events field", () => {
    const onData = jest.fn()
    const onError = jest.fn()

    const subscriber = accountStatusesHandler.createSubscriber(
      {accountAddresses: ["0x1234"], startBlockHeight: 100},
      onData,
      onError
    )

    const heartbeat: any = {
      block_id: "block123",
      height: "12345",
      message_index: "0",
    }

    expect(() => subscriber.onData(heartbeat)).not.toThrow()
    expect(onData).not.toHaveBeenCalled()
    expect(subscriber.getConnectionArgs().start_block_height).toBe(12346)
  })

  it("should sort events by transaction and event index", () => {
    const onData = jest.fn()

    const subscriber = accountStatusesHandler.createSubscriber(
      {accountAddresses: ["0x1234"]},
      onData,
      jest.fn()
    )

    subscriber.onData({
      block_id: "block123",
      height: "12345",
      account_events: {
        "0x1234": [
          {
            type: "flow.Event",
            transaction_id: "tx1",
            transaction_index: "1",
            event_index: "0",
            payload: Buffer.from(JSON.stringify({value: "second"})).toString(
              "base64"
            ),
          },
          {
            type: "flow.Event",
            transaction_id: "tx1",
            transaction_index: "0",
            event_index: "0",
            payload: Buffer.from(JSON.stringify({value: "first"})).toString(
              "base64"
            ),
          },
        ],
      },
      message_index: "0",
    })

    expect(onData).toHaveBeenCalledTimes(2)
    expect(onData.mock.calls[0][0].accountStatusEvent.payload.value).toBe(
      "first"
    )
    expect(onData.mock.calls[1][0].accountStatusEvent.payload.value).toBe(
      "second"
    )
  })
})
