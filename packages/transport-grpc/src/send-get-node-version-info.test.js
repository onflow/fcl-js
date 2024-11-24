import {AccessAPI} from "@onflow/protobuf"
import {sendGetNodeVersionInfo} from "./send-get-node-version-info"
import {
  build,
  getNodeVersionInfo,
  resolve,
  response as responseADT,
} from "@onflow/sdk"

describe("Get Network Parameters", () => {
  test("GetNetworkParametersResult", async () => {
    const unaryMock = jest.fn()

    unaryMock.mockReturnValue({
      getInfo: () => ({
        getSemver: () => "0.0.0",
        getCommit: () => "0123456789abcdef",
        getSporkId_asU8: () => new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]),
        getProtocolVersion: () => "999",
        getSporkRootBlockHeight: () => "123",
        getNodeRootBlockHeight: () => "456",
      }),
    })

    const response = await sendGetNodeVersionInfo(
      await resolve(await build([getNodeVersionInfo()])),
      {
        Buffer,
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

    expect(unaryType).toEqual(AccessAPI.GetNodeVersionInfo)

    expect(response.nodeVersionInfo).toStrictEqual({
      semver: "0.0.0",
      commit: "0123456789abcdef",
      sporkId: "00010203040506070809",
      protocolVersion: 999,
      sporkRootBlockHeight: 123,
      nodeRootBlockHeight: 456,
    })
  })
})
