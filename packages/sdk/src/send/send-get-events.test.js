import {AccessAPI} from "@onflow/protobuf"
import {sendGetEvents} from "./send-get-events.js"
import {build} from "../build/build.js"
import {getEventsAtBlockIds} from "../build/build-get-events-at-block-ids.js"
import {getEventsAtBlockHeightRange} from "../build/build-get-events-at-block-height-range.js"
import {atBlockHeight} from "../build/build-at-block-height.js"
import {resolve} from "../resolve/resolve.js"

const jsonToUInt8Array = (json) => {
    var str = JSON.stringify(json, null, 0);
    var ret = new Uint8Array(str.length);
    for (var i = 0; i < str.length; i++) {
        ret[i] = str.charCodeAt(i);
    }
    return ret
};

const hexStrToUInt8Array = (hex) => {
    return new Uint8Array(hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
};

const strToUInt8Array = (str) => {
    var ret = new Uint8Array(str.length);
    for (var i = 0; i < str.length; i++) {
        ret[i] = str.charCodeAt(i);
    }
    return ret
};

describe("Send Get Events", () => {
  test("GetEventsForBlockIDs", async () => {
    const unaryMock = jest.fn();

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

    unaryMock.mockReturnValue({
        getResultsList: () => [
            {
                getBlockId_asU8: () => hexStrToUInt8Array("a1b2c3"),
                getBlockHeight: () => 123,
                getBlockTimestamp: () => ({
                    toDate: () => ({
                        toISOString: () => dateNow.toISOString(),
                    })
                }),
                getEventsList: () => ([
                    {
                        getType: () => "MyEvent",
                        getTransactionId_asU8: () => hexStrToUInt8Array("a1b2c3"),
                        getTransactionIndex: () => 123,
                        getEventIndex: () => 456,
                        getPayload_asU8: () => jsonToUInt8Array({type: "String", value: "Hello, Flow"}),
                    }
                ])
            }
        ]
    });

    const response = await sendGetEvents(
        await resolve(
            await build([
                getEventsAtBlockIds("MyEvent", ["a1b2c3"]),
            ])
        ),
        {
            unary: unaryMock
        }
    )

    expect(unaryMock.mock.calls.length).toEqual(1)

    const unaryMockArgs = unaryMock.mock.calls[0]

    expect(unaryMockArgs.length).toEqual(3)

    const unaryType = unaryMock.mock.calls[0][1]

    expect(unaryType).toEqual(AccessAPI.GetEventsForBlockIDs)

    const unaryMockRequest = unaryMock.mock.calls[0][2]
    const unaryMockType = unaryMockRequest.getType()
    const unaryMockBlockIds = unaryMockRequest.getBlockIdsList()

    expect(unaryMockType).not.toBeUndefined()
    expect(unaryMockBlockIds).not.toBeUndefined()
    expect(unaryMockBlockIds.length).toBe(1)

    expect(response.events[0]).toStrictEqual(returnedEvents[0])
  })

  test("GetEventsForHeightRange", async () => {
    const unaryMock = jest.fn();

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

    unaryMock.mockReturnValue({
        getResultsList: () => [
            {
                getBlockId_asU8: () => hexStrToUInt8Array("a1b2c3"),
                getBlockHeight: () => 123,
                getBlockTimestamp: () => ({
                    toDate: () => ({
                        toISOString: () => dateNow.toISOString(),
                    })
                }),
                getEventsList: () => ([
                    {
                        getType: () => "MyEvent",
                        getTransactionId_asU8: () => hexStrToUInt8Array("a1b2c3"),
                        getTransactionIndex: () => 123,
                        getEventIndex: () => 456,
                        getPayload_asU8: () => jsonToUInt8Array({type: "String", value: "Hello, Flow"}),
                    }
                ])
            }
        ]
    });

    const response = await sendGetEvents(
        await resolve(
            await build([
                getEventsAtBlockHeightRange("MyEvent", 123, 456),
            ])
        ),
        {
            unary: unaryMock
        }
    )

    expect(unaryMock.mock.calls.length).toEqual(1)

    const unaryMockArgs = unaryMock.mock.calls[0]

    expect(unaryMockArgs.length).toEqual(3)

    const unaryType = unaryMock.mock.calls[0][1]

    expect(unaryType).toEqual(AccessAPI.GetEventsForHeightRange)

    const unaryMockRequest = unaryMock.mock.calls[0][2]
    const unaryMockType = unaryMockRequest.getType()
    const unaryMockStartHeight = unaryMockRequest.getStartHeight()
    const unaryMockEndHeight = unaryMockRequest.getEndHeight()

    expect(unaryMockType).not.toBeUndefined()
    expect(unaryMockStartHeight).not.toBeUndefined()
    expect(unaryMockEndHeight).not.toBeUndefined()

    expect(response.events[0]).toStrictEqual(returnedEvents[0])
  })

})