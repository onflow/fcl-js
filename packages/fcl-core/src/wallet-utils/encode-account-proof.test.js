import {encodeAccountProof} from "./encode-account-proof.js"

const address = "0xABC123DEF456"
const appIdentifier = "AWESOME-APP-ID"
const invalidNonce =
  "303736613463633964356462333031663662623932316166346534613139366"
const nonce = "3037366134636339643564623330316636626239323161663465346131393662"
const encodedWithDomainTag =
  "46434c2d4143434f554e542d50524f4f462d56302e3000000000000000000000f8398e415745534f4d452d4150502d4944880000abc123def456a03037366134636339643564623330316636626239323161663465346131393662"
const encodedWithoutDomainTag =
  "f8398e415745534f4d452d4150502d4944880000abc123def456a03037366134636339643564623330316636626239323161663465346131393662"

describe("encode account proof", () => {
  test("encode account proof with invalid nonce", () => {
    const nonce = invalidNonce
    expect.assertions(1)
    expect(() => {
      encodeAccountProof({address, nonce, appIdentifier})
    }).toThrow(Error)
  })

  test("encode account proof with missing address", () => {
    expect.assertions(1)
    expect(() => {
      encodeAccountProof({nonce, appIdentifier})
    }).toThrow(Error)
  })

  test("encode account proof with missing appIdentifier", () => {
    expect.assertions(1)
    expect(() => {
      encodeAccountProof({address, nonce})
    }).toThrow(Error)
  })

  test("encode account proof without domain tag", () => {
    const message = encodeAccountProof({address, nonce, appIdentifier}, false)
    expect(message).toEqual(encodedWithoutDomainTag)
  })

  test("encode account proof with domain tag", () => {
    const message = encodeAccountProof({address, nonce, appIdentifier})
    expect(message).toEqual(encodedWithDomainTag)
  })
})
