// @ts-nocheck
const {encodeMessageFromSignable} = require("../../wallet/encode")
const {derToP256Raw} = require("../../wallet/webauthn")

// Minimal unit test to validate DER -> raw conversion and signable message selection

describe("passkey authz helpers", () => {
  test("derToP256Raw converts padded integers to 64-byte raw", () => {
    // DER for r,s with leading 0x00 (padded); use a synthetic small example
    const der = new Uint8Array([
      0x30,
      0x0a,
      0x02,
      0x03,
      0x00,
      0x01,
      0x02, // r = 0x0102
      0x02,
      0x03,
      0x00,
      0x03,
      0x04, // s = 0x0304
    ])

    const raw = derToP256Raw(der)
    expect(raw.length).toBe(64)
    // Last two bytes of r and s preserved
    expect(raw[30]).toBe(0x01)
    expect(raw[31]).toBe(0x02)
    expect(raw[62]).toBe(0x03)
    expect(raw[63]).toBe(0x04)
  })

  test("encodeMessageFromSignable chooses payload or envelope correctly", () => {
    const VOUCHER: any = {
      cadence: "transaction { }",
      refBlock: "0",
      computeLimit: 100,
      arguments: [],
      proposalKey: {address: "0x02", keyId: 0, sequenceNum: 0},
      payer: "0x01",
      authorizers: ["0x02"],
      payloadSigs: [],
      envelopeSigs: [],
    }

    const signablePayload: any = {
      f_type: "Signable",
      f_vsn: "1.0.1",
      addr: "0x02",
      keyId: 0,
      voucher: VOUCHER,
      roles: {proposer: true, authorizer: false, payer: false, param: false},
    }

    const signableEnvelope: any = {
      f_type: "Signable",
      f_vsn: "1.0.1",
      addr: "0x01",
      keyId: 0,
      voucher: VOUCHER,
      roles: {proposer: false, authorizer: false, payer: true, param: false},
    }

    const m1 = encodeMessageFromSignable(signablePayload, "0x02")
    const m2 = encodeMessageFromSignable(signableEnvelope, "0x01")

    expect(typeof m1).toBe("string")
    expect(typeof m2).toBe("string")
    expect(m1).not.toEqual(m2)
  })
})
