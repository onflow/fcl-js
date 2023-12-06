import {verifyUserSignatures, validateArgs} from "../verify-signatures"

const message = Buffer.from("FOO").toString("hex")

const compSigOne = {
  f_type: "CompositeSignature",
  f_vsn: "1.0.0",
  addr: "0x123",
  keyId: 0,
  signature: "abc123",
}

const compSigTwo = {
  f_type: "CompositeSignature",
  f_vsn: "1.0.0",
  addr: "0x123",
  keyId: 0,
  signature: "abc123",
}

const compSigThree = {
  f_type: "CompositeSignature",
  f_vsn: "1.0.0",
  addr: "0x456",
  keyId: 0,
  signature: "abc123",
}

describe("verifyUserSignatures", () => {
  it("should return true if valid args", async () => {
    const compSigs = [compSigOne, compSigTwo]
    const address = "0x6a32b81933f0ee64"
    const res = await validateArgs({message, address, compSigs})
    expect.assertions(1)
    expect(res).toEqual(true)
  })

  it("should reject if message is not hex string", async () => {
    const compSigs = [compSigOne, compSigTwo]
    expect.assertions(1)
    await expect(verifyUserSignatures("FOO", compSigs)).rejects.toThrow(Error)
  })

  it("should reject if missing array of composite signatures", async () => {
    expect.assertions(1)
    await expect(verifyUserSignatures(message, null)).rejects.toThrow(Error)
  })

  it("should reject if compSigs are from different account addresses", async () => {
    const compSigs = [compSigOne, compSigTwo, compSigThree]
    expect.assertions(1)
    await expect(verifyUserSignatures(message, compSigs)).rejects.toThrow(Error)
  })
})
