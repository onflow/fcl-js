import {sendGetTransactionStatus} from "./send-get-transaction-status.js"
import {build} from "../../sdk/src/build/build.js"
import {getTransactionStatus} from "../../sdk/src/build/build-get-transaction-status.js"
import {resolve} from "../../sdk/src/resolve/resolve.js"
import {response as responseADT} from "../../sdk/src/response/response.js"
import {Buffer} from "@onflow/rlp"
import {sendGetNetworkParameters} from "./send-get-network-parameters.js"
import {getNetworkParameters} from "../../sdk/src/build/build-get-network-parameters.js"

describe("Get Network Parameters", () => {
  test("GetNetworkParameters", async () => {
    const httpRequestMock = jest.fn()

    const returnedNetworkParameters = {
      chain_id: "flow-emulator",
    }

    httpRequestMock.mockReturnValue(returnedNetworkParameters)

    const response = await sendGetNetworkParameters(
      await resolve(await build([getNetworkParameters()]), {
        skipExec: true,
      }),
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
      path: "/v1/network/parameters",
      method: "GET",
      body: null,
    })

    expect(response.networkParameters).toStrictEqual({
      chainId: "flow-emulator",
    })
  })
})
