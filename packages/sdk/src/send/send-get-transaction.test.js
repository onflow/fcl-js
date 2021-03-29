import {AccessAPI} from "@onflow/protobuf"
import {sendGetTransaction} from "./send-get-transaction.js"
import {build} from "../build/build.js"
import {getTransaction} from "../build/build-get-transaction.js"
import {resolve} from "../resolve/resolve.js"

const jsonToUInt8Array = (json) => {
    var str = JSON.stringify(json, null, 0);
    var ret = new Uint8Array(str.length);
    for (var i = 0; i < str.length; i++) {
        ret[i] = str.charCodeAt(i);
    }
    return ret
};

describe("Get Transaction", () => {
  test("GetTransactionResult", async () => {
    const unaryMock = jest.fn();

    unaryMock.mockReturnValue({
        getTransaction: () => ({
            getScript_asU8: () => jsonToUInt8Array({type: "String", value: "Cadence Code"}),
            getArgumentsList: () => ([]),
            getReferenceBlockId_asU8: () => jsonToUInt8Array({type: "String", value: "abc123"}),
            getGasLimit: () => 123,
            getProposalKey: () => ({
                getAddress_asU8: () => jsonToUInt8Array({type: "Address", value: "0xABC123"}),
                getKeyId: () => 1,
                getSequenceNumber: () => 1,
            }),
            getPayer_asU8: () => jsonToUInt8Array({type: "Address", value: "0xABC123"}),
            getAuthorizersList: () => ([]),
            getPayloadSignaturesList: () => ([]),
            getEnvelopeSignaturesList: () => ([])
        })
    });

    await sendGetTransaction(
        await resolve(
            await build([
                getTransaction("MyTxID"),
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

    expect(unaryType).toEqual(AccessAPI.GetTransaction)

    const unaryMockRequest = unaryMock.mock.calls[0][2]
    const unaryMockId = unaryMockRequest.getId()

    expect(unaryMockId).not.toBeUndefined()
  })

})