import {sendExecuteScript} from "./send-execute-script.js"
import * as types from "@onflow/types"
import {Buffer} from "@onflow/rlp"
import {
  arg,
  args,
  atBlockHeight,
  atBlockId,
  build,
  resolve,
  response as responseADT,
  script,
} from "@onflow/sdk"

describe("Send Execute Script", () => {
  test("ExecuteScriptAtLatestBlock", async () => {
    const httpRequestMock = jest.fn()

    const returnedJSONCDC = Buffer.from(
      JSON.stringify({type: "Int", value: 123})
    ).toString("base64")

    httpRequestMock.mockReturnValue(returnedJSONCDC)

    const cadence = "pub fun main(a: Int): Int { return a }"

    let response = await sendExecuteScript(
      await resolve(
        await build([script(cadence), args([arg(123, types.Int)])])
      ),
      {
        response: responseADT,
        Buffer,
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
      path: "/v1/scripts?block_height=sealed",
      method: "POST",
      body: {
        script: "cHViIGZ1biBtYWluKGE6IEludCk6IEludCB7IHJldHVybiBhIH0=",
        arguments: ["eyJ0eXBlIjoiSW50IiwidmFsdWUiOiIxMjMifQ=="],
      },
    })
    expect(response.encodedData).toEqual(
      JSON.parse(Buffer.from(returnedJSONCDC, "base64").toString())
    )
  })

  test("ExecuteScriptAtBlockID", async () => {
    const httpRequestMock = jest.fn()

    const returnedJSONCDC = Buffer.from(
      JSON.stringify({type: "Int", value: 123})
    ).toString("base64")

    httpRequestMock.mockReturnValue(returnedJSONCDC)

    const cadence = "pub fun main(): Int { return 123 }"

    let response = await sendExecuteScript(
      await resolve(await build([script(cadence), atBlockId(123)])),
      {
        response: responseADT,
        Buffer,
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
      path: "/v1/scripts?block_id=123",
      method: "POST",
      body: {
        script: "cHViIGZ1biBtYWluKCk6IEludCB7IHJldHVybiAxMjMgfQ==",
        arguments: [],
      },
    })
    expect(response.encodedData).toEqual(
      JSON.parse(Buffer.from(returnedJSONCDC, "base64").toString())
    )
  })

  test("ExecuteScriptAtBlockHeight", async () => {
    const httpRequestMock = jest.fn()

    const returnedJSONCDC = Buffer.from(
      JSON.stringify({type: "Int", value: 123})
    ).toString("base64")

    httpRequestMock.mockReturnValue(returnedJSONCDC)

    const cadence = "pub fun main(): Int { return 123 }"

    let response = await sendExecuteScript(
      await resolve(await build([script(cadence), atBlockHeight(123)])),
      {
        response: responseADT,
        Buffer,
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
      path: "/v1/scripts?block_height=123",
      method: "POST",
      body: {
        script: "cHViIGZ1biBtYWluKCk6IEludCB7IHJldHVybiAxMjMgfQ==",
        arguments: [],
      },
    })
    expect(response.encodedData).toEqual(
      JSON.parse(Buffer.from(returnedJSONCDC, "base64").toString())
    )
  })
})
