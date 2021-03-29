import {AccessAPI} from "@onflow/protobuf"
import {sendGetBlockHeader} from "./send-get-block-header.js"
import {build} from "../build/build.js"
import {getBlockHeader} from "../build/build-get-block-header.js"
import {atBlockId} from "../build/build-at-block-id.js"
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

describe("Send Get Block Header", () => {
  test("GetBlockHeaderByID", async () => {
    const unaryMock = jest.fn();

    unaryMock.mockReturnValue({
        getBlock: () => ({
            getId_asU8: () => jsonToUInt8Array({type: "String", value: "123abc"}),
            getParentId_asU8: () => jsonToUInt8Array({type: "String", value: "456def"}),
            getHeight: () => 123,
            getTimestamp: () => ({
                toDate: () => new Date(Date.now())
            })
        })
    });

    await sendGetBlockHeader(
        await resolve(
            await build([
                getBlockHeader(),
                atBlockId("123abc")
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

    expect(unaryType).toEqual(AccessAPI.GetBlockHeaderByID)

    const unaryMockRequest = unaryMock.mock.calls[0][2]
    const unaryMockId = unaryMockRequest.getId()

    expect(unaryMockId).not.toBeUndefined()
  })

  test("GetBlockHeaderByHeight", async () => {
    const unaryMock = jest.fn();

    unaryMock.mockReturnValue({
        getBlock: () => ({
            getId_asU8: () => jsonToUInt8Array({type: "String", value: "123abc"}),
            getParentId_asU8: () => jsonToUInt8Array({type: "String", value: "456def"}),
            getHeight: () => 123,
            getTimestamp: () => ({
                toDate: () => new Date(Date.now())
            })
        })
    });

    await sendGetBlockHeader(
        await resolve(
            await build([
                getBlockHeader(),
                atBlockHeight(123)
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

    expect(unaryType).toEqual(AccessAPI.GetBlockHeaderByHeight)

    const unaryMockRequest = unaryMock.mock.calls[0][2]
    const unaryMockHeight = unaryMockRequest.getHeight()

    expect(unaryMockHeight).not.toBeUndefined()
  })

  test("GetLatestBlockHeader - isSealed = false", async () => {
    const unaryMock = jest.fn();

    unaryMock.mockReturnValue({
        getBlock: () => ({
            getId_asU8: () => jsonToUInt8Array({type: "String", value: "123abc"}),
            getParentId_asU8: () => jsonToUInt8Array({type: "String", value: "456def"}),
            getHeight: () => 123,
            getTimestamp: () => ({
                toDate: () => new Date(Date.now())
            })
        })
    });

    await sendGetBlockHeader(
        await resolve(
            await build([
                getBlockHeader()
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

    expect(unaryType).toEqual(AccessAPI.GetLatestBlockHeader)

    const unaryMockRequest = unaryMock.mock.calls[0][2]
    const unaryMockIsSealed = unaryMockRequest.getIsSealed()

    expect(unaryMockIsSealed).toBe(false)
  })

  test("GetLatestBlockHeader - isSealed = true", async () => {
    const unaryMock = jest.fn();

    unaryMock.mockReturnValue({
        getBlock: () => ({
            getId_asU8: () => jsonToUInt8Array({type: "String", value: "123abc"}),
            getParentId_asU8: () => jsonToUInt8Array({type: "String", value: "456def"}),
            getHeight: () => 123,
            getTimestamp: () => ({
                toDate: () => new Date(Date.now())
            })
        })
    });

    await sendGetBlockHeader(
        await resolve(
            await build([
                getBlockHeader(true)
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

    expect(unaryType).toEqual(AccessAPI.GetLatestBlockHeader)

    const unaryMockRequest = unaryMock.mock.calls[0][2]
    const unaryMockIsSealed = unaryMockRequest.getIsSealed()

    expect(unaryMockIsSealed).toBe(true)
  })

})