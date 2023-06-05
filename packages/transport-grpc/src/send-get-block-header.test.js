import {AccessAPI} from "@onflow/protobuf"
import {sendGetBlockHeader} from "./send-get-block-header.js"
import {Buffer} from "@onflow/rlp"
import {
  atBlockHeight,
  atBlockId,
  build,
  getBlockHeader,
  resolve,
  response as responseADT,
} from "@onflow/sdk"

const hexStrToUInt8Array = hex => {
  return new Uint8Array(hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)))
}

describe("Send Get Block Header", () => {
  test("GetBlockHeaderByID", async () => {
    const unaryMock = jest.fn()

    const dateNow = new Date(Date.now())

    const returnedBlockHeader = {
      id: "a1b2c3",
      parentId: "a1b2c3",
      height: 123,
      timestamp: dateNow.toISOString(),
    }

    unaryMock.mockReturnValue({
      getBlock: () => ({
        getId_asU8: () => hexStrToUInt8Array("a1b2c3"),
        getParentId_asU8: () => hexStrToUInt8Array("a1b2c3"),
        getHeight: () => 123,
        getTimestamp: () => ({
          toDate: () => dateNow,
        }),
      }),
    })

    const response = await sendGetBlockHeader(
      await resolve(await build([getBlockHeader(), atBlockId("a1b2c3")])),
      {
        response: responseADT,
        Buffer,
      },
      {
        unary: unaryMock,
        node: "localhost:3000",
      }
    )

    expect(unaryMock.mock.calls.length).toEqual(1)

    const unaryMockArgs = unaryMock.mock.calls[0]

    expect(unaryMockArgs.length).toEqual(4)

    const unaryType = unaryMock.mock.calls[0][1]

    expect(unaryType).toEqual(AccessAPI.GetBlockHeaderByID)

    const unaryMockRequest = unaryMock.mock.calls[0][2]
    const unaryMockId = unaryMockRequest.getId()

    expect(unaryMockId).not.toBeUndefined()

    expect(response.blockHeader).toEqual(returnedBlockHeader)
  })

  test("GetBlockHeaderByHeight", async () => {
    const unaryMock = jest.fn()

    const dateNow = new Date(Date.now())

    const returnedBlockHeader = {
      id: "a1b2c3",
      parentId: "a1b2c3",
      height: 123,
      timestamp: dateNow.toISOString(),
    }

    unaryMock.mockReturnValue({
      getBlock: () => ({
        getId_asU8: () => hexStrToUInt8Array("a1b2c3"),
        getParentId_asU8: () => hexStrToUInt8Array("a1b2c3"),
        getHeight: () => 123,
        getTimestamp: () => ({
          toDate: () => dateNow,
        }),
      }),
    })

    const response = await sendGetBlockHeader(
      await resolve(await build([getBlockHeader(), atBlockHeight(123)])),
      {
        response: responseADT,
        Buffer,
      },
      {
        unary: unaryMock,
        node: "localhost:3000",
      }
    )

    expect(unaryMock.mock.calls.length).toEqual(1)

    const unaryMockArgs = unaryMock.mock.calls[0]

    expect(unaryMockArgs.length).toEqual(4)

    const unaryType = unaryMock.mock.calls[0][1]

    expect(unaryType).toEqual(AccessAPI.GetBlockHeaderByHeight)

    const unaryMockRequest = unaryMock.mock.calls[0][2]
    const unaryMockHeight = unaryMockRequest.getHeight()

    expect(unaryMockHeight).not.toBeUndefined()

    expect(response.blockHeader).toEqual(returnedBlockHeader)
  })

  test("GetLatestBlockHeader - isSealed = false", async () => {
    const unaryMock = jest.fn()

    const dateNow = new Date(Date.now())

    const returnedBlockHeader = {
      id: "a1b2c3",
      parentId: "a1b2c3",
      height: 123,
      timestamp: dateNow.toISOString(),
    }

    unaryMock.mockReturnValue({
      getBlock: () => ({
        getId_asU8: () => hexStrToUInt8Array("a1b2c3"),
        getParentId_asU8: () => hexStrToUInt8Array("a1b2c3"),
        getHeight: () => 123,
        getTimestamp: () => ({
          toDate: () => dateNow,
        }),
      }),
    })

    const response = await sendGetBlockHeader(
      await resolve(await build([getBlockHeader()])),
      {
        response: responseADT,
        Buffer,
      },
      {
        unary: unaryMock,
        node: "localhost:3000",
      }
    )

    expect(unaryMock.mock.calls.length).toEqual(1)

    const unaryMockArgs = unaryMock.mock.calls[0]

    expect(unaryMockArgs.length).toEqual(4)

    const unaryType = unaryMock.mock.calls[0][1]

    expect(unaryType).toEqual(AccessAPI.GetLatestBlockHeader)

    const unaryMockRequest = unaryMock.mock.calls[0][2]
    const unaryMockIsSealed = unaryMockRequest.getIsSealed()

    expect(unaryMockIsSealed).toBe(false)

    expect(response.blockHeader).toEqual(returnedBlockHeader)
  })

  test("GetLatestBlockHeader - isSealed = true", async () => {
    const unaryMock = jest.fn()

    const dateNow = new Date(Date.now())

    const returnedBlockHeader = {
      id: "a1b2c3",
      parentId: "a1b2c3",
      height: 123,
      timestamp: dateNow.toISOString(),
    }

    unaryMock.mockReturnValue({
      getBlock: () => ({
        getId_asU8: () => hexStrToUInt8Array("a1b2c3"),
        getParentId_asU8: () => hexStrToUInt8Array("a1b2c3"),
        getHeight: () => 123,
        getTimestamp: () => ({
          toDate: () => dateNow,
        }),
      }),
    })

    const response = await sendGetBlockHeader(
      await resolve(await build([getBlockHeader(true)])),
      {
        response: responseADT,
        Buffer,
      },
      {
        unary: unaryMock,
        node: "localhost:3000",
      }
    )

    expect(unaryMock.mock.calls.length).toEqual(1)

    const unaryMockArgs = unaryMock.mock.calls[0]

    expect(unaryMockArgs.length).toEqual(4)

    const unaryType = unaryMock.mock.calls[0][1]

    expect(unaryType).toEqual(AccessAPI.GetLatestBlockHeader)

    const unaryMockRequest = unaryMock.mock.calls[0][2]
    const unaryMockIsSealed = unaryMockRequest.getIsSealed()

    expect(unaryMockIsSealed).toBe(true)

    expect(response.blockHeader).toEqual(returnedBlockHeader)
  })
})
