import {AccessAPI} from "@onflow/protobuf"
import {sendGetAccount} from "./send-get-account.js"
import {build} from "../build/build.js"
import {getAccount} from "../build/build-get-account.js"
import {atBlockHeight} from "../build/build-at-block-height.js"
import {resolve} from "../resolve/resolve.js"

describe("Send Get Account", () => {
  test("GetAccountAtBlockHeightRequest", async () => {
    const httpRequestMock = jest.fn();

    const returnedAccount = {
        address: "0x1654653399040a61",
        keys: [],
        balance: 10,
        contracts: {},
        code: null
    }

    httpRequestMock.mockReturnValue(returnedAccount)

    const response = await sendGetAccount(
        await resolve(
            await build([
                getAccount("0x1654653399040a61"),
                atBlockHeight(123)
            ])
        ),
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
        port: 443,
        path: "/accounts/1654653399040a61?block_height=123",
        method: "GET",
        body: null
    })
    expect(response.account).toEqual(returnedAccount)
  
  })

  test("GetAccountAtLatestBlockRequest", async () => {
    const httpRequestMock = jest.fn();

    const returnedAccount = {
        address: "0x1654653399040a61",
        keys: [],
        balance: 10,
        contracts: {},
        code: null
    }

    httpRequestMock.mockReturnValue(returnedAccount)

    const response = await sendGetAccount(
        await resolve(
            await build([
                getAccount("0x1654653399040a61"),
            ])
        ),
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
        port: 443,
        path: "/accounts/1654653399040a61",
        method: "GET",
        body: null
    })
    expect(response.account).toEqual(returnedAccount)
  })

})