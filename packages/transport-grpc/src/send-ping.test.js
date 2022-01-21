import {AccessAPI} from "@onflow/protobuf"
import {sendPing} from "./send-ping.js"
import {build} from "../../sdk/src/build/build.js"
import {ping} from "../../sdk/src/build/build-ping.js"
import {resolve} from "../../sdk/src/resolve/resolve.js"
import {response as responseADT} from "../../sdk/src/response/response.js"

const jsonToUInt8Array = (json) => {
    var str = JSON.stringify(json, null, 0);
    var ret = new Uint8Array(str.length);
    for (var i = 0; i < str.length; i++) {
        ret[i] = str.charCodeAt(i);
    }
    return ret
};

describe("Ping", () => {
  test("Ping", async () => {
    const unaryMock = jest.fn();

    unaryMock.mockReturnValue({});

    await sendPing(
        await resolve(
            await build([
                ping(),
            ])
        ),
        {
            response: responseADT
        },
        {
            unary: unaryMock,
            node: "localhost:3000"
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