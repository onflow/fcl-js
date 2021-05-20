import {AccessAPI} from "@onflow/protobuf"
import {sendGetAccount} from "./send-get-account.js"
import {build} from "../build/build.js"
import {getAccount} from "../build/build-get-account.js"
import {atBlockHeight} from "../build/build-at-block-height.js"
import {resolve} from "../resolve/resolve.js"

const jsonToUInt8Array = (json) => {
    var str = JSON.stringify(json, null, 0);
    var ret = new Uint8Array(str.length);
    for (var i = 0; i < str.length; i++) {
        ret[i] = str.charCodeAt(i);
    }
    return ret
};

describe("Send Get Account", () => {
  test("GetAccountAtBlockHeightRequest", async () => {
    const unaryMock = jest.fn();

    unaryMock.mockReturnValue({
        getAccount: () => ({
            getAddress_asU8: () => jsonToUInt8Array({type: "Address", value: "0xABC123"}),
            getCode_asU8: () => jsonToUInt8Array({type: "String", value: "contract"}),
            getKeysList: () => [],
            getBalance: () => 10,
            getContractsMap: () => ({
                getEntryList: () => []
            }),
        })
    });

    await sendGetAccount(
        await resolve(
            await build([
                getAccount("0xABC123"),
                atBlockHeight(123)
            ])
        ),
        {
            unary: unaryMock,
        }
    )

    expect(unaryMock.mock.calls.length).toEqual(1)

    const unaryMockArgs = unaryMock.mock.calls[0]

    expect(unaryMockArgs.length).toEqual(3)

    const unaryType = unaryMock.mock.calls[0][1]

    expect(unaryType).toEqual(AccessAPI.GetAccountAtBlockHeight)

    const unaryMockRequest = unaryMock.mock.calls[0][2]
    const unaryMockAddress = unaryMockRequest.getAddress()
    const unaryMockBlockHeight = unaryMockRequest.getBlockHeight()

    expect(unaryMockAddress).not.toBeUndefined()
    expect(unaryMockBlockHeight).not.toBeUndefined()
  })

  test("GetAccountAtBlockHeightRequest", async () => {
    const unaryMock = jest.fn();

    unaryMock.mockReturnValue({
        getAccount: () => ({
            getAddress_asU8: () => jsonToUInt8Array({type: "Address", value: "0xABC123"}),
            getCode_asU8: () => jsonToUInt8Array({type: "String", value: "contract"}),
            getKeysList: () => [],
            getBalance: () => 10,
            getContractsMap: () => ({
                getEntryList: () => []
            }),
        })
    });

    await sendGetAccount(
        await resolve(
            await build([
                getAccount("0xABC123")
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

    expect(unaryType).toEqual(AccessAPI.GetAccountAtLatestBlock)

    const unaryMockRequest = unaryMock.mock.calls[0][2]
    const unaryMockAddress = unaryMockRequest.getAddress()

    expect(unaryMockAddress).not.toBeUndefined()
  })

})