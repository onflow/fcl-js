import {sendGetTransaction} from "./send-get-transaction.js"
import {Buffer} from "@onflow/rlp"
import {
  build,
  getTransaction,
  resolve,
  response as responseADT,
} from "@onflow/sdk"

describe("Get Transaction", () => {
  test("GetTransactionResult", async () => {
    const httpRequestMock = jest.fn()

    const returnedTransaction = {
      script: "Q2FkZW5jZSBDb2Rl",
      arguments: [],
      reference_block_id: "a1b2c3",
      gas_limit: "123",
      proposal_key: {
        address: "1654653399040a61",
        key_id: "1",
        signer_index: "0",
        sequence_number: "1",
      },
      payer: "1654653399040a61",
      authorizers: [],
      payload_signatures: [],
      envelope_signatures: [],
    }

    httpRequestMock.mockReturnValue(returnedTransaction)

    const response = await sendGetTransaction(
      await resolve(await build([getTransaction("MyTxID")])),
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
      path: "/v1/transactions/MyTxID",
      method: "GET",
      body: null,
    })

    expect(response.transaction).toStrictEqual({
      script: "Cadence Code",
      args: [],
      referenceBlockId: "a1b2c3",
      gasLimit: 123,
      proposalKey: {
        address: "1654653399040a61",
        keyId: 1,
        sequenceNumber: 1,
      },
      payer: "1654653399040a61",
      authorizers: [],
      payloadSignatures: [],
      envelopeSignatures: [],
    })
  })
})
