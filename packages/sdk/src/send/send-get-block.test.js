import {AccessAPI} from "@onflow/protobuf"
import {sendGetBlock} from "./send-get-block.js"
import {build} from "../build/build.js"
import {getBlock} from "../build/build-get-block.js"
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

describe("Send Get Block", () => {
  test("GetBlockByID", async () => {
    const unaryMock = jest.fn();

    unaryMock.mockReturnValue({
        getBlock: () => ({
            getId_asU8: () => jsonToUInt8Array({type: "String", value: "123abc"}),
            getParentId_asU8: () => jsonToUInt8Array({type: "String", value: "456def"}),
            getHeight: () => 123,
            getTimestamp: () => ({
                toDate: () => ({
                    toISOString: () => "05 October 2011 14:48 UTC"
                })
            }),
            getCollectionGuaranteesList: () => [],
            getBlockSealsList: () => [],
            getSignaturesList: () => []
        })
    });

    await sendGetBlock(
        await resolve(
            await build([
                getBlock(),
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

    expect(unaryType).toEqual(AccessAPI.GetBlockByID)

    const unaryMockRequest = unaryMock.mock.calls[0][2]
    const unaryMockBlockId = unaryMockRequest.getId()

    expect(unaryMockBlockId).not.toBeUndefined()
  })

  test("GetBlockByHeight", async () => {
    const unaryMock = jest.fn();

    unaryMock.mockReturnValue({
        getBlock: () => ({
            getId_asU8: () => jsonToUInt8Array({type: "String", value: "123abc"}),
            getParentId_asU8: () => jsonToUInt8Array({type: "String", value: "456def"}),
            getHeight: () => 123,
            getTimestamp: () => ({
                toDate: () => ({
                    toISOString: () => "05 October 2011 14:48 UTC"
                })
            }),
            getCollectionGuaranteesList: () => [],
            getBlockSealsList: () => [],
            getSignaturesList: () => []
        })
    });

    await sendGetBlock(
        await resolve(
            await build([
                getBlock(),
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

    expect(unaryType).toEqual(AccessAPI.GetBlockByHeight)

    const unaryMockRequest = unaryMock.mock.calls[0][2]
    const unaryMockBlockHeight = unaryMockRequest.getHeight()

    expect(unaryMockBlockHeight).not.toBeUndefined()
  })

  test("GetLatestBlock - isSealed = false", async () => {
    const unaryMock = jest.fn();

    unaryMock.mockReturnValue({
        getBlock: () => ({
            getId_asU8: () => jsonToUInt8Array({type: "String", value: "123abc"}),
            getParentId_asU8: () => jsonToUInt8Array({type: "String", value: "456def"}),
            getHeight: () => 123,
            getTimestamp: () => ({
                toDate: () => ({
                    toISOString: () => "05 October 2011 14:48 UTC"
                })
            }),
            getCollectionGuaranteesList: () => [],
            getBlockSealsList: () => [],
            getSignaturesList: () => []
        })
    });

    await sendGetBlock(
        await resolve(
            await build([
                getBlock()
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

    expect(unaryType).toEqual(AccessAPI.GetLatestBlock)

    const unaryMockRequest = unaryMock.mock.calls[0][2]
    const unaryMockIsSealed = unaryMockRequest.getIsSealed()

    expect(unaryMockIsSealed).toBe(false)
  })

  test("GetLatestBlock - isSealed = true", async () => {
    const unaryMock = jest.fn();

    unaryMock.mockReturnValue({
        getBlock: () => ({
            getId_asU8: () => jsonToUInt8Array({type: "String", value: "123abc"}),
            getParentId_asU8: () => jsonToUInt8Array({type: "String", value: "456def"}),
            getHeight: () => 123,
            getTimestamp: () => ({
                toDate: () => ({
                    toISOString: () => "05 October 2011 14:48 UTC"
                })
            }),
            getCollectionGuaranteesList: () => [],
            getBlockSealsList: () => [],
            getSignaturesList: () => []
        })
    });

    await sendGetBlock(
        await resolve(
            await build([
                getBlock(true)
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

    expect(unaryType).toEqual(AccessAPI.GetLatestBlock)

    const unaryMockRequest = unaryMock.mock.calls[0][2]
    const unaryMockIsSealed = unaryMockRequest.getIsSealed()

    expect(unaryMockIsSealed).toBe(true)
  })

})