import {sendGetCollection} from "./send-get-collection.js"
import {Buffer} from "@onflow/rlp"
import {
  build,
  getCollection,
  resolve,
  response as responseADT,
} from "@onflow/sdk"

describe("Send Get Collection", () => {
  test("GetCollection", async () => {
    const httpRequestMock = jest.fn()

    const returnedCollection = {
      id: "a1b2c3",
      transactions: [
        {
          id: "a1b2c3",
        },
      ],
    }

    httpRequestMock.mockReturnValue(returnedCollection)

    const response = await sendGetCollection(
      await resolve(await build([getCollection("a1b2c3")])),
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
      path: "/v1/collections/a1b2c3?expand=transactions",
      method: "GET",
      body: null,
    })

    expect(response.collection.id).toBe(returnedCollection.id)
    expect(response.collection.transactionIds[0]).toBe("a1b2c3")
  })
})
