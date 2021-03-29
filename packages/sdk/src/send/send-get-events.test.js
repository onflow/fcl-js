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

describe("Send Get Events", () => {
  test("GetEventsForBlockIDs", async () => {
    const unaryMock = jest.fn();

    unaryMock.mockReturnValue({
        getResultsList: () => [
            {
                getBlockId_asU8: () => jsonToUInt8Array({type: "String", value: "123abc"}),
                getBlockHeight: () => 123,
                getBlockTimestamp: () => ({
                    toDate: () => ({
                        toISOString: () => "05 October 2011 14:48 UTC"
                    })
                }),
                getEventsList: () => ([
                    {
                        getType: () => "MyEvent",
                        getTransactionId_asU8: () => jsonToUInt8Array({type: "String", value: "TxId"}),
                        getTransactionIndex: () => 123,
                        getEventIndex: () => 456,
                        getPayload_asU8: () => jsonToUInt8Array({type: "String", value: "Hello, Flow"}),
                    }
                ])
            }
        ]
    });

    await sendGetEvents(
        await resolve(
            await build([
                getEventsAtBlockIds("MyEvent", ["abc123"]),
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
  })

  test("GetEventsForHeightRange", async () => {
    const unaryMock = jest.fn();

    unaryMock.mockReturnValue({
        getResultsList: () => [
            {
                getBlockId_asU8: () => jsonToUInt8Array({type: "String", value: "123abc"}),
                getBlockHeight: () => 123,
                getBlockTimestamp: () => ({
                    toDate: () => ({
                        toISOString: () => "05 October 2011 14:48 UTC"
                    })
                }),
                getEventsList: () => ([
                    {
                        getType: () => "MyEvent",
                        getTransactionId_asU8: () => jsonToUInt8Array({type: "String", value: "TxId"}),
                        getTransactionIndex: () => 123,
                        getEventIndex: () => 456,
                        getPayload_asU8: () => jsonToUInt8Array({type: "String", value: "Hello, Flow"}),
                    }
                ])
            }
        ]
    });

    await sendGetEvents(
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
  })

})