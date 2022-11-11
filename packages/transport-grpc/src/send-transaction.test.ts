import {AccessAPI} from "@onflow/protobuf"
import {sendTransaction} from "./send-transaction"
import {build} from "../../sdk/src/build/build"
import {transaction} from "../../sdk/src/build/build-transaction"
import {proposer} from "../../sdk/src/build/build-proposer"
import {payer} from "../../sdk/src/build/build-payer"
import {ref} from "../../sdk/src/build/build-ref"
import {authorizations} from "../../sdk/src/build/build-authorizations"
import {voucherIntercept} from "../../sdk/src/build/build-voucher-intercept"
import {voucherToTxId} from "../../sdk/src/resolve/voucher"
import {resolve} from "../../sdk/src/resolve/resolve"
import {response as responseADT} from "../../sdk/src/response/response"
import {Buffer} from "@onflow/rlp"

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

const strToUInt8Array = str => {
  var ret = new Uint8Array(str.length)
  for (var i = 0; i < str.length; i++) {
    ret[i] = str.charCodeAt(i)
  }
  return ret
}

describe("Transaction", () => {
  test("SendTransaction", async () => {
    const unaryMock = jest.fn()

    const returnedTransactionId = "a1b2c3"

    unaryMock.mockReturnValue({
      getId_asU8: () => hexStrToUInt8Array("a1b2c3"),
    })

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
              authorizer: true,
              payer: true,
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
              proposer: true,
              authorizer: true,
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
                proposer: true,
                authorizer: true,
                payer: true,
                param: false,
              },
            },
          ]),
          ref("abc123"),
          voucherIntercept(async voucher => {
            voucherToTxId(voucher)
          }),
        ])
      ),
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

    expect(unaryType).toEqual(AccessAPI.SendTransaction)

    const unaryMockRequest = unaryMock.mock.calls[0][2]

    expect(unaryMockRequest).not.toBeUndefined()

    expect(response.transactionId).toBe(returnedTransactionId)
  })
})
