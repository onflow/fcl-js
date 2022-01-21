import {sendGetAccount} from "./send-get-account.js"
import {build} from "../../sdk/src/build/build.js"
import {getAccount} from "../../sdk/src/build/build-get-account.js"
import {atBlockHeight} from "../../sdk/src/build/build-at-block-height.js"
import {resolve} from "../../sdk/src/resolve/resolve.js"
import {response as responseADT} from "../../sdk/src/response/response.js"

describe("Send Get Account", () => {
  test("GetAccountAtBlockHeightRequest", async () => {
    const httpRequestMock = jest.fn();

    const returnedAccount = {
        address: "0x1654653399040a61",
        keys: [],
        balance: "10",
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
        path: "/v1/accounts/1654653399040a61?block_height=123&expand=contracts,keys",
        method: "GET",
        body: null
    })
    expect(response.account).toEqual({
        address: "0x1654653399040a61",
        keys: [],
        balance: 10,
        contracts: {},
        code: ""
    })
  
  })

  test("GetAccountAtLatestBlockRequest", async () => {
    const httpRequestMock = jest.fn();

    const returnedAccount = {
        address: "0x1654653399040a61",
        keys: [],
        balance: "10",
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
        path: "/v1/accounts/1654653399040a61?block_height=final&expand=contracts,keys",
        method: "GET",
        body: null
    })
    expect(response.account).toEqual({
        address: "0x1654653399040a61",
        keys: [],
        balance: 10,
        contracts: {},
        code: ""
    })
  })

})