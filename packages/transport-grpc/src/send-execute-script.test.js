import {AccessAPI} from "@onflow/protobuf"
import {sendExecuteScript} from "./send-execute-script.js"
import {Buffer} from "@onflow/rlp"
import {
  atBlockId,
  atBlockHeight,
  build,
  script,
  resolve,
  response as responseADT,
} from "@onflow/sdk"

const jsonToUInt8Array = json => {
  var str = JSON.stringify(json, null, 0)
  var ret = new Uint8Array(str.length)
  for (var i = 0; i < str.length; i++) {
    ret[i] = str.charCodeAt(i)
  }
  return ret
}

describe("Send Execute Script", () => {
  test("ExecuteScriptAtLatestBlock", async () => {
    const unaryMock = jest.fn()

    const returnedJSONCDC = {type: "Int", value: 123}

    unaryMock.mockReturnValue({
      getValue_asU8: () => jsonToUInt8Array(returnedJSONCDC),
    })

    let response = await sendExecuteScript(
      await resolve(await build([script`pub fun main(): Int { return 123 }`])),
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

    expect(unaryType).toEqual(AccessAPI.ExecuteScriptAtLatestBlock)

    const unaryMockRequest = unaryMock.mock.calls[0][2]
    const unaryMockScript = unaryMockRequest.getScript()

    expect(unaryMockScript).not.toBeUndefined()

    expect(response.encodedData).toEqual(returnedJSONCDC)
  })

  test("ExecuteScriptAtBlockID", async () => {
    const unaryMock = jest.fn()

    const returnedJSONCDC = {type: "Int", value: 123}

    unaryMock.mockReturnValue({
      getValue_asU8: () => jsonToUInt8Array(returnedJSONCDC),
    })

    const response = await sendExecuteScript(
      await resolve(
        await build([
          script`pub fun main(): Int { return 123 }`,
          atBlockId("abc123"),
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

    expect(unaryType).toEqual(AccessAPI.ExecuteScriptAtBlockID)

    const unaryMockRequest = unaryMock.mock.calls[0][2]
    const unaryMockScript = unaryMockRequest.getScript()
    const unaryMockBlockID = unaryMockRequest.getBlockId()

    expect(unaryMockScript).not.toBeUndefined()
    expect(unaryMockBlockID).not.toBeUndefined()

    expect(response.encodedData).toEqual(returnedJSONCDC)
  })

  test("ExecuteScriptAtBlockHeight", async () => {
    const unaryMock = jest.fn()

    const returnedJSONCDC = {type: "Int", value: 123}

    unaryMock.mockReturnValue({
      getValue_asU8: () => jsonToUInt8Array(returnedJSONCDC),
    })

    const response = await sendExecuteScript(
      await resolve(
        await build([
          script`pub fun main(): Int { return 123 }`,
          atBlockHeight(123),
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

    expect(unaryType).toEqual(AccessAPI.ExecuteScriptAtBlockHeight)

    const unaryMockRequest = unaryMock.mock.calls[0][2]
    const unaryMockScript = unaryMockRequest.getScript()
    const unaryMockBlockHeight = unaryMockRequest.getBlockHeight()

    expect(unaryMockScript).not.toBeUndefined()
    expect(unaryMockBlockHeight).not.toBeUndefined()

    expect(response.encodedData).toEqual(returnedJSONCDC)
  })
})
