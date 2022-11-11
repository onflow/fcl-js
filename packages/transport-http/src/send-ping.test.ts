import {sendPing} from "./send-ping"
import {build} from "../../sdk/src/build/build"
import {ping} from "../../sdk/src/build/build-ping"
import {resolve} from "../../sdk/src/resolve/resolve"
import {response as responseADT} from "../../sdk/src/response/response"
import {Buffer} from "@onflow/rlp"

describe("Ping", () => {
  test("Ping", async () => {
    const httpRequestMock = jest.fn()

    httpRequestMock.mockReturnValue({})

    await sendPing(
      await resolve(await build([ping()])),
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
      path: "/v1/blocks?height=sealed",
      method: "GET",
      body: null,
    })
  })
})
