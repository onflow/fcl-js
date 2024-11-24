import {AccessAPI} from "@onflow/protobuf"
import {sendGetNetworkParameters} from "./send-get-network-parameters.js"
import {
  build,
  getNetworkParameters,
  resolve,
  response as responseADT,
} from "@onflow/sdk"

describe("Get Network Parameters", () => {
  test("GetNetworkParametersResult", async () => {
    const unaryMock = jest.fn()

    const returnedNetworkParameters = {
      chainId: "flow-emulator",
    }

    unaryMock.mockReturnValue({
      getChainId: () => "flow-emulator",
    })

    const response = await sendGetNetworkParameters(
      await resolve(await build([getNetworkParameters()])),
      {
        response: responseADT,
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

    expect(unaryType).toEqual(AccessAPI.GetNetworkParameters)

    expect(response.networkParameters).toStrictEqual(returnedNetworkParameters)
  })
})
