import {sendGetTransactionStatus} from "./send-get-transaction-status.js"
import {Buffer} from "@onflow/rlp"
import {
  build,
  getTransactionStatus,
  resolve,
  response as responseADT,
} from "@onflow/sdk"

describe("Get Transaction Status", () => {
  test("GetTransactionResult", async () => {
    const httpRequestMock = jest.fn()

    const returnedTransactionStatus = {
      blockId: "abc123",
      status: "Pending",
      status_code: 0,
      error_message: "No Error",
      computation_used: "100",
      block_id: "abc123",
      events: [
        {
          type: "MyEvent",
          transaction_id: "a1b2c3",
          transaction_index: "123",
          event_index: "456",
          payload: Buffer.from(
            JSON.stringify({type: "String", value: "Hello, Flow"})
          ).toString("base64"),
        },
      ],
    }

    httpRequestMock.mockReturnValue(returnedTransactionStatus)

    const response = await sendGetTransactionStatus(
      await resolve(await build([getTransactionStatus("MyTxID")])),
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
      path: "/v1/transaction_results/MyTxID",
      method: "GET",
      body: null,
    })

    expect(response.transactionStatus).toStrictEqual({
      blockId: "abc123",
      status: 1,
      statusString: "PENDING",
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
    })
  })
})
