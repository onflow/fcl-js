import {sendGetTransactionStatus} from "./send-get-transaction-status.js"
import {build} from "../../sdk/src/build/build.js"
import {getTransactionStatus} from "../../sdk/src/build/build-get-transaction-status.js"
import {resolve} from "../../sdk/src/resolve/resolve.js"
import {response as responseADT} from "../../sdk/src/response/response.js"

describe("Get Transaction Status", () => {
  test("GetTransactionResult", async () => {
    const httpRequestMock = jest.fn();

    const returnedTransactionStatus = {
        status: "Pending",
        error_message: "No Error",
        computation_used: "100",
        block_id: "abc123",
        events: [
            {
                type: "MyEvent",
                transaction_id: "a1b2c3",
                transaction_index: "123",
                event_index: "456",
                payload: {type: "String", value: "Hello, Flow"}
            }
        ]
    }

    httpRequestMock.mockReturnValue(returnedTransactionStatus);

    const response = await sendGetTransactionStatus(
        await resolve(
            await build([
                getTransactionStatus("MyTxID"),
            ])
        ),
        {
            response: responseADT
        },
        {
            httpRequest: httpRequestMock,
            node: "localhost"
        }
    )

    expect(httpRequestMock.mock.calls.length).toEqual(1)

    const httpRequestMockArgs = httpRequestMock.mock.calls[0]

    expect(httpRequestMockArgs.length).toEqual(1)

    const valueSent = httpRequestMock.mock.calls[0][0]

    expect(valueSent).toEqual({
        hostname: "localhost",
        path: "/transaction_results/MyTxID",
        method: "GET",
        body: null
    })

    expect(response.transactionStatus).toStrictEqual({
        status: 1,
        statusString: "PENDING",
        statusCode: 1,
        errorMessage: "No Error",
        events: [
            {
                type: "MyEvent",
                transactionId: "a1b2c3",
                transactionIndex: 123,
                eventIndex: 456,
                payload: {type: "String", value: "Hello, Flow"}
            }
        ]
    })
  })

})