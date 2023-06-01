import {sendGetNetworkParameters} from "./send-get-network-parameters.js"
import {
  build,
  getNetworkParameters,
  resolve,
  response as responseADT,
} from "@onflow/sdk"

describe("Get Network Parameters", () => {
  test("GetNetworkParameters", async () => {
    const httpRequestMock = jest.fn()

    const returnedNetworkParameters = {
      chain_id: "flow-emulator",
    }

    httpRequestMock.mockReturnValue(returnedNetworkParameters)

    const response = await sendGetNetworkParameters(
      await resolve(await build([getNetworkParameters()])),
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
