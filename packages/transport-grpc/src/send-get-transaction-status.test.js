import {AccessAPI} from "@onflow/protobuf"
import {sendGetTransactionStatus} from "./send-get-transaction-status.js"
import {Buffer} from "@onflow/rlp"
import {
  build,
  getTransactionStatus,
  resolve,
  response as responseADT,
} from "@onflow/sdk"

const jsonToUInt8Array = json => {
  var str = JSON.stringify(json, null, 0)
  var ret = new Uint8Array(str.length)
  for (var i = 0; i < str.length; i++) {
    ret[i] = str.charCodeAt(i)
  }
  return ret
}

const hexStrToUInt8Array = hex => {
  return new Uint8Array(hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)))
}

describe("Get Transaction Status", () => {
  test("GetTransactionResult", async () => {
    const unaryMock = jest.fn()

    const returnedTransactionStatus = {
      blockId: "aafb34",
      status: 2,
      statusString: "FINALIZED",
      statusCode: 0,
      errorMessage: "No Error",
      events: [
        {
          type: "MyEvent",
          transactionId: "a1b2c3",
          transactionIndex: 123,
          eventIndex: 456,
          payload: {type: "String", value: "Hello, Flow"},
        },
      ],
    }

    unaryMock.mockReturnValue({
      getBlockId_asU8: () => hexStrToUInt8Array("aafb34"),
      getStatus: () => 2,
      getStatusCode: () => 0,
      getErrorMessage: () => "No Error",
      getEventsList: () => [
        {
          getType: () => "MyEvent",
          getTransactionId_asU8: () => hexStrToUInt8Array("a1b2c3"),
          getTransactionIndex: () => 123,
          getEventIndex: () => 456,
          getPayload_asU8: () =>
            jsonToUInt8Array({type: "String", value: "Hello, Flow"}),
        },
      ],
    })

    const response = await sendGetTransactionStatus(
      await resolve(await build([getTransactionStatus("MyTxID")])),
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

    expect(unaryType).toEqual(AccessAPI.GetTransactionResult)

    const unaryMockRequest = unaryMock.mock.calls[0][2]
    const unaryMockId = unaryMockRequest.getId()

    expect(unaryMockId).not.toBeUndefined()

    expect(response.transactionStatus).toStrictEqual(returnedTransactionStatus)
  })
})
