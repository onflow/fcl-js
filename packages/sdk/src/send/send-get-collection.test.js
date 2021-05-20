import {AccessAPI} from "@onflow/protobuf"
import {sendGetCollection} from "./send-get-collection.js"
import {build} from "../build/build.js"
import {getCollection} from "../build/build-get-collection.js"
import {resolve} from "../resolve/resolve.js"

const jsonToUInt8Array = (json) => {
    var str = JSON.stringify(json, null, 0);
    var ret = new Uint8Array(str.length);
    for (var i = 0; i < str.length; i++) {
        ret[i] = str.charCodeAt(i);
    }
    return ret
};

describe("Send Get Collection", () => {
  test("GetCollection", async () => {
    const unaryMock = jest.fn();

    unaryMock.mockReturnValue({
        getCollection: () => ({
            getId_asU8: () => jsonToUInt8Array({type: "String", value: "123abc"}),
            getTransactionIdsList: () => ([
                jsonToUInt8Array({type: "String", value: "456def"})
            ]),
        })
    });

    await sendGetCollection(
        await resolve(
            await build([
                getCollection("123abc"),
            ])
        ),
        {
            unary: unaryMock
        }
    )

    expect(unaryMock.mock.calls.length).toEqual(1)

    const unaryMockArgs = unaryMock.mock.calls[0]

    expect(unaryMockArgs.length).toEqual(3)

    const unaryType = unaryMock.mock.calls[0][1]

    expect(unaryType).toEqual(AccessAPI.GetCollectionByID)

    const unaryMockRequest = unaryMock.mock.calls[0][2]
    const unaryMockCollectionId = unaryMockRequest.getId()

    expect(unaryMockCollectionId).not.toBeUndefined()
  })

})