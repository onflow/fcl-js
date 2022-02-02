import {sendTransaction} from "./send-transaction.js"
import {build} from "../../sdk/src/build/build.js"
import {transaction} from "../../sdk/src/build/build-transaction.js"
import {proposer} from "../../sdk/src/build/build-proposer.js"
import {payer} from "../../sdk/src/build/build-payer.js"
import {ref} from "../../sdk/src/build/build-ref.js"
import {limit} from "../../sdk/src/build/build-limit.js"
import {authorizations} from "../../sdk/src/build/build-authorizations.js"

import {voucherIntercept} from "../../sdk/src/build/build-voucher-intercept.js"
import {voucherToTxId} from "../../sdk/src/resolve/voucher.js"
import {resolve} from "../../sdk/src/resolve/resolve.js"
import {response as responseADT} from "../../sdk/src/response/response.js"

describe("Transaction", () => {
  test("SendTransaction", async () => {
    const httpRequestMock = jest.fn()

    const returnedTransactionId = "a1b2c3"

    httpRequestMock.mockReturnValue({id: returnedTransactionId})

    const response = await sendTransaction(
      await resolve(
        await build([
          transaction`cadence transaction`,
          proposer({
            addr: "f8d6e0586b0a20c7",
            keyId: 1,
            sequenceNum: 123,
            signingFunction: () => ({
              addr: "f8d6e0586b0a20c7",
              keyId: 1,
              signature: "abc123",
            }),
            resolve: null,
            roles: {
              proposer: true,
              authorizer: false,
              payer: false,
              param: false,
            },
          }),
          payer({
            addr: "f8d6e0586b0a20c7",
            keyId: 1,
            sequenceNum: 123,
            signingFunction: () => ({
              addr: "f8d6e0586b0a20c7",
              keyId: 1,
              signature: "abc123",
            }),
            resolve: null,
            roles: {
              proposer: false,
              authorizer: false,
              payer: true,
              param: false,
            },
          }),
          authorizations([
            {
              addr: "f8d6e0586b0a20c7",
              keyId: 1,
              sequenceNum: 123,
              signingFunction: () => ({
                addr: "f8d6e0586b0a20c7",
                keyId: 1,
                signature: "abc123",
              }),
              resolve: null,
              roles: {
                proposer: false,
                authorizer: true,
                payer: false,
                param: false,
              },
            },
          ]),
          ref("abc123"),
          limit(500),
          voucherIntercept(async voucher => {
            voucherToTxId(voucher)
          }),
        ])
      ),
      {
        response: responseADT,
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
        reference_block_id: "abc123",
        gas_limit: "500",
        payer: "f8d6e0586b0a20c7",
        proposal_key: {
          address: "f8d6e0586b0a20c7",
          key_index: "1",
          sequence_number: "123",
        },
        authorizers: ["f8d6e0586b0a20c7"],
        payload_signatures: [
          {
            address: "f8d6e0586b0a20c7",
            key_index: "1",
            signature: "q8Ej",
          },
        ],
        envelope_signatures: [
          {
            address: "f8d6e0586b0a20c7",
            key_index: "1",
            signature: "q8Ej",
          },
        ],
      },
    })

    expect(response.transactionId).toBe(returnedTransactionId)
  })
})
