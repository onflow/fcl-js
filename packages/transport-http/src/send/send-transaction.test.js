import {Buffer} from "@onflow/rlp"
import {
  authorizations,
  build,
  limit,
  payer,
  proposer,
  ref,
  resolve,
  response as responseADT,
  transaction,
  voucherIntercept,
  voucherToTxId,
} from "@onflow/sdk"
import {sendTransaction} from "./send-transaction"

describe("Transaction", () => {
  test("SendTransaction", async () => {
    const httpRequestMock = jest.fn()

    const returnedTransactionId = "a1b2c3"

    httpRequestMock.mockReturnValue({id: returnedTransactionId})

    const built = await build([
      transaction`cadence transaction`,
      proposer({
        addr: "abc",
        keyId: 1,
        sequenceNum: 123,
        signingFunction: () => ({
          addr: "abc",
          keyId: 1,
          signature: "abc123",
        }),
        resolve: null,
        role: {
          proposer: true,
          authorizer: false,
          payer: false,
          param: false,
        },
      }),
      payer({
        addr: "def",
        keyId: 1,
        sequenceNum: 123,
        signingFunction: () => ({
          addr: "def",
          keyId: 1,
          signature: "def456",
        }),
        resolve: null,
        role: {
          proposer: false,
          authorizer: false,
          payer: true,
          param: false,
        },
      }),
      authorizations([
        {
          addr: "abc",
          keyId: 1,
          sequenceNum: 123,
          signingFunction: () => ({
            addr: "abc",
            keyId: 1,
            signature: "abc123",
          }),
          resolve: null,
          role: {
            proposer: false,
            authorizer: true,
            payer: false,
            param: false,
          },
        },
      ]),
      ref("aaaa"),
      limit(500),
      voucherIntercept(async voucher => {
        voucherToTxId(voucher)
      }),
    ])

    const resolved = await resolve(built)

    const response = await sendTransaction(
      resolved,
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
      path: "/v1/transactions",
      method: "POST",
      body: {
        script: "Y2FkZW5jZSB0cmFuc2FjdGlvbg==",
        arguments: [],
        reference_block_id: "aaaa",
        gas_limit: "500",
        payer: "def",
        proposal_key: {
          address: "abc",
          key_index: "1",
          sequence_number: "123",
        },
        authorizers: ["abc"],
        payload_signatures: [
          {
            address: "abc",
            key_index: "1",
            signature: "q8Ej",
          },
        ],
        envelope_signatures: [
          {
            address: "def",
            key_index: "1",
            signature: "3vRW",
          },
        ],
      },
    })

    expect(response.transactionId).toBe(returnedTransactionId)
  })
})
