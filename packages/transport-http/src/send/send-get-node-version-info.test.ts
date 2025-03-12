import {sendGetNodeVersionInfo} from "./send-get-node-version-info"
import {
  build,
  getNodeVersionInfo,
  resolve,
  response as responseADT,
} from "@onflow/sdk"

describe("Get Node Version Info", () => {
  test("GetNodeVersionInfo", async () => {
    const httpRequestMock = jest.fn()

    const returnedNodeVersionInfo = {
      semver: "v0.33.11-access-register-cache",
      commit: "4ffc02f147654ef3a936ab1b435e00a5d5d37701",
      spork_id:
        "709530929e4968daff19c303ef1fc5f0a7649b3a1ce7d5ee5202056969524c94",
      protocol_version: "32",
      spork_root_block_height: "65264619",
      node_root_block_height: "65264619",
    }

    httpRequestMock.mockReturnValue(returnedNodeVersionInfo)

    const response = await sendGetNodeVersionInfo(
      await resolve(await build([getNodeVersionInfo()])),
      {
        response: responseADT,
      },
      {
        httpRequest: httpRequestMock,
        node: "localhost:8888",
      }
    )

    expect(httpRequestMock.mock.calls.length).toEqual(1)

    const httpRequestMockArgs = httpRequestMock.mock.calls[0]

    expect(httpRequestMockArgs.length).toEqual(1)

    const valueSent = httpRequestMock.mock.calls[0][0]

    expect(valueSent).toEqual({
      hostname: "localhost:8888",
      path: "/v1/node_version_info",
      method: "GET",
    })

    expect(response.nodeVersionInfo).toStrictEqual({
      semver: "v0.33.11-access-register-cache",
      commit: "4ffc02f147654ef3a936ab1b435e00a5d5d37701",
      sporkId:
        "709530929e4968daff19c303ef1fc5f0a7649b3a1ce7d5ee5202056969524c94",
      protocolVersion: 32,
      sporkRootBlockHeight: 65264619,
      nodeRootBlockHeight: 65264619,
    })
  })
})
