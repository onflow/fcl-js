import {resolveSignatures} from "./resolve-signatures.js"

test("exports function", () => {
  expect(typeof resolveSignatures).toBe("function")
})

test("Golden Path", async () => {
  const signingFunction = jest.fn(() => ({
    addr: "foo",
    keyId: 0,
    signature: "SIGNATURE",
  }))

  const ix = await resolveSignatures({
    tag: "TRANSACTION",
    message: {
      cadence: "foo",
      arguments: [],
      computeLimit: 10,
    },
    accounts: {
      foo: {
        addr: "foo",
        keyId: 0,
        sequenceNum: 0,
        signingFunction: signingFunction,
      },
    },
    proposer: "foo",
    authorizations: ["foo"],
    payer: "foo",
  })

  expect(ix).toMatchSnapshot()
})
