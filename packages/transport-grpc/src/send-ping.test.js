import {AccessAPI} from "@onflow/protobuf"
import {sendPing} from "./send-ping.js"
import {Buffer} from "@onflow/rlp"
import {build, ping, resolve, response as responseADT} from "@onflow/sdk"

describe("Ping", () => {
  test("Ping", async () => {
    const unaryMock = jest.fn()

    unaryMock.mockReturnValue({})

    await sendPing(
      await resolve(await build([ping()])),
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

    expect(unaryType).toEqual(AccessAPI.Ping)

    const unaryMockRequest = unaryMock.mock.calls[0][2]

    expect(unaryMockRequest).not.toBeUndefined()
  })
})
