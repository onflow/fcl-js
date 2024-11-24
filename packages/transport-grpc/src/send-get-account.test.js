import {AccessAPI} from "@onflow/protobuf"
import {sendGetAccount} from "./send-get-account.js"
import {Buffer} from "@onflow/rlp"
import {
  atBlockHeight,
  build,
  getAccount,
  resolve,
  response as responseADT,
} from "@onflow/sdk"

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

describe("Send Get Account", () => {
  test("GetAccountAtBlockHeightRequest", async () => {
    const unaryMock = jest.fn()

    const returnedAccount = {
      address: "0x1654653399040a61",
      code: "contract",
      keys: [],
      balance: 10,
      contracts: {},
    }

    unaryMock.mockReturnValue({
      getAccount: () => ({
        getAddress_asU8: () => hexStrToUInt8Array("1654653399040a61"),
        getCode_asU8: () => strToUInt8Array("contract"),
        getKeysList: () => [],
        getBalance: () => 10,
        getContractsMap: () => ({
          getEntryList: () => [],
        }),
      }),
    })

    const response = await sendGetAccount(
      await resolve(
        await build([getAccount("0x1654653399040a61"), atBlockHeight(123)])
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

    expect(unaryType).toEqual(AccessAPI.GetAccountAtBlockHeight)

    const unaryMockRequest = unaryMock.mock.calls[0][2]
    const unaryMockAddress = unaryMockRequest.getAddress()
    const unaryMockBlockHeight = unaryMockRequest.getBlockHeight()

    expect(unaryMockAddress).not.toBeUndefined()
    expect(unaryMockBlockHeight).not.toBeUndefined()

    expect(response.account).toEqual(returnedAccount)
  })

  test("GetAccountAtLatestBlockRequest", async () => {
    const unaryMock = jest.fn()

    const returnedAccount = {
      address: "0x1654653399040a61",
      code: "contract",
      keys: [],
      balance: 10,
      contracts: {},
    }

    unaryMock.mockReturnValue({
      getAccount: () => ({
        getAddress_asU8: () => hexStrToUInt8Array("1654653399040a61"),
        getCode_asU8: () => strToUInt8Array("contract"),
        getKeysList: () => [],
        getBalance: () => 10,
        getContractsMap: () => ({
          getEntryList: () => [],
        }),
      }),
    })

    const response = await sendGetAccount(
      await resolve(await build([getAccount("0x1654653399040a61")])),
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

    expect(unaryType).toEqual(AccessAPI.GetAccountAtLatestBlock)

    const unaryMockRequest = unaryMock.mock.calls[0][2]
    const unaryMockAddress = unaryMockRequest.getAddress()

    expect(unaryMockAddress).not.toBeUndefined()

    expect(response.account).toEqual(returnedAccount)
  })
})
