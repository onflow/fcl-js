import {sendGetEvents} from "./send-get-events.js"
import {build} from "../../sdk/src/build/build.js"
import {getEventsAtBlockIds} from "../../sdk/src/build/build-get-events-at-block-ids.js"
import {getEventsAtBlockHeightRange} from "../../sdk/src/build/build-get-events-at-block-height-range.js"
import {resolve} from "../../sdk/src/resolve/resolve.js"
import {response as responseADT} from "../../sdk/src/response/response.js"

describe("Send Get Events", () => {
  test("GetEventsForBlockIDs", async () => {
    const httpRequestMock = jest.fn();

    const dateNow = new Date(Date.now())

    const returnedEvents = [
        {
            blockId: "a1b2c3",
            blockHeight: 123,
            blockTimestamp: dateNow.toISOString(),
            type: "MyEvent",
            transactionId: "a1b2c3",
            transactionIndex: 123,
            eventIndex: 456,
            payload: {type: "String", value: "Hello, Flow"}
        }
    ]   

    httpRequestMock.mockReturnValue(returnedEvents)

    const response = await sendGetEvents(
        await resolve(
            await build([
                getEventsAtBlockIds("MyEvent", ["a1b2c3"]),
            ])
        ),
        {
            response: responseADT
        },
        {
            httpRequest: httpRequestMock,
            node: "localhost"
        }
    )

    expect(httpRequestMock.mock.calls.length).toEqual(1)

    const httpRequestMockArgs = httpRequestMock.mock.calls[0]

    expect(httpRequestMockArgs.length).toEqual(1)

    const valueSent = httpRequestMock.mock.calls[0][0]

    expect(valueSent).toEqual({
        hostname: "localhost",
        path: "/events?type=MyEvent&block_ids=a1b2c3",
        method: "GET",
        body: null
    })

    expect(response.events[0]).toStrictEqual(returnedEvents[0])
  })

  test("GetEventsForHeightRange", async () => {
    const httpRequestMock = jest.fn();

    const dateNow = new Date(Date.now())

    const returnedEvents = [
        {
            blockId: "a1b2c3",
            blockHeight: 123,
            blockTimestamp: dateNow.toISOString(),
            type: "MyEvent",
            transactionId: "a1b2c3",
            transactionIndex: 123,
            eventIndex: 456,
            payload: {type: "String", value: "Hello, Flow"}
        }
    ]   

    httpRequestMock.mockReturnValue(returnedEvents)

    const response = await sendGetEvents(
        await resolve(
            await build([
                getEventsAtBlockHeightRange("MyEvent", 123, 456),
            ])
        ),
        {
            response: responseADT
        },
        {
            httpRequest: httpRequestMock,
            node: "localhost"
        }
    )

    expect(httpRequestMock.mock.calls.length).toEqual(1)

    const httpRequestMockArgs = httpRequestMock.mock.calls[0]

    expect(httpRequestMockArgs.length).toEqual(1)

    const valueSent = httpRequestMock.mock.calls[0][0]

    expect(valueSent).toEqual({
        hostname: "localhost",
        path: "/events?type=MyEvent&start_height=123&end_height=456",
        method: "GET",
        body: null
    })

    expect(response.events[0]).toStrictEqual(returnedEvents[0])
  })

})