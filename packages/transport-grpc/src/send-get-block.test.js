import {AccessAPI} from "@onflow/protobuf"
import {sendGetBlock} from "./send-get-block.js"
import {Buffer} from "@onflow/rlp"
import {
  atBlockHeight,
  atBlockId,
  build,
  getBlock,
  resolve,
  response as responseADT,
} from "@onflow/sdk"

const hexStrToUInt8Array = hex => {
  return new Uint8Array(hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)))
}

describe("Send Get Block", () => {
  test("GetBlockByID", async () => {
    const unaryMock = jest.fn()

    const dateNow = new Date(Date.now())

    const returnedBlock = {
      id: "a1b2c3",
      parentId: "a1b2c3",
      height: 123,
      timestamp: dateNow.toISOString(),
      collectionGuarantees: [],
      blockSeals: [],
    }

    unaryMock.mockReturnValue({
      getBlock: () => ({
        getId_asU8: () => hexStrToUInt8Array("a1b2c3"),
        getParentId_asU8: () => hexStrToUInt8Array("a1b2c3"),
        getHeight: () => 123,
        getTimestamp: () => ({
          toDate: () => ({
            toISOString: () => dateNow.toISOString(),
          }),
        }),
        getCollectionGuaranteesList: () => [],
        getBlockSealsList: () => [],
        getSignaturesList: () => [],
      }),
    })

    const response = await sendGetBlock(
      await resolve(await build([getBlock(), atBlockId("a1b2c3")])),
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

    expect(unaryType).toEqual(AccessAPI.GetBlockByID)

    const unaryMockRequest = unaryMock.mock.calls[0][2]
    const unaryMockBlockId = unaryMockRequest.getId()

    expect(unaryMockBlockId).not.toBeUndefined()

    expect(response.block).toEqual(returnedBlock)
  })

  test("GetBlockByHeight", async () => {
    const unaryMock = jest.fn()

    const dateNow = new Date(Date.now())

    const returnedBlock = {
      id: "a1b2c3",
      parentId: "a1b2c3",
      height: 123,
      timestamp: dateNow.toISOString(),
      collectionGuarantees: [
        {
          collectionId: "abc32111",
          signerIds: ["abc32121"],
        },
      ],
      blockSeals: [],
    }

    unaryMock.mockReturnValue({
      getBlock: () => ({
        getId_asU8: () => hexStrToUInt8Array("a1b2c3"),
        getParentId_asU8: () => hexStrToUInt8Array("a1b2c3"),
        getHeight: () => 123,
        getTimestamp: () => ({
          toDate: () => ({
            toISOString: () => dateNow.toISOString(),
          }),
        }),
        getCollectionGuaranteesList: () => [
          {
            getCollectionId_asU8: () => hexStrToUInt8Array("abc32111"),
            getSignerIdsList_asU8: () => [hexStrToUInt8Array("abc32121")],
          },
        ],
        getBlockSealsList: () => [],
        getSignaturesList: () => [],
      }),
    })

    const response = await sendGetBlock(
      await resolve(await build([getBlock(), atBlockHeight(123)])),
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

    expect(unaryType).toEqual(AccessAPI.GetBlockByHeight)

    const unaryMockRequest = unaryMock.mock.calls[0][2]
    const unaryMockBlockHeight = unaryMockRequest.getHeight()

    expect(unaryMockBlockHeight).not.toBeUndefined()

    expect(response.block).toEqual(returnedBlock)
  })

  test("GetLatestBlock - isSealed = false", async () => {
    const unaryMock = jest.fn()

    const dateNow = new Date(Date.now())

    const returnedBlock = {
      id: "a1b2c3",
      parentId: "a1b2c3",
      height: 123,
      timestamp: dateNow.toISOString(),
      collectionGuarantees: [],
      blockSeals: [],
    }

    unaryMock.mockReturnValue({
      getBlock: () => ({
        getId_asU8: () => hexStrToUInt8Array("a1b2c3"),
        getParentId_asU8: () => hexStrToUInt8Array("a1b2c3"),
        getHeight: () => 123,
        getTimestamp: () => ({
          toDate: () => ({
            toISOString: () => dateNow.toISOString(),
          }),
        }),
        getCollectionGuaranteesList: () => [],
        getBlockSealsList: () => [],
        getSignaturesList: () => [],
      }),
    })

    const response = await sendGetBlock(
      await resolve(await build([getBlock()])),
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

    expect(unaryType).toEqual(AccessAPI.GetLatestBlock)

    const unaryMockRequest = unaryMock.mock.calls[0][2]
    const unaryMockIsSealed = unaryMockRequest.getIsSealed()

    expect(unaryMockIsSealed).toBe(false)

    expect(response.block).toEqual(returnedBlock)
  })

  test("GetLatestBlock - isSealed = true", async () => {
    const unaryMock = jest.fn()

    const dateNow = new Date(Date.now())

    const returnedBlock = {
      id: "a1b2c3",
      parentId: "a1b2c3",
      height: 123,
      timestamp: dateNow.toISOString(),
      collectionGuarantees: [],
      blockSeals: [],
    }

    unaryMock.mockReturnValue({
      getBlock: () => ({
        getId_asU8: () => hexStrToUInt8Array("a1b2c3"),
        getParentId_asU8: () => hexStrToUInt8Array("a1b2c3"),
        getHeight: () => 123,
        getTimestamp: () => ({
          toDate: () => ({
            toISOString: () => dateNow.toISOString(),
          }),
        }),
        getCollectionGuaranteesList: () => [],
        getBlockSealsList: () => [],
        getSignaturesList: () => [],
      }),
    })

    const response = await sendGetBlock(
      await resolve(await build([getBlock(true)])),
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

    expect(unaryType).toEqual(AccessAPI.GetLatestBlock)

    const unaryMockRequest = unaryMock.mock.calls[0][2]
    const unaryMockIsSealed = unaryMockRequest.getIsSealed()

    expect(unaryMockIsSealed).toBe(true)

    expect(response.block).toEqual(returnedBlock)
  })
})
