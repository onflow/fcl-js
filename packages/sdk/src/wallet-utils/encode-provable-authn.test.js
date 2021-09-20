import {encodeMessageFromProvableAuthn} from "./encode-provable-authn.js"

const address = "0xABC123DEF456"
const timestamp = 1632179933495
const appTag = "FLOW-JS-SDK"

describe("encode provable authn", () => {
    test("encode provable authn with appTag", () => {
        const message = encodeMessageFromProvableAuthn(address, timestamp, appTag)

        expect(message).toMatchSnapshot()
    })

    test("encode provable authn without appTag", () => {
        const message = encodeMessageFromProvableAuthn(address, timestamp)

        expect(message).toMatchSnapshot()
    })
})
