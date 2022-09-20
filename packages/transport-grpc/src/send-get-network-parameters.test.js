import {AccessAPI} from "@onflow/protobuf"
import {getNetworkParameters} from "../../sdk/src/build/build-get-network-parameters.js"
import {build} from "../../sdk/src/build/build.js"
import {resolve} from "../../sdk/src/resolve/resolve.js"
import {response as responseADT} from "../../sdk/src/response/response.js"
import {sendGetNetworkParameters} from "./send-get-network-parameters.js"

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
