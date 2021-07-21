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

describe("Send Get Block", () => {
  test("GetBlockByID", async () => {
    const unaryMock = jest.fn();

    const dateNow = new Date(Date.now())

    const returnedBlock = {
        id: "a1b2c3",
        parentId: "a1b2c3",
        height: 123,
        timestamp: dateNow.toISOString(),
        collectionGuarantees: [],
        blockSeals: [],
        signatures: []
    }

    unaryMock.mockReturnValue({
        getBlock: () => ({
            getId_asU8: () => hexStrToUInt8Array("a1b2c3"),
            getParentId_asU8: () => hexStrToUInt8Array("a1b2c3"),
            getHeight: () => 123,
            getTimestamp: () => ({
                toDate: () => ({
                    toISOString: () => dateNow.toISOString()
                })
            }),
            getCollectionGuaranteesList: () => [],
            getBlockSealsList: () => [],
            getSignaturesList: () => []
        })
    });

    const response = await sendGetBlock(
        await resolve(
            await build([
                getBlock(),
                atBlockId("a1b2c3")
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

    expect(response.block).toEqual(returnedBlock)
  })

  test("GetBlockByHeight", async () => {
    const unaryMock = jest.fn();

    const dateNow = new Date(Date.now())

    const returnedBlock = {
        id: "a1b2c3",
        parentId: "a1b2c3",
        height: 123,
        timestamp: dateNow.toISOString(),
        collectionGuarantees: [],
        blockSeals: [],
        signatures: []
    }

    unaryMock.mockReturnValue({
        getBlock: () => ({
            getId_asU8: () => hexStrToUInt8Array("a1b2c3"),
            getParentId_asU8: () => hexStrToUInt8Array("a1b2c3"),
            getHeight: () => 123,
            getTimestamp: () => ({
                toDate: () => ({
                    toISOString: () => dateNow.toISOString()
                })
            }),
            getCollectionGuaranteesList: () => [],
            getBlockSealsList: () => [],
            getSignaturesList: () => []
        })
    });

    const response = await sendGetBlock(
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

    expect(response.block).toEqual(returnedBlock)
  })

  test("GetLatestBlock - isSealed = false", async () => {
    const unaryMock = jest.fn();

    const dateNow = new Date(Date.now())

    const returnedBlock = {
        id: "a1b2c3",
        parentId: "a1b2c3",
        height: 123,
        timestamp: dateNow.toISOString(),
        collectionGuarantees: [],
        blockSeals: [],
        signatures: []
    }

    unaryMock.mockReturnValue({
        getBlock: () => ({
            getId_asU8: () => hexStrToUInt8Array("a1b2c3"),
            getParentId_asU8: () => hexStrToUInt8Array("a1b2c3"),
            getHeight: () => 123,
            getTimestamp: () => ({
                toDate: () => ({
                    toISOString: () => dateNow.toISOString()
                })
            }),
            getCollectionGuaranteesList: () => [],
            getBlockSealsList: () => [],
            getSignaturesList: () => []
        })
    });

    const response = await sendGetBlock(
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

    expect(response.block).toEqual(returnedBlock)
  })

  test("GetLatestBlock - isSealed = true", async () => {
    const unaryMock = jest.fn();

    const dateNow = new Date(Date.now())

    const returnedBlock = {
        id: "a1b2c3",
        parentId: "a1b2c3",
        height: 123,
        timestamp: dateNow.toISOString(),
        collectionGuarantees: [],
        blockSeals: [],
        signatures: []
    }

    unaryMock.mockReturnValue({
        getBlock: () => ({
            getId_asU8: () => hexStrToUInt8Array("a1b2c3"),
            getParentId_asU8: () => hexStrToUInt8Array("a1b2c3"),
            getHeight: () => 123,
            getTimestamp: () => ({
                toDate: () => ({
                    toISOString: () => dateNow.toISOString()
                })
            }),
            getCollectionGuaranteesList: () => [],
            getBlockSealsList: () => [],
            getSignaturesList: () => []
        })
    });

    const response = await sendGetBlock(
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

    expect(response.block).toEqual(returnedBlock)
  })

})