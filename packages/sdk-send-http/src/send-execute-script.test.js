import {sendExecuteScript} from "./send-execute-script.js"
import {build} from "../build/build.js"
import {script} from "../build/build-script.js"
import {atBlockId} from "../build/build-at-block-id.js"
import {atBlockHeight} from "../build/build-at-block-height.js"
import {resolve} from "../resolve/resolve.js"

describe("Send Execute Script", () => {
  test("ExecuteScriptAtLatestBlock", async () => {
    const httpRequestMock = jest.fn();

    const returnedJSONCDC = {type: "Int", value: 123}

    httpRequestMock.mockReturnValue({
        value: returnedJSONCDC
    })

    const cadence = "pub fun main(): Int { return 123 }"

    let response = await sendExecuteScript(
        await resolve(
            await build([
                script(cadence)
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
        path: "/scripts",
        method: "POST",
        body: { script: "pub fun main(): Int { return 123 }", arguments: [] }
    })
    expect(response.encodedData).toEqual(returnedJSONCDC)
  })

  test("ExecuteScriptAtBlockID", async () => {
    const httpRequestMock = jest.fn();

    const returnedJSONCDC = {type: "Int", value: 123}

    httpRequestMock.mockReturnValue({
        value: returnedJSONCDC
    })

    const cadence = "pub fun main(): Int { return 123 }"

    let response = await sendExecuteScript(
        await resolve(
            await build([
                script(cadence),
                atBlockId(123)
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
        port: null,
        path: "/scripts?block_id=123",
        method: "POST",
        body: { script: "pub fun main(): Int { return 123 }", arguments: [] }
    })
    expect(response.encodedData).toEqual(returnedJSONCDC)
  })

  test("ExecuteScriptAtBlockHeight", async () => {
    const httpRequestMock = jest.fn();

    const returnedJSONCDC = {type: "Int", value: 123}

    httpRequestMock.mockReturnValue({
        value: returnedJSONCDC
    })

    const cadence = "pub fun main(): Int { return 123 }"

    let response = await sendExecuteScript(
        await resolve(
            await build([
                script(cadence),
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
        path: "/scripts?block_height=123",
        method: "POST",
        body: { script: "pub fun main(): Int { return 123 }", arguments: [] }
    })
    expect(response.encodedData).toEqual(returnedJSONCDC)
  })

})