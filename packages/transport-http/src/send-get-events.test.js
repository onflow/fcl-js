import {sendGetEvents} from "./send-get-events.js"
import {Buffer} from "@onflow/rlp"
import {
  build,
  getEventsAtBlockHeightRange,
  getEventsAtBlockIds,
  resolve,
  response as responseADT,
} from "@onflow/sdk"

describe("Send Get Events", () => {
  test("GetEventsForBlockIDs", async () => {
    const httpRequestMock = jest.fn()

    const dateNow = new Date(Date.now())

    const returnedEvents = [
      {
        block_id: "a1b2c3",
        block_height: "123",
        block_timestamp: dateNow.toISOString(),
        events: [
          {
            type: "MyEvent",
            transaction_id: "a1b2c3",
            transaction_index: "123",
            event_index: "456",
            payload: Buffer.from(
              JSON.stringify({type: "String", value: "Hello, Flow"})
            ).toString("base64"),
          },
        ],
      },
    ]

    httpRequestMock.mockReturnValue(returnedEvents)

    const response = await sendGetEvents(
      await resolve(await build([getEventsAtBlockIds("MyEvent", ["a1b2c3"])])),
      {
        response: responseADT,
        Buffer,
      },
      {
        httpRequest: httpRequestMock,
        node: "localhost",
      }
    )

    expect(httpRequestMock.mock.calls.length).toEqual(1)

    const httpRequestMockArgs = httpRequestMock.mock.calls[0]

    expect(httpRequestMockArgs.length).toEqual(1)

    const valueSent = httpRequestMock.mock.calls[0][0]

    expect(valueSent).toEqual({
      hostname: "localhost",
      path: "/v1/events?type=MyEvent&block_ids=a1b2c3",
      method: "GET",
      body: null,
    })

    expect(response.events[0]).toStrictEqual({
      blockId: "a1b2c3",
      blockHeight: 123,
      blockTimestamp: dateNow.toISOString(),
      type: "MyEvent",
      transactionId: "a1b2c3",
      transactionIndex: 123,
      eventIndex: 456,
      payload: {type: "String", value: "Hello, Flow"},
    })
  })

  test("GetEventsForHeightRange", async () => {
    const httpRequestMock = jest.fn()

    const dateNow = new Date(Date.now())

    const returnedEvents = [
      {
        block_id: "a1b2c3",
        block_height: "123",
        block_timestamp: dateNow.toISOString(),
        events: [
          {
            type: "MyEvent",
            transaction_id: "a1b2c3",
            transaction_index: "123",
            event_index: "456",
            payload: Buffer.from(
              JSON.stringify({type: "String", value: "Hello, Flow"})
            ).toString("base64"),
          },
        ],
      },
    ]

    httpRequestMock.mockReturnValue(returnedEvents)

    const response = await sendGetEvents(
      await resolve(
        await build([getEventsAtBlockHeightRange("MyEvent", 123, 456)])
      ),
      {
        response: responseADT,
        Buffer,
      },
      {
        httpRequest: httpRequestMock,
        node: "localhost",
      }
    )

    expect(httpRequestMock.mock.calls.length).toEqual(1)

    const httpRequestMockArgs = httpRequestMock.mock.calls[0]

    expect(httpRequestMockArgs.length).toEqual(1)

    const valueSent = httpRequestMock.mock.calls[0][0]

    expect(valueSent).toEqual({
      hostname: "localhost",
      path: "/v1/events?type=MyEvent&start_height=123&end_height=456",
      method: "GET",
      body: null,
    })

    expect(response.events[0]).toStrictEqual({
      blockId: "a1b2c3",
      blockHeight: 123,
      blockTimestamp: dateNow.toISOString(),
      type: "MyEvent",
      transactionId: "a1b2c3",
      transactionIndex: 123,
      eventIndex: 456,
      payload: {type: "String", value: "Hello, Flow"},
    })
  })
})
