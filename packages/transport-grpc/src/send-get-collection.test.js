import {AccessAPI} from "@onflow/protobuf"
import {sendGetCollection} from "./send-get-collection.js"
import {Buffer} from "@onflow/rlp"
import {
  build,
  getCollection,
  resolve,
  response as responseADT,
} from "@onflow/sdk"

const hexStrToUInt8Array = hex => {
  return new Uint8Array(hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)))
}

describe("Send Get Collection", () => {
  test("GetCollection", async () => {
    const unaryMock = jest.fn()

    const returnedCollection = {
      id: "a1b2c3",
      transactionIds: ["a1b2c3"],
    }

    unaryMock.mockReturnValue({
      getCollection: () => ({
        getId_asU8: () => hexStrToUInt8Array("a1b2c3"),
        getTransactionIdsList: () => [hexStrToUInt8Array("a1b2c3")],
      }),
    })

    const response = await sendGetCollection(
      await resolve(await build([getCollection("a1b2c3")])),
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

    expect(unaryType).toEqual(AccessAPI.GetCollectionByID)

    const unaryMockRequest = unaryMock.mock.calls[0][2]
    const unaryMockCollectionId = unaryMockRequest.getId()

    expect(unaryMockCollectionId).not.toBeUndefined()

    expect(response.collection.id).toBe(returnedCollection.id)
    expect(response.collection.transactionIds[0]).toBe(
      returnedCollection.transactionIds[0]
    )
  })
})
